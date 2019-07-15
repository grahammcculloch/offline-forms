import { configure } from "mobx";
import { create } from "mobx-persist";
import FormIOStore from "./FormIOStore";

configure({ enforceActions: "always" });

class Store {
  formio: any;
  hydrate: any;

  constructor() {
    this.formio = new FormIOStore(this);
    this.hydrate = create({
      jsonify: true
    });
    this.hydrate("formio", this.formio);
  }
}

export default new Store();
