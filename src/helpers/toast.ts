export const presentToast = async (message: string, options: any = {}) => {
  const toastController = document.querySelector('ion-toast-controller');
  await toastController.componentOnReady();

  const toast = await toastController.create({
    duration: 2000,
    ...options,
    message,
  });
  return await toast.present();
}

