import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useClient } from 'urql';

import { alertController, loadingController } from '@ionic/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  idCardOutline,
  keyOutline,
  logOutOutline,
  trashOutline,
} from 'ionicons/icons';

import { ME_QUERY } from '../data/queries';
import {
  CHANGE_PASSWORD_MUTATION,
  CHANGE_USERNAME_MUTATION,
  DELETE_ACCOUNT_MUTATION,
} from '../data/mutations';
import { showErrorAlert } from '../utils/UiUtils';

const Account: React.FC = () => {
  const history = useHistory();

  const client = useClient();

  const [user, setUser] = useState({ name: '', email: '' });

  async function getUser() {
    const loading = await loadingController.create({
      message: 'Loading User',
    });
    loading.present();
    try {
      const { data, error } = await client.query(ME_QUERY).toPromise();
      if (data && data.me) {
        loading.dismiss();
        return data.me;
      } else if (error) {
        showErrorAlert(error.message);
      }
    } catch (error) {
      await showErrorAlert(error);
    }
    loading.dismiss();
    return {};
  }

  useEffect(() => {
    let isMounted = true;

    async function get() {
      const user = await getUser();
      if (isMounted) setUser(user);
    }

    get();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  async function onEditProfileClick() {
    const changeUsernameAlert = await alertController.create({
      header: 'Change Username',
      inputs: [
        {
          name: 'username',
          type: 'text',
          value: user.name,
          placeholder: 'Enter New Username',
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
          text: 'Ok',
          handler: async ({ username }) => {
            const loading = await loadingController.create({
              message: 'Changing Username',
            });
            loading.present();

            try {
              const { data, error } = await client
                .mutation(CHANGE_USERNAME_MUTATION, {
                  name: username,
                })
                .toPromise();
              if (data && data.changeUsername) {
                const user = await getUser();
                setUser(user);
              } else if (error) {
                showErrorAlert(error.message);
              }
            } catch (error) {
              await showErrorAlert(error);
            }

            loading.dismiss();
          },
        },
      ],
    });
    await changeUsernameAlert.present();
  }

  async function onChangePasswordClick() {
    const changePasswordAlert = await alertController.create({
      header: 'Change Password',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Enter Current Password',
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Enter New Password',
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
          text: 'Ok',
          handler: async ({ currentPassword, newPassword }) => {
            const loading = await loadingController.create({
              message: 'Changing Password',
            });
            loading.present();

            try {
              const { data, error } = await client
                .mutation(CHANGE_PASSWORD_MUTATION, {
                  currentPassword,
                  newPassword,
                })
                .toPromise();
              if (data && data.changePassword) {
                onLogOutClick();
              } else if (error) {
                showErrorAlert(error.message);
              }
            } catch (error) {
              await showErrorAlert(error);
            }

            loading.dismiss();
          },
        },
      ],
    });
    await changePasswordAlert.present();
  }

  async function onDeleteAccountClick() {
    const deleteAccountAlert = await alertController.create({
      message: `Are you sure you want to delete your account?`,
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
              message: `Deleting Account`,
            });
            loading.present();

            try {
              const { data, error } = await client
                .mutation(DELETE_ACCOUNT_MUTATION)
                .toPromise();

              if (data && data.deleteAccount) {
                onLogOutClick();
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
    await deleteAccountAlert.present();
  }

  async function onLogOutClick() {
    history.push('/login');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Account</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList lines='none'>
          <IonItem>
            <IonLabel>{user.name}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>{user.email}</IonLabel>
          </IonItem>
        </IonList>

        <IonButton
          className='ion-padding'
          expand='block'
          onClick={onEditProfileClick}
        >
          <IonIcon slot='start' icon={idCardOutline} />
          Edit Profile
        </IonButton>
        <IonButton
          className='ion-padding'
          expand='block'
          color='tertiary'
          onClick={onChangePasswordClick}
        >
          <IonIcon slot='start' icon={keyOutline} />
          Change Password
        </IonButton>

        <IonButton
          className='ion-padding'
          expand='block'
          color='warning'
          onClick={onLogOutClick}
        >
          <IonIcon slot='start' icon={logOutOutline} />
          Log out
        </IonButton>

        <IonButton
          className='ion-padding'
          expand='block'
          color='danger'
          onClick={onDeleteAccountClick}
        >
          <IonIcon slot='start' icon={trashOutline} />
          Delete Account
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Account;
