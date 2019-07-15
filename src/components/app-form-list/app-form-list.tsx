import { Component, h, State } from "@stencil/core";
import { autorun } from "mobx";
import isEmpty from 'lodash-es/isEmpty';
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
    if (!isEmpty(store.formio.user) && store.formio.jwtToken) {
    await store.formio.getForms();
    } else {
      this.router.push('/', 'root');
    }
  }

  logout = () => {
    store.formio.logout();
    this.router.push('/', 'root');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="end">
            <ion-button onClick={this.logout}>
              Log out
            </ion-button>
          </ion-buttons>
          <ion-title>Forms</ion-title>
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
