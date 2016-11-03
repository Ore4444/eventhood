/*class loginController {
/!*   constructor(firebaseProvider){
     this.username = '';
     this.email = '';
     debugger;
     //this.fireBase = firebaseProvider.getInstance();
   }

   googleLogin() {
     this.firebase.auth().createUserWithEmailAndPassword('', '').catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // ...
       debugger;
     });
   }*!/
}*/

angular.module('starter.controllers', [])
  .controller('loginController', ['firebaseInit', '$firebaseAuth', function(firebaseInit, $firebaseAuth){

    var firebase = firebaseInit.getInstance();

    debugger;

    console.log($firebaseAuth);

    $firebaseAuth.createUserWithEmailAndPassword('example@gmail.com', 'pass').catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
debugger;
    });




  }]);
