import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  render() {
    return (
      <ion-app>
        <ion-loading-controller />
        <ion-toast-controller />
        <ion-router useHash={false}>
          <ion-route url="/" component="app-login" />
          <ion-route url="/forms" component="app-form-list" />
          <ion-route url="/forms/:formName" component="app-form" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
