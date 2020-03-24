// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serviceWorker: false,
  firebaseConfig:{
    apiKey: "AIzaSyBGPKnwaPCPGsI8dQsqbrRQkLk-60E6_qQ",
    authDomain: "covid-19-app-91bb3.firebaseapp.com",
    databaseURL: "https://covid-19-app-91bb3.firebaseio.com",
    projectId: "covid-19-app-91bb3",
    storageBucket: "covid-19-app-91bb3.appspot.com",
    messagingSenderId: "15405450462",
    appId: "1:15405450462:web:40fcdd420c149eb87a2e4f",
    measurementId: "G-K1NM85YPXR"
  } ,
  mapbox: {
    accessToken: 'pk.eyJ1IjoidHRvcm5hYmVuZSIsImEiOiJjazd4Nm0zOTkwM3hwM2hzZnZlZ3RhemE3In0.BCYRvz2Pe1HC74gamBma8A',
  },
  googleapis: {
    apiKey: 'AIzaSyCwKYgp4oBySIAV0UJzLvO28YT2KBiBZrk',
  }
};

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
