angular.module('starter.controllers', [])
  .controller('MyEventsController', function($scope, UserService) {

    $scope.users = UserService.getAllUsers();

    /*var firebaseObj = new Firebase("https://hackathonproj-12729.firebaseio.com");
     var loginObj =  $firebaseSimpleLogin(firebaseObj);*/

    /*    $scope.SignIn = function(event) {
     event.preventDefault();  // To prevent form refresh

     $scope.user = {
     email: 'eranmit@gmail.com',
     password: '123456'
     }

     var username = $scope.user.email;
     var password = $scope.user.password;


     console.log($scope.user );

     loginObj.$login('password', {
     email: username,
     password: password
     })
     .then(function(user) {
     // Success callback
     console.log('Authentication successful');
     }, function(error) {
     // Failure callback
     console.log('Authentication failure');
     });
     }*/

    $scope.addUser = function(){
      UserService.addUser('eran', 'eran@gmail.com')
    };


    $scope.$watch(() => {
      return UserService.getAllUsers().length;
    }, (newvalue, oldVlaue)=>{
      $scope.users = UserService.getAllUsers();
    });

  });
