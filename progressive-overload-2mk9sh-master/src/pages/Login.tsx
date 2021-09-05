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
  useIonViewWillEnter,
} from '@ionic/react';

import { LOGIN_MUTATION } from '../data/mutations';

import { userAtom } from '../utils/StorageUtils';

const Login: React.FC = () => {
  const history = useHistory();

  const [, setUser] = useRecoilState<string>(userAtom);

  const [, login] = useMutation(LOGIN_MUTATION);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showLoading, setShowLoading] = useState(false);

  const [alert, setAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useIonViewWillEnter(() => {
    setUser('');
  });

  async function onSignInButtonClick() {
    setShowLoading(true);

    try {
      const { data, error } = await login({ email, password });

      if (data && data.login) {
        setUser(JSON.stringify(data.login));
        setEmail('');
        setPassword('');
        history.push('/page/Exercise', { direction: 'none' });
      } else if (error) {
        setAlert(error.message.replace('[GraphQL] ', ''));
        setShowAlert(true);
      }
    } catch (error) {
      setAlert(error.message.replace('GraphQL', ''));
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
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Login</IonTitle>
          </IonToolbar>
        </IonHeader>

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
          onClick={() => onSignInButtonClick()}
        >
          Login
        </IonButton>

        <IonItem lines='none' style={{ marginTop: '16px' }}>
          <IonLabel>Don't have an account?</IonLabel>
          <IonButton
            fill='clear'
            slot='end'
            onClick={() => history.push('/signup')}
          >
            Sign Up
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

export default Login;
