import { useEffect, useState } from 'react';

import { useClient } from 'urql';

import { alertController, loadingController } from '@ionic/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonMenuButton,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { trash } from 'ionicons/icons';

import { EXERCISES_QUERY } from '../data/queries';
import { DELETE_EXERCISE_MUTATION } from '../data/mutations';
import { showErrorAlert } from '../utils/UiUtils';

const View: React.FC = () => {
  const client = useClient();

  const [exercises, setExercises] = useState([]);

  async function getUserExercises() {
    const loading = await loadingController.create({
      message: 'Loading Exercises',
    });
    loading.present();
    try {
      const { data, error } = await client.query(EXERCISES_QUERY).toPromise();
      if (data && data.exercises) {
        loading.dismiss();
        return data.exercises;
      } else if (error) {
        showErrorAlert(error.message);
      }
    } catch (error) {
      console.error(error);
    }
    loading.dismiss();

    return [];
  }

  useIonViewWillEnter(async () => {
    const exercises = await getUserExercises();
    setExercises(exercises);
  });

  useEffect(() => {
    let isMounted = true;

    async function get() {
      const exercises = await getUserExercises();
      if (isMounted) setExercises(exercises);
    }

    get();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>View</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>View</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {exercises &&
            exercises.map((exercise: any) => {
              const { id, title, sets } = exercise;

              let totalReps = 0;
              let averageWeight = 0;
              for (let si = 0; si < sets.length; si += 1) {
                const { reps, weight } = sets[si];
                totalReps += reps;
                averageWeight += weight;
              }
              if (averageWeight !== 0) {
                averageWeight = Math.round(averageWeight / sets.length);
              }

              return (
                <IonItemSliding key={id}>
                  <IonItem button routerLink={`/page/View/${id}`}>
                    <IonLabel>
                      <h2>{title}</h2>
                      <p>{totalReps} Reps</p>
                      <p>{averageWeight} Avg Weight</p>
                    </IonLabel>
                    <IonNote slot='end'>{sets.length} Sets</IonNote>
                  </IonItem>

                  <IonItemOptions side='end'>
                    <IonItemOption
                      color='danger'
                      onClick={async () => {
                        const deleteSetAlert = await alertController.create({
                          message: `Are you sure you want to delete Exercise "${title}"?`,
                          buttons: [
                            {
                              text: 'Cancel',
                              role: 'cancel',
                              cssClass: 'secondary',
                              handler: () => {},
                            },
                            {
                              text: 'Yes',
                              handler: async () => {
                                const loading = await loadingController.create({
                                  message: `Deleting Exercise "${title}`,
                                });
                                loading.present();

                                try {
                                  const { data, error } = await client
                                    .mutation(DELETE_EXERCISE_MUTATION, { id })
                                    .toPromise();

                                  if (data && data.deleteExercise) {
                                    const exercises = await getUserExercises();
                                    setExercises(exercises);
                                  } else if (error) {
                                    showErrorAlert(error.message);
                                  }
                                } catch (error) {
                                  console.error(error);
                                }

                                loading.dismiss();
                              },
                            },
                          ],
                        });
                        await deleteSetAlert.present();
                      }}
                    >
                      <IonIcon slot='icon-only' icon={trash} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default View;
