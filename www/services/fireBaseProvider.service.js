class FireBaseProvider {

   constructor(){
     this.fireBase = null;
   }

   createInstance(){
     this.fireBase = null;

     // Initialize Firebase
     firebase.initializeApp({
       apiKey: "AIzaSyCbFIwQ3Z9ovnrZgsqe5unQnikVV92DAhQ",
       authDomain: "hackathonproj-12729.firebaseapp.com",
       databaseURL: "https://hackathonproj-12729.firebaseio.com",
       storageBucket: "hackathonproj-12729.appspot.com",
       messagingSenderId: "218970006552"
     });

     return this.fireBase;
   }

   getInstance() {
     if (!this.fireBase) {
       createInstance();
     }
     return this.fireBase;
   }

}


angular.module('starter.services', [firebase])
  .factory('firebaseProvider', FireBaseProvider);

