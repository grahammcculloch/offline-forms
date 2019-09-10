/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface AppForm {
    'formName': string;
    'submittedAt': string;
  }
  interface AppFormList {}
  interface AppLogin {}
  interface AppRoot {}
  interface AppSubmissions {}
  interface SubmissionsButton {}
}

declare global {


  interface HTMLAppFormElement extends Components.AppForm, HTMLStencilElement {}
  var HTMLAppFormElement: {
    prototype: HTMLAppFormElement;
    new (): HTMLAppFormElement;
  };

  interface HTMLAppFormListElement extends Components.AppFormList, HTMLStencilElement {}
  var HTMLAppFormListElement: {
    prototype: HTMLAppFormListElement;
    new (): HTMLAppFormListElement;
  };

  interface HTMLAppLoginElement extends Components.AppLogin, HTMLStencilElement {}
  var HTMLAppLoginElement: {
    prototype: HTMLAppLoginElement;
    new (): HTMLAppLoginElement;
  };

  interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {}
  var HTMLAppRootElement: {
    prototype: HTMLAppRootElement;
    new (): HTMLAppRootElement;
  };

  interface HTMLAppSubmissionsElement extends Components.AppSubmissions, HTMLStencilElement {}
  var HTMLAppSubmissionsElement: {
    prototype: HTMLAppSubmissionsElement;
    new (): HTMLAppSubmissionsElement;
  };

  interface HTMLSubmissionsButtonElement extends Components.SubmissionsButton, HTMLStencilElement {}
  var HTMLSubmissionsButtonElement: {
    prototype: HTMLSubmissionsButtonElement;
    new (): HTMLSubmissionsButtonElement;
  };
  interface HTMLElementTagNameMap {
    'app-form': HTMLAppFormElement;
    'app-form-list': HTMLAppFormListElement;
    'app-login': HTMLAppLoginElement;
    'app-root': HTMLAppRootElement;
    'app-submissions': HTMLAppSubmissionsElement;
    'submissions-button': HTMLSubmissionsButtonElement;
  }
}

declare namespace LocalJSX {
  interface AppForm extends JSXBase.HTMLAttributes<HTMLAppFormElement> {
    'formName'?: string;
    'submittedAt'?: string;
  }
  interface AppFormList extends JSXBase.HTMLAttributes<HTMLAppFormListElement> {}
  interface AppLogin extends JSXBase.HTMLAttributes<HTMLAppLoginElement> {}
  interface AppRoot extends JSXBase.HTMLAttributes<HTMLAppRootElement> {}
  interface AppSubmissions extends JSXBase.HTMLAttributes<HTMLAppSubmissionsElement> {}
  interface SubmissionsButton extends JSXBase.HTMLAttributes<HTMLSubmissionsButtonElement> {}

  interface IntrinsicElements {
    'app-form': AppForm;
    'app-form-list': AppFormList;
    'app-login': AppLogin;
    'app-root': AppRoot;
    'app-submissions': AppSubmissions;
    'submissions-button': SubmissionsButton;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


