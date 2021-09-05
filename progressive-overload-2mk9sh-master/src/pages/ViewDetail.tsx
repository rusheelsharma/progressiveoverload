import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { useClient } from 'urql';

import { loadingController } from '@ionic/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItemDivider,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { EXERCISE_BY_ID_QUERY } from '../data/queries';
import { showErrorAlert } from '../utils/UiUtils';

const margin = {
  top: 32,
  right: 32,
  left: 0,
  bottom: 32,
};

const dateFormat: any = { month: 'short', day: 'numeric' };

const ExerciseDetail: React.FC = () => {
  const client = useClient();

  const { id: exerciseId } = useParams<{ id: string }>();

  const [exercise, setExercise] = useState({ title: '', sets: [] });
  const [topSetsData, setTopSetsData] = useState<any[]>([]);
  const [allSetsData, setAllSetsData] = useState<any[]>([]);

  async function getExerciseById(id: number) {
    const loading = await loadingController.create({
      message: 'Loading Exercise',
    });
    loading.present();
    try {
      const { data, error } = await client
        .query(EXERCISE_BY_ID_QUERY, { id })
        .toPromise();

      loading.dismiss();

      if (error) {
        showErrorAlert(error.message);
      }

      const exercise = data.exerciseById;
      let tmpTopSetsData: any[] = [];
      let tmpAllSetsData: any[] = [];
      for (let sI = 0; sI < exercise.sets.length; sI += 1) {
        const set = exercise.sets[sI];
        const { createdAt, reps, weight } = set;
        const dateString = new Date(createdAt).toLocaleString(
          undefined,
          dateFormat
        );

        let isTopSetsExisting = false;
        for (let tsI = 0; tsI < tmpTopSetsData.length; tsI += 1) {
          const { createdAt: tcdCreatedAt } = tmpTopSetsData[tsI];
          if (tcdCreatedAt === dateString) {
            isTopSetsExisting = true;
            if (tmpTopSetsData[tsI]['topWeight'] < weight) {
              tmpTopSetsData[tsI]['topWeight'] = weight;
            }
            break;
          }
        }
        if (!isTopSetsExisting) {
          tmpTopSetsData.push({
            topWeight: weight,
            sets: 0,
            reps: 0,
            weight: 0,
            createdAt: dateString,
          });
        }

        let isAllSetsExisting = false;
        for (let tcdI = 0; tcdI < tmpAllSetsData.length; tcdI += 1) {
          const { createdAt: tcdCreatedAt } = tmpAllSetsData[tcdI];
          if (tcdCreatedAt === dateString) {
            isAllSetsExisting = true;
            tmpAllSetsData[tcdI].sets += 1;
            tmpAllSetsData[tcdI].reps += reps;
            tmpAllSetsData[tcdI].weight += weight;
            break;
          }
        }
        if (!isAllSetsExisting) {
          tmpAllSetsData.push({ ...set, sets: 1, createdAt: dateString });
        }
      }
      for (let tcdI = 0; tcdI < tmpAllSetsData.length; tcdI += 1) {
        tmpAllSetsData[tcdI].weight = Math.round(
          tmpAllSetsData[tcdI].weight / tmpAllSetsData[tcdI].sets
        );
      }
      setAllSetsData(tmpAllSetsData);

      for (let sI = 0; sI < exercise.sets.length; sI += 1) {
        const set = exercise.sets[sI];
        const { reps, weight, createdAt } = set;
        const dateString = new Date(createdAt).toLocaleString(
          undefined,
          dateFormat
        );

        for (let tsI = 0; tsI < tmpTopSetsData.length; tsI += 1) {
          const { createdAt: tcdCreatedAt } = tmpTopSetsData[tsI];
          if (
            dateString === tcdCreatedAt &&
            weight === tmpTopSetsData[tsI]['topWeight']
          ) {
            tmpTopSetsData[tsI].sets += 1;
            tmpTopSetsData[tsI].reps += reps;
            tmpTopSetsData[tsI].weight += weight;
          }
        }
      }
      setTopSetsData(tmpTopSetsData);

      return exercise;
    } catch (error) {
      console.error(error);
    }
    loading.dismiss();

    return [];
  }

  useIonViewWillEnter(async () => {
    const exercise = await getExerciseById(parseInt(exerciseId, 10));
    setExercise(exercise);
  });

  useEffect(() => {
    let isMounted = true;

    async function get() {
      const exercise = await getExerciseById(parseInt(exerciseId, 10));
      if (isMounted) setExercise(exercise);
    }

    get();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, exerciseId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{exercise.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>{exercise.title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItemDivider color='primary' sticky>
          <IonLabel>Top Sets</IonLabel>
        </IonItemDivider>

        <ResponsiveContainer height={300}>
          <LineChart data={topSetsData} syncId='anyId' margin={margin}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='createdAt' />
            <YAxis />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='reps'
              stroke='#8884d8'
              fill='#8884d8'
            />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer height={300}>
          <LineChart data={topSetsData} syncId='anyId' margin={margin}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='createdAt' />
            <YAxis />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='topWeight'
              stroke='#82ca9d'
              fill='#82ca9d'
            />
          </LineChart>
        </ResponsiveContainer>

        <IonItemDivider color='primary' sticky>
          <IonLabel>All Sets</IonLabel>
        </IonItemDivider>

        <ResponsiveContainer height={300}>
          <LineChart data={allSetsData} syncId='anyId' margin={margin}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='createdAt' />
            <YAxis />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='reps'
              stroke='#8884d8'
              fill='#8884d8'
            />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer height={300}>
          <LineChart data={allSetsData} syncId='anyId' margin={margin}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='createdAt' />
            <YAxis />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='weight'
              stroke='#82ca9d'
              fill='#82ca9d'
            />
          </LineChart>
        </ResponsiveContainer>
      </IonContent>
    </IonPage>
  );
};

export default ExerciseDetail;
