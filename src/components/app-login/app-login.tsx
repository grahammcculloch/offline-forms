import { Component, h, State } from "@stencil/core";
import store from "../../store";
import { presentToast } from "../../helpers/toast";

@Component({
  tag: "app-login",
  styleUrl: "app-login.css"
})
export class AppLogin {
  @State() email = {
    error: "",
    value: ""
  };
  @State() password = {
    error: "",
    value: ""
  };
  @State() submitting = false;

  private router: HTMLIonRouterElement = document.querySelector("ion-router");

  componentWillLoad() {
    if (store.auth.isLoggedIn) {
      this.submitting = true;
      this.router.push("/forms");
    }
  }

  handleEmail = ev => {
    this.validateEmail(ev.target.value);
    this.email = {
      ...this.email,
      value: ev.target.value
    };
  };

  handlePassword = ev => {
    this.validatePassword(ev.target.value);
    this.password = {
      ...this.password,
      value: ev.target.value
    };
  };

  validateEmail = (email: string) => {
    this.email = {
      ...this.email,
      error: !email ? "Email is required" : ""
    };
  };

  validatePassword = (password: string) => {
    this.password = {
      ...this.password,
      error: !password ? "Password is required" : ""
    };
  };

  login = async () => {
    this.validatePassword(this.password.value);
    this.validateEmail(this.email.value);

    this.submitting = true;
    if (!this.password.error && !this.email.error) {
      store.auth
        .login(this.email.value, this.password.value)
        .then(() => {
          this.router.push("/forms").then(() => {
            this.submitting = false;
          });
        })
        .catch(({ status, json, message }) => {
          this.submitting = false;
          if (status === 400) {
            const errorMessage = json.details.map(d => d.message).join("\n");
            // TODO: Handle field validation more intelligently
            presentToast(errorMessage, { color: "danger" });
          } else if (status === 401) {
            presentToast(message, { color: "danger" });
          }
        });
    }
  };

  handleKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
      this.login();
    }
  };

  render() {
    return [
      <ion-content class="login-wrapper">
        <ion-row class="ion-justify-content-center">
          <ion-col class="logo-wrapper">
            <img
              src="/assets/icon/icon512.png"
              width="156"
              height="156"
              alt="App logo"
            />
            <h1>Offline Forms</h1>
          </ion-col>
        </ion-row>
        <ion-item class="login-item">
          <ion-label position="stacked">Email</ion-label>
          <ion-input
            type="email"
            inputMode="email"
            value={this.email.value}
            onInput={this.handleEmail}
            required
            autocapitalize="off"
            autofocus
            autocomplete="on"
            spellcheck={false}
          />
        </ion-item>

        <ion-text color="danger" class="login-item">
          <p hidden={!this.email.error || this.submitting} padding-left>
            {this.email.error}
          </p>
        </ion-text>
        <ion-item class="login-item">
          <ion-label position="stacked">Password</ion-label>
          <ion-input
            type="password"
            value={this.password.value}
            onInput={this.handlePassword}
            required
            onKeyDown={this.handleKeyDown}
            clearOnEdit={false}
          />
        </ion-item>

        <ion-text color="danger" class="login-item">
          <p hidden={!this.password.error || this.submitting} padding-left>
            {this.password.error}
          </p>
        </ion-text>

        <div class="login-button">
          <ion-button
            onClick={this.login}
            expand="block"
            disabled={this.submitting}
            type="submit"
          >
            {this.submitting ? <ion-spinner /> : "Login"}
          </ion-button>
        </div>
      </ion-content>
    ];
  }
}
