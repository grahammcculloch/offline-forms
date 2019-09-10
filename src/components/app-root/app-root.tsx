import { Component, h, Listen } from "@stencil/core";
import { presentToast } from "../../helpers/toast";

@Component({
  tag: "app-root",
  styleUrl: "app-root.css"
})
export class AppRoot {

  componentWillLoad() {
    const channel = new BroadcastChannel('app-channel');
    channel.onmessage = event => {
      presentToast(event.data.message, { color: event.data.color });
    };
  }

  @Listen("swUpdate", { target: 'window' })
  async onSWUpdate() {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration || !registration.waiting) {
      // If there is no registration, this is the first service
      // worker to be installed. registration.waiting is the one
      // waiting to be activiated.
      return;
    }

    const toastCtrl = document.querySelector("ion-toast-controller");
    const toast = await toastCtrl.create({
      message: 'New version available',
      color: 'dark',
      showCloseButton: true,
      closeButtonText: 'Reload'
    });

    await toast.present();
    await toast.onWillDismiss();

    registration.waiting.postMessage("skipWaiting");
    window.location.reload();
  }

  render() {
    return (
      <ion-app>
        <ion-loading-controller />
        <ion-toast-controller />
        <ion-router useHash={false}>
          <ion-route url="/" component="app-login" />
          <ion-route url="/submissions" component="app-submissions" />
          <ion-route url="/forms" component="app-form-list" />
          <ion-route url="/forms/:formName" component="app-form" />
          <ion-route url="/forms/:formName/:submittedAt" component="app-form" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
