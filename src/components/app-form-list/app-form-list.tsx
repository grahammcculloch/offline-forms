import { Component, h, State } from "@stencil/core";
import { autorun } from "mobx";
import store from "../../store";

@Component({
  tag: "app-form-list",
  styleUrl: "app-form-list.css"
})
export class AppFormList {
  private router: HTMLIonRouterElement = document.querySelector("ion-router");

  @State() forms: any = null;

  constructor() {
    autorun(() => {
      this.forms = store.formio.forms.slice();
    });
  }

  async componentWillLoad() {
    if (store.auth.isLoggedIn) {
      await store.formio.getForms();
    } else {
      this.router.push('/', 'root');
    }
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission(status => {
        // status will either be 'default', 'granted' or 'denied'
        console.log(`Notification permissions have been ${status}`);
      });
    }
  }

  logout = () => {
    store.auth.logout();
    this.router.push('/', 'root');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button onClick={this.logout}>
              <i slot="icon-only" class="header-icon icon ion-md-log-out"></i>
            </ion-button>
          </ion-buttons>
          <ion-title>Forms</ion-title>
          <ion-buttons slot="end">
            <submissions-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        {this.forms ? (
          <ion-list>
            {this.forms.map(form => (
              <ion-item href={`/forms/${form.name}`}>
                <ion-label>{form.title}</ion-label>
              </ion-item>
            ))}
          </ion-list>
        ) : (
          <div class="spinner-wrapper">
            <ion-spinner />
          </div>
        )}
      </ion-content>
    ];
  }
}
