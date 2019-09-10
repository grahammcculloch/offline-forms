import { configure } from "mobx";
import { create } from "mobx-persist";
import FormIOStore from "./FormIOStore";
import AuthStore from "./AuthStore";

configure({ enforceActions: "always" });

class Store {
  formio: any;
  auth: any;
  hydrate: any;

  constructor() {
    this.formio = new FormIOStore(this);
    this.auth = new AuthStore(this);
    this.hydrate = create({
      jsonify: true
    });
    this.hydrate("auth", this.auth);
    this.hydrate("formio", this.formio);
    this.formio.init();
  }
}

export default new Store();
