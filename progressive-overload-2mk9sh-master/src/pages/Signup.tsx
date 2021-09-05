import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useRecoilState } from 'recoil';

import { useMutation } from 'urql';

import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { SIGNUP_MUTATION } from '../data/mutations';

import { userAtom } from '../utils/StorageUtils';

const Signup: React.FC = () => {
  const history = useHistory();

  const [, setUser] = useRecoilState<string>(userAtom);

  const [, signup] = useMutation(SIGNUP_MUTATION);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showLoading, setShowLoading] = useState(false);

  const [alert, setAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  async function onSignupButtonClick() {
    setShowLoading(true);

    try {
      const { data, error } = await signup({ name, email, password });

      if (data && data.signup) {
        setUser(JSON.stringify(data.signup));
        history.push('/page/Exercise', { direction: 'none' });
      } else if (error) {
        setAlert(error.message.replace('[GraphQL] ', ''));
        setShowAlert(true);
      }
    } catch (error) {
      setAlert(error.message.replace('[GraphQL] ', ''));
      setShowAlert(true);
    }

    setShowLoading(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Sign Up</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItem>
          <IonLabel position='floating'>
            Username
            <IonText color='danger'>*</IonText>
          </IonLabel>
          <IonInput
            type='text'
            value={name}
            onIonChange={(e) => {
              setName((e.target as HTMLInputElement).value);
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position='floating'>
            Email
            <IonText color='danger'>*</IonText>
          </IonLabel>
          <IonInput
            type='email'
            value={email}
            onIonChange={(e) => {
              setEmail((e.target as HTMLInputElement).value);
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position='floating'>
            Password
            <IonText color='danger'>*</IonText>
          </IonLabel>
          <IonInput
            type='password'
            value={password}
            onIonChange={(e) => {
              setPassword((e.target as HTMLInputElement).value);
            }}
          />
        </IonItem>

        <IonButton
          expand='block'
          type='submit'
          style={{ marginTop: '32px' }}
          onClick={() => onSignupButtonClick()}
        >
          Sign Up
        </IonButton>

        <IonItem lines='none' style={{ marginTop: '16px' }}>
          <IonLabel>Already have an account?</IonLabel>
          <IonButton
            fill='clear'
            slot='end'
            onClick={() => history.push('/login')}
          >
            Login
          </IonButton>
        </IonItem>

        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message='Loading'
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alert}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Signup;
