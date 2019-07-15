import { Component, Prop, h } from '@stencil/core';
import isEmpty from 'lodash-es/isEmpty';
import store from '../../store';

@Component({
  tag: 'app-form',
  styleUrl: 'app-form.css'
})
export class AppForm {
  private router: HTMLIonRouterElement = document.querySelector("ion-router");

  @Prop() formName: string;

  componentWillLoad() {
    if (isEmpty(store.formio.user) || !store.formio.jwtToken) {
      this.router.push('/', 'root');
    }
  }

  componentDidLoad() {
    if (store.formio.forms.length) {
      store.formio.createForm('formio', this.formName);
    }
  }

  render() {
    const form = store.formio.getForm(this.formName);
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/forms" />
          </ion-buttons>
          <ion-title>{ form ? form.title : 'Form' }</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <div id="formio">

        </div>
      </ion-content>
    ];
  }
}
