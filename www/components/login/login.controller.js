class loginController {
   constructor($ionicGoogleAuth, $ionicUser){
     this.username = '';
     this.email = '';

     $ionicGoogleAuth.login().then(() => {});
   }
}

angular.module('starter.controllers', [])
  .controller('loginController', ['$ionicGoogleAuth', '$ionicUser', loginController]);
