import { Component, h, State } from "@stencil/core";
import { autorun } from "mobx";
import store from "../../store";
import { SubmissionState } from "../../store/FormIOStore";

@Component({
  tag: "submissions-button",
  styleUrl: "submissions-button.css"
})
export class SubmissionsButton {
  private router: HTMLIonRouterElement = document.querySelector("ion-router");

  @State() isOnline: boolean = store.formio.isOnline;
  @State() totals: any = store.formio.totals;

  componentWillLoad() {
    autorun(this.update);
  }

  update = () => {
    this.isOnline = store.formio.isOnline;
    this.totals = store.formio.totals;
  };

  showSubmissions = () => {
    this.router.push("/submissions");
  };

  renderIcon() {
    if (!this.isOnline) {
      return [
        <i class="header-icon icon ion-md-cloud" />,
        <div class="icon-overlay">
          <i class="overlayed-icon icon ion-md-close" />
        </div>
      ];
    } else if (this.totals[SubmissionState.Sending]) {
      return [
        <ion-spinner name="bubbles" />,
        <div class="spinner-overlay">
          <span class="spinner-value">
            {this.totals[SubmissionState.Sending] +
              this.totals[SubmissionState.Pending]}
          </span>
        </div>
      ];
    } else if (this.totals[SubmissionState.Failed]) {
      return <i class="header-icon icon ion-md-alert" />;
    }
    return <i class="header-icon icon ion-md-cloud-done" />;
  }

  render() {
    return (
      <ion-button onClick={this.showSubmissions}>
        <span slot="icon-only" class="wrapper">
          {this.renderIcon()}
        </span>
      </ion-button>
    );
  }
}
