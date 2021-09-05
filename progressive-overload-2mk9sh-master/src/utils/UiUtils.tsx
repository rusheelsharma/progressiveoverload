import { alertController } from '@ionic/core';

export async function showErrorAlert(errorMessage: string) {
  const errorAlert = await alertController.create({
    header: 'Error',
    message: errorMessage.replace('[GraphQL] ', ''),
  });
  await errorAlert.present();
}
