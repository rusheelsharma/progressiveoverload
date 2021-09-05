import { useRef } from 'react';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { arrowForward } from 'ionicons/icons';

import './Help.css';

const Help: React.FC = () => {
  const slidesRef = useRef<any>();

  async function nextBtnOnClick() {
    if (slidesRef.current) {
      const isEnd = await slidesRef.current.isEnd();
      if (isEnd) {
        slidesRef.current.slideTo(0);
      } else {
        slidesRef.current.slideNext();
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Help</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='ion-padding' scrollY={false}>
        <IonSlides ref={slidesRef}>
          <IonSlide>
            <h2>Exercise Page</h2>
            <p>
              To add an exercise, Click on the “exercise” tab in the nav bar.
            </p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/img/help/0.png`}
              alt='help-screenshot'
            />
          </IonSlide>

          <IonSlide>
            <h2>Add Exercise</h2>
            <p>Click on the + button to add an exercise.</p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/img/help/1.png`}
              alt='help-screenshot'
            />
          </IonSlide>

          <IonSlide>
            <h2>Add Set</h2>
            <p>Click on the exercise to add sets, reps, and weight.</p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/img/help/2.png`}
              alt='help-screenshot'
            />
          </IonSlide>

          <IonSlide>
            <h2>Delete Exercise</h2>
            <p>
              To delete an exercise, swipe left on the exercise and click the
              delete button
            </p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/img/help/3.gif`}
              alt='help-screenshot'
            />
          </IonSlide>

          <IonSlide>
            <h2>View Page</h2>
            <p>Click on the exercise you wish to view progress for</p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/img/help/4.png`}
              alt='help-screenshot'
            />
          </IonSlide>

          <IonSlide>
            <h2>View Page</h2>
            <p>Hover over the values in the graph to see the data plotted</p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/img/help/5.png`}
              alt='help-screenshot'
            />
          </IonSlide>

          <IonSlide>
            <h2>Account Page</h2>
            <p>Click on “edit profile” to change username</p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/img/help/6.png`}
              alt='help-screenshot'
            />
          </IonSlide>
        </IonSlides>
      </IonContent>

      <IonFooter className='ion-no-border'>
        <IonToolbar>
          <IonButton
            size='large'
            fill='clear'
            expand='block'
            onClick={nextBtnOnClick}
          >
            <IonIcon icon={arrowForward}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Help;
