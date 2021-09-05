import { useMemo } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useRecoilState } from 'recoil';

import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import {
  createClient,
  Provider,
  dedupExchange,
  fetchExchange,
  errorExchange,
} from 'urql';
import { makeOperation } from '@urql/core';
import { authExchange } from '@urql/exchange-auth';

import Menu from './components/Menu';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';

import Home from './pages/Home';
import Exercise from './pages/Exercise';
import ExerciseDetail from './pages/ExerciseDetail';
import View from './pages/View';
import ViewDetail from './pages/ViewDetail';
import Help from './pages/Help';
import Account from './pages/Account';

import { userAtom } from './utils/StorageUtils';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const devUrl = `${process.env.REACT_APP_LOCAL_URL}`;
const prodUrl = 'https://progressive-overload-server.herokuapp.com';
const url = process.env.NODE_ENV === 'development' ? devUrl : prodUrl;

const App: React.FC = () => {
  const [user] = useRecoilState<string>(userAtom);

  const client = useMemo(() => {
    if (!user) {
      return createClient({
        url,
        exchanges: [dedupExchange, fetchExchange],
      });
    }

    return createClient({
      url,
      exchanges: [
        dedupExchange,
        errorExchange({
          onError: (error) => {
            console.error(error);
          },
        }),
        authExchange({
          getAuth: async ({ authState }) => {
            if (!authState) {
              if (user) {
                const { token } = JSON.parse(user);
                if (token) {
                  return { token };
                }
              }
              return null;
            }
            return null;
          },
          addAuthToOperation: ({ authState, operation }: any) => {
            // the token isn't in the auth state, return the operation without changes
            if (!authState || !authState.token) {
              return operation;
            }

            // fetchOptions can be a function (See Client API) but you can simplify this based on usage
            const fetchOptions =
              typeof operation.context.fetchOptions === 'function'
                ? operation.context.fetchOptions()
                : operation.context.fetchOptions || {};

            return makeOperation(operation.kind, operation, {
              ...operation.context,
              fetchOptions: {
                ...fetchOptions,
                headers: {
                  ...fetchOptions.headers,
                  Authorization: `Bearer ${authState.token}`,
                },
              },
            });
          },
          didAuthError: ({ error }) => {
            // check if the error was an auth error (this can be implemented in various ways, e.g. 401 or a special error code)
            return error.graphQLErrors.some(
              (e) => e.extensions?.code === 'FORBIDDEN'
            );
          },
          willAuthError: ({ authState }) => {
            if (!authState) return true;
            // e.g. check for expiration, existence of auth etc
            return false;
          },
        }),
        fetchExchange,
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Provider value={client}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId='main'>
            <Menu />
            <IonRouterOutlet id='main'>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/signup'>
                <Signup />
              </Route>

              <Route path='/' exact={true}>
                <Redirect to='/page/Exercise' />
              </Route>

              <PrivateRoute path='/page/Home' exact={true}>
                <Home />
              </PrivateRoute>

              <PrivateRoute path='/page/Exercise' exact={true}>
                <Exercise />
              </PrivateRoute>
              <PrivateRoute path='/page/Exercise/:id' exact={true}>
                <ExerciseDetail />
              </PrivateRoute>

              <PrivateRoute path='/page/View' exact={true}>
                <View />
              </PrivateRoute>
              <PrivateRoute path='/page/View/:id' exact={true}>
                <ViewDetail />
              </PrivateRoute>

              <Route path='/page/Help' exact={true}>
                <Help />
              </Route>

              <PrivateRoute path='/page/Account' exact={true}>
                <Account />
              </PrivateRoute>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </Provider>
  );
};

export default App;
