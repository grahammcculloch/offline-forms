import { Component, State, h } from "@stencil/core";
import format from "date-fns/format";
import { SubmissionState } from "../../store/FormIOStore";
import store from "../../store";

@Component({
  tag: "app-submissions",
  styleUrl: "app-submissions.css"
})
export class AppSubmissions {
  private router: HTMLIonRouterElement = document.querySelector("ion-router");

  @State() submissions: any = [];

  componentWillLoad() {
    store.formio.submissions.observe(this.updateSubmissions, true);
  }

  updateSubmissions = (...args) => {
    console.log("Updating submissions");
    this.submissions = args[0].object.slice();
  };

  deleteSubmission = submission => {
    store.formio.removeSubmission(submission);
  };

  refresh = () => {
    store.formio.processQueue();
  };

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/forms" />
          </ion-buttons>
          <ion-title>Submissions</ion-title>
          {this.submissions.length ? (
            <ion-buttons slot="end">
              <ion-button onClick={this.refresh}>
                <i slot="icon-only" class="header-icon icon ion-md-refresh"></i>
              </ion-button>
            </ion-buttons>
          ) : null}
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        {this.submissions.length ? (
          <ion-list>
            {this.submissions.map(submission => (
              <ion-item-sliding>
                <ion-item
                  href={`/forms/${submission.formName}/${submission.submittedAt}`}
                >
                  <div class="submission">
                    <div class="submission--name">{submission.formTitle}</div>
                    <div class="submission--date">
                      {format(submission.submittedAt, "Do MMM, h:mm a")}
                    </div>
                  </div>
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option
                    color="danger"
                    onClick={() => {
                      this.deleteSubmission(submission);
                    }}
                  >
                    <ion-icon name="trash" size="large"></ion-icon>
                  </ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
            ))}
          </ion-list>
        ) : (
          <div class="empty-wrapper">
            <p>No pending form submissions</p>
          </div>
        )}
      </ion-content>
    ];
  }
}
