import { observable, computed, runInAction, action, toJS } from "mobx";
import { persist } from "mobx-persist";
import getTime from "date-fns/get_time";
import reduce from 'lodash-es/reduce';
import cloneDeep from "lodash-es/cloneDeep";
import fetchJson from "../helpers/fetch";
import { formIOAppId } from "../helpers/constants";

interface FormSubmission {
  formTitle: string;
  formId: string;
  formName: string;
  data: object;
  submittedAt: number;
}

export const SubmissionState = {
  Sending: "sending",
  Failed: "failed",
  Pending: "pending"
};

const submissionPredicate = submission => s => {
  return (
    s.submittedAt === submission.submittedAt && s.formId === submission.formId
  );
};

class FormIOStore {
  rootStore: any;

  @observable
  isOnline: boolean;

  @observable
  @persist("list")
  forms: any;

  @observable
  @persist("list")
  submissions: any;

  @computed
  get pendingOrSendingSubmissions() {
    return this.submissions
      .filter(
        s =>
          s.state === SubmissionState.Pending ||
          s.state === SubmissionState.Sending
      )
      .slice();
  }

  @computed
  get failedSubmissions() {
    return this.submissions
      .filter(s => s.state === SubmissionState.Failed)
      .slice();
  }

  @computed
  get totals() {
    return reduce(this.submissions, (acc, s) => {
      acc[s.state] += 1;
      return acc;
    }, {
      [SubmissionState.Failed]: 0,
      [SubmissionState.Pending]: 0,
      [SubmissionState.Sending]: 0,
    });
  }

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    runInAction(() => {
      this.isOnline = navigator.onLine;
      this.forms = [];
      this.submissions = [];
    });
    window.addEventListener("online", () => {
      this.setOnline(true);
      this.processQueue();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.processQueue();
      }
    });

    window.addEventListener("offline", () => this.setOnline(false));
  }

  init() {
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  getForm: any = (formName: string) => {
    return cloneDeep(this.forms.slice().find(f => f.name === formName));
  };

  getSubmission: any = (submittedAt: string) => {
    try {
      const submissionTimestamp = parseInt(submittedAt, 10);
      console.log('Submission timestamp', submissionTimestamp);
      const submission = this.submissions.find(s => s.submittedAt === submissionTimestamp);
      return submission ? toJS(submission) : null;
    } catch (err) {
      console.warn('Failed to get submission', err);
      return null;
    }
  }

  getFormIdAndName: any = (machineName: string) => {
    const [formId, formName] = machineName.split(":");
    return { formId, formName };
  };

  @action
  setOnline: any = (isOnline: boolean) => {
    console.log("Setting online status", isOnline);
    this.isOnline = isOnline;
  };

  @action
  processQueue() {
    this.submissions.slice().forEach(submission => {
      this.processSubmission(submission);
    });
  }

  @action
  addSubmission(
    formTitle: string,
    formId: string,
    formName: string,
    data: object,
    state: string = SubmissionState.Pending
  ): void {
    const submission = {
      formTitle,
      formId,
      formName,
      data,
      submittedAt: getTime(new Date()),
      state
    };
    this.submissions.push(submission);
    console.log("Added submission", this.submissions.length);
  }

  @action
  removeSubmission(submission: FormSubmission): void {
    const index = this.submissions.findIndex(submissionPredicate(submission));
    if (index !== -1) {
      this.submissions.replace([...this.submissions.slice(0, index), ...this.submissions.slice(index + 1)]);
      console.log("Removed submission", submission);
    } else {
      console.warn('removeSubmission: Could not find submission', submission, this.submissions);
    }
  }

  @action
  processSubmission(submission: FormSubmission): void {
    this.setSubmissionState(submission, SubmissionState.Sending);
    this.sendSubmission(submission.formId, submission.formName, submission.data)
      .then(() => {
        this.removeSubmission(submission);
      })
      .catch(() => {
        this.setSubmissionState(submission, SubmissionState.Failed);
      });
  }

  @action
  sendSubmission(
    formId: string,
    formName: string,
    data: object
  ): Promise<Response> {
    return fetch(`https://${formId}.form.io/${formName}`, {
      body: JSON.stringify(data),
      headers: this.rootStore.auth.getHeaders(),
      method: "POST",
      mode: "cors"
    });
  }

  @action
  setSubmissionState(submission: FormSubmission, state: string) {
    const submissionIndex = this.submissions.findIndex(
      submissionPredicate(submission)
    );
    if (submissionIndex !== -1) {
      console.log(`Setting submission state to ${state}`, submission);
      this.submissions[submissionIndex] = {
        ...this.submissions[submissionIndex],
        state
      };
    } else {
      console.warn(
        "setSubmissionState: Could not find submission",
        submission,
        this.submissions
      );
    }
  }

  // @action
  // createForm: any = (
  //   elementId: string,
  //   formName: string,
  //   formData?: object
  // ) => {
  //   const theForm = this.getForm(formName);
  //   const { formId } = this.getFormIdAndName(theForm.machineName);
  //   return window["Formio"]
  //     .createForm(document.getElementById(elementId), {
  //       components: theForm.components
  //     })
  //     .then(form => {
  //       // Prevent the submission from automatically going to the form.io server.
  //       form.nosubmit = true;
  //       if (formData) {
  //         form.submission = {
  //           data: formData
  //         };
  //       }

  //       // Triggered when they click the submit button.
  //       form.on("submit", submission => {
  //         console.log(submission);
  //         return fetch(`https://${formId}.form.io/${formName}`, {
  //           body: JSON.stringify(submission),
  //           headers: this.rootStore.auth.getHeaders(),
  //           method: "POST",
  //           mode: "cors"
  //         })
  //           .then(response => {
  //             form.emit("submitDone", submission);
  //             console.log(response.json());
  //           })
  //           .catch(err => {
  //             console.log("Inner catch", err);
  //             form.setAlert("danger", "Failed to submit form");
  //           });
  //       });

  //       form.on("error", err => {
  //         console.log("on error", err);
  //         form.setAlert("danger", "Failed to submit form");
  //       });
  //     })
  //     .catch(err => {
  //       console.log("Failed to create form", err);
  //     });
  // };

  @action
  getForms: any = async () => {
    return fetchJson(`https://${formIOAppId}.form.io/form?tags=public`, {
      method: "GET",
      headers: new Headers(this.rootStore.auth.getHeaders())
    })
      .then(async response => {
        console.log("Fetch forms successful", response.json);
        runInAction(() => {
          this.forms.replace(response.json);
        });
      })
      .catch(err => {
        console.error("Fetch forms failed", err);
      });
  };
}

export default FormIOStore;
