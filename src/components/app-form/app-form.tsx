import { Component, Prop, h } from "@stencil/core";
import store from "../../store";
import { presentToast } from "../../helpers/toast";

@Component({
  tag: "app-form",
  styleUrl: "app-form.css"
})
export class AppForm {
  private router: HTMLIonRouterElement = document.querySelector("ion-router");

  @Prop() formName: string;
  @Prop() submittedAt: string;

  componentWillLoad() {
    if (!store.auth.isLoggedIn) {
      this.router.push("/", "root");
    }
  }

  componentDidLoad() {
    const formIOForm = store.formio.getForm(this.formName);
    const submission = this.submittedAt ? store.formio.getSubmission(this.submittedAt) : null;
    console.log('Submission retrieved', submission, this.submittedAt);
    if (formIOForm) {
      window["Formio"]
        .createForm(document.getElementById("formio"), {
          components: formIOForm.components
        })
        .then(form => {
          // Prevent the submission from automatically going to the form.io server.
          form.nosubmit = true;
          if (submission) {
            form.submission = submission.data;
          }
          // Triggered when they click the submit button.
          form.on("submit", submission => {
            const [formId, formName] = formIOForm.machineName.split(":");

            store.formio
              .sendSubmission(formId, formName, submission)
              .then(() => {
                form.emit("submitDone", submission);
              })
              .catch(err => {
                console.log("Failed to submit form", err);
                store.formio.addSubmission(formIOForm.title, formId, formName, submission);
                form.emit("submitDone", submission);
                presentToast(
                  "Form submission is saved and will be sent when you're back online",
                  { color: "warning" }
                );
              });
          });
        })
        .catch(err => {
          console.log("Failed to create form", err);
        });
    } else {
      console.warn(`Form '${this.formName}' not found`);
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
          <ion-title>{form ? form.title : "Form"}</ion-title>
          <ion-buttons slot="end">
            <submissions-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
      <div id="formio" />
      </ion-content>
    ];
  }
}
