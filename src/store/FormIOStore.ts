import { observable, runInAction, action, computed } from "mobx";
import { persist } from "mobx-persist";
import isEmpty from 'lodash-es/isEmpty';
import cloneDeep from "lodash-es/cloneDeep";
import fetchJson from "../helpers/fetch";

const appId = 'bplegoghxwvcixb';

class FormIOStore {
  rootStore: any;

  @observable
  @persist("list")
  forms: any;

  @observable
  @persist("object")
  user: any;

  @observable
  @persist
  jwtToken: any;

  @computed
  get isLoggedIn() {
    return !isEmpty(this.user) && !!this.jwtToken;
  }

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    runInAction(() => {
      this.forms = [];
      this.user = {};
      this.jwtToken = "";
    });
  }

  getForm: any = (formName: string) => {
    return this.forms.slice().find(f => f.name === formName);
  };

  @action
  login: any = async (email: string, password: string) => {
    return fetchJson(`https://${appId}.form.io/user/login/submission`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          email,
          password
        }
      })
    })
      .then(async (response: { headers: any; json: any }) => {
        console.log("FormIO user login response", response);
        runInAction(() => {
          this.user = response.json;
          this.jwtToken = response.headers.get("x-jwt-token");
        });
        return Promise.resolve(true);
      })
      .catch(err => {
        console.error("FormIO user login failed", err.json);
        return Promise.reject(err);
      });
  };

  @action
  logout: any = () => {
    this.user = {};
    this.jwtToken = "";
    this.forms.clear();
  };

  @action
  createForm: any = (elementId: string, formName: string) => {
    const theForm = cloneDeep(this.getForm(formName));
    const formId = theForm.machineName.split(":")[0];
    return window["Formio"]
      .createForm(
        document.getElementById(elementId),
        // `https://${formId}.form.io/${formName}`
        { components: theForm.components }
      )
      .then(form => {
        // Prevent the submission from going to the form.io server.
        form.nosubmit = true;

        // Triggered when they click the submit button.
        form.on("submit", submission => {
          console.log(submission);
          return fetch(`https://${formId}.form.io/${formName}`, {
            body: JSON.stringify(submission),
            headers: {
              "content-type": "application/json",
              "x-jwt-token": this.jwtToken
            },
            method: "POST",
            mode: "cors"
          }).then(response => {
            form.emit("submitDone", submission);
            console.log(response.json());
          }).catch(err => {
            console.log('Inner catch', err);
            form.setAlert('danger', 'Failed to submit form');
          });
        });

        form.on("error", err => {
          console.log('on error', err);
          form.setAlert('danger', 'Failed to submit form');
        });
      })
      .catch(err => {
        console.log("Failed to create form", err);
      });
  };

  @action
  getForms: any = async () => {
    console.log("getForms", this.jwtToken);
    return fetchJson(`https://${appId}.form.io/form?tags=public`, {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
        "x-jwt-token": this.jwtToken
      })
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
