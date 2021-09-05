import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { useClient } from 'urql';

import { alertController, loadingController } from '@ionic/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';

import { EXERCISE_BY_ID_QUERY } from '../data/queries';
import { CREATE_SET_MUTATION, DELETE_SET_MUTATION } from '../data/mutations';
import { showErrorAlert } from '../utils/UiUtils';

const ExerciseDetail: React.FC = () => {
  const client = useClient();

  const { id: exerciseId } = useParams<{ id: string }>();

  const [exercise, setExercise] = useState({ title: '', sets: [] });

  async function getExerciseById(id: number) {
    const loading = await loadingController.create({
      message: 'Loading Exercise',
    });
    loading.present();
    try {
      const { data, error } = await client
        .query(EXERCISE_BY_ID_QUERY, { id })
        .toPromise();
      if (data && data.exerciseById) {
        loading.dismiss();
        return data.exerciseById;
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

        <IonList lines='none'>
          {exercise.sets.map((set: any, index: number) => {
            const { id: setId, reps, weight, createdAt } = set;
            return (
              <div key={setId}>
                <IonListHeader lines='full'>
                  <IonLabel color='primary'>
                    Set {index + 1} - {new Date(createdAt).toLocaleString()}
                  </IonLabel>
                </IonListHeader>

                <IonGrid>
                  <IonRow>
                    <IonCol size='6'>
                      <IonItem>
                        <IonLabel style={{ textAlign: 'center' }}>
                          <h4>Reps</h4>
                          <h1>{reps}</h1>
                        </IonLabel>
                      </IonItem>
                    </IonCol>

                    <IonCol size='6'>
                      <IonItem>
                        <IonLabel style={{ textAlign: 'center' }}>
                          <h4>Weight</h4>
                          <h1>{weight}</h1>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <IonItem lines='none'>
                  <IonButton
                    slot='end'
                    size='small'
                    color='danger'
                    onClick={async () => {
                      const deleteSetAlert = await alertController.create({
                        message: `Are you sure you want to delete Set ${
                          index + 1
                        }?`,
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
                                message: `Deleting Set ${index + 1}`,
                              });
                              loading.present();

                              try {
                                const { data, error } = await client
                                  .mutation(DELETE_SET_MUTATION, { id: setId })
                                  .toPromise();

                                if (data && data.deleteSet) {
                                  const exercise = await getExerciseById(
                                    parseInt(exerciseId, 10)
                                  );
                                  setExercise(exercise);
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
                    Delete
                  </IonButton>
                </IonItem>
              </div>
            );
          })}
        </IonList>

        <IonFab
          horizontal='end'
          vertical='bottom'
          onClick={async () => {
            const addSetAlert = await alertController.create({
              header: 'Add New Set',
              inputs: [
                {
                  name: 'reps',
                  type: 'number',
                  placeholder: 'Enter Reps',
                },
                {
                  name: 'weight',
                  type: 'number',
                  placeholder: 'Enter Weight',
                },
              ],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {},
                },
                {
                  text: 'Add',
                  handler: async ({ reps, weight }) => {
                    const loading = await loadingController.create({
                      message: 'Adding New Set',
                    });
                    loading.present();

                    try {
                      const { data, error } = await client
                        .mutation(CREATE_SET_MUTATION, {
                          exerciseId: parseInt(exerciseId, 10),
                          reps: parseInt(reps, 10),
                          weight: parseFloat(weight),
                        })
                        .toPromise();
                      if (data && data.createSet) {
                        const exercise = await getExerciseById(
                          parseInt(exerciseId, 10)
                        );
                        setExercise(exercise);
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
            await addSetAlert.present();
          }}
        >
          <IonFabButton>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ExerciseDetail;
