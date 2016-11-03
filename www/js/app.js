// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  .controller('ManageUsersController', function($scope, UserService) {
    $scope.test = 'VARIABLE';

    $scope.users = UserService.getAllUsers();

    $scope.$watch(() => {
      return UserService.getAllUsers().length;
    }, (newValue, oldValue) => {
      $scope.users = UserService.getAllUsers();
    });

    // $scope.users = UserService.getAllUsers();
  })

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })


  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.my-events', {
    url: '/my-events',
    views: {
      'tab-my-events': {
        templateUrl: 'templates/tab-events.html',
        controller: 'MyEventsController'
      }
    }
  })

    .state('tab.my-settings', {
      url: '/my-settings',
      views: {
        'tab-my-settings': {
          templateUrl: 'templates/tab-my-settings.html',
          // controller: 'MySettingsController'
        }
      }
    })
    .state('tab.admin-settings', {
      url: '/admin-settings',
      views: {
        'tab-admin-settings': {
          templateUrl: 'templates/admin-settings.html'
        }
      }
    })
    .state('tab.admin-users', {
      url: '/admin-users',
      views: {
        'tab-admin-settings': {
          templateUrl: 'templates/admin-users.html',
          controller: 'ManageUsersController'
        }
      }
    })
    .state('tab.admin-user', {
      url: '/admin-user/:userId',
      params: {
        userId: null
      },
      views: {
        'tab-admin-settings': {
          templateUrl: 'templates/admin-user.html',
        }
      }
    })
    .state('tab.admin-events', {
      url: '/admin-events',
      views: {
        'tab-admin-settings': {
          templateUrl: 'templates/admin-events.html'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/my-settings');

});
