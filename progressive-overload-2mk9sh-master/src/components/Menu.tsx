import { useRecoilState } from 'recoil';

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  barbellOutline,
  barbellSharp,
  eyeOutline,
  eyeSharp,
  helpOutline,
  helpSharp,
  homeOutline,
  homeSharp,
  personOutline,
  personSharp,
} from 'ionicons/icons';

import { userAtom } from '../utils/StorageUtils';

import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/page/Home',
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: 'Exercise',
    url: '/page/Exercise',
    iosIcon: barbellOutline,
    mdIcon: barbellSharp,
  },
  {
    title: 'View',
    url: '/page/View',
    iosIcon: eyeOutline,
    mdIcon: eyeSharp,
  },
  {
    title: 'Help',
    url: '/page/Help',
    iosIcon: helpOutline,
    mdIcon: helpSharp,
  },
  {
    title: 'Account',
    url: '/page/Account',
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  const [user] = useRecoilState<string>(userAtom);

  return (
    <IonMenu contentId='main' type='overlay'>
      <IonContent>
        <IonList id='menu-list'>
          <IonListHeader>Progressive Overload</IonListHeader>

          {user && JSON.parse(user).user && (
            <IonNote>{JSON.parse(user).user.email}</IonNote>
          )}

          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname.indexOf(appPage.url) !== -1
                      ? 'selected'
                      : ''
                  }
                  routerLink={appPage.url}
                  routerDirection='none'
                  lines='none'
                  detail={false}
                >
                  <IonIcon
                    slot='start'
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
