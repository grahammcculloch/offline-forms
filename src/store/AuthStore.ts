import { observable, runInAction, action, computed } from "mobx";
import { persist } from "mobx-persist";
import isEmpty from "lodash-es/isEmpty";
import fetchJson from "../helpers/fetch";
import { formIOAppId } from "../helpers/constants";

class AuthStore {
  rootStore: any;

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
      this.user = {};
      this.jwtToken = "";
    });
  }

  getHeaders: any = (headers: object) => ({
    "content-type": "application/json",
    "x-jwt-token": this.jwtToken,
    ...headers,
  });

  @action
  login: any = async (email: string, password: string) => {
    return fetchJson(`https://${formIOAppId}.form.io/user/login/submission`, {
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
  };
}

export default AuthStore;
