# Offline Forms

This is a simple proof-of-concept app to demonstrate a few things:

* An [Ionic](https://ionicframework.com/docs) app using pure Stencil Web Components
* [PWA](https://developers.google.com/web/progressive-web-apps/) (Progressive Web App) functionality
* [Form.io](http://form.io/) integration

## Note-worthy stuff

This app is written in Typescript (poorly). Please excuse my ignorant use of the language!

Application state is managed by [mobx](https://mobx.js.org/README.html) which is a reactive state management library. It rocks! Application state is persisted to LocalStorage using [mobx-persist](https://github.com/pinqy520/mobx-persist).

We use [Google Workbox](https://developers.google.com/web/tools/workbox) to provide some of the Progressive-Web-App functionality.

## Local Development

1. Clone this repo
    ```sh
    > git clone https://github.com/grahammcculloch/offline-forms.git && cd offline-forms
    ```
1. Install dependencies (this repo uses yarn rather than npm)
    ```sh
    > yarn
    ```
1. Run the app in debug mode using the dev server:
    ```sh
    > yarn start
    ```

The app will be available at http://localhost:3333/

## Production builds

To build the app (for release/deployment):
```sh
> yarn build
```

To serve the built code locally:
```sh
> yarn serve
```

## Deployment

The app is currently hosted on a free Firebase project. Before you can deploy to Firebase, you'll need to install the Firebase CLI tool:
```sh
> yarn global add firebase-tools
> firebase login
```

(You will need to be a member of the Firebase project. Contact James/Johnny to be added if necessary.)

To deploy:
```sh
> yarn deploy
```

The Firebase app URL is: https://offline-forms-527fa.web.app/ 

(You will need a valid form.io login in order to use the app. Contact James Duncan request a login.)


## Useful reading

* [The Complete Guide To Progressive Web Apps with Ionic 4](https://ionicthemes.com/tutorials/about/the-complete-guide-to-progressive-web-apps-with-ionic4)
* [Building a PWA with Stencil: An Introduction to StencilJS](https://www.joshmorony.com/building-a-pwa-with-stencil-an-introduction-to-stencil/)
