angular.module('starter.controllers', [])

.controller('loginController', ['firebaseInit', '$firebaseAuth', function(firebaseInit, $firebaseAuth) {

  var firebase = firebaseInit.getInstance();

  //console.log($firebaseAuth);

  $firebaseAuth.createUserWithEmailAndPassword('example@gmail.com', 'pass').catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  })
}])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function ($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function (chat) {
    Chats.remove(chat);
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
