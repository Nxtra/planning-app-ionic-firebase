# planning-app-ionic-firebase

## firebase
* installation and setup of angular fire [https://github.com/angular/angularfire/blob/master/docs/install-and-setup.md](https://github.com/angular/angularfire/blob/master/docs/install-and-setup.md)
* install angularFire: `npm i @angular/fire --save`
* you have to enable storage for this project
* also add to `app.module.ts`
* if you use authentication declare it in `app.component.ts` and subscribe to it
* build and deploy: `npm run publish:web`


## ionic
* start project `ionic start`
* generate page: `ionic g page pageName`
* creating a tabs page: [https://ionicframework.com/docs/api/tabs](https://ionicframework.com/docs/api/tabs)
* The UI component that we use for authentication is the firebaseUI angular: `$ npm install firebase firebaseui @angular/fire firebaseui-angular --save`

## cordova
* install cordova: `npm install -g cordova`
* add the platform for which you want to build: `ionic cordova platform add ios`
* build for platform: `ionic cordova build <platform> [options]`
