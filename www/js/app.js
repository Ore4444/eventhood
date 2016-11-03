// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

    .run(function ($rootScope, loggedInUser, $ionicPlatform) {
        $ionicPlatform.ready(function () {
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

        $rootScope.logout = loggedInUser.logout;
    })

    .controller('LoginController', function($scope, UserService, loggedInUser, $state) {
      $scope.user = {};

      function maybeRedirect() {
        if (localStorage.getItem('loggedInUserId')) {
          $state.go('tab.my-events');
        }
      }

      $scope.saveUser = function(user) {
        if (user.email && user.password) {
          UserService.init()
            .then(() => {
              const userId = UserService.addUser(user);
              loggedInUser.login(userId);
              maybeRedirect();
            });
        }
      };

      $scope.$on('$stateChangeSuccess', maybeRedirect);
    })
    .controller('SignUpController', function($scope, UserService, loggedInUser) {
      let userId = null;
      $scope.user = {};

      UserService.init()
        .then(() => {
          $scope.users = UserService.getAllUsers();
        });

      $scope.saveUser = function() {
        debugger;
        userId = UserService.addUser($scope.user);
        loggedInUser.login(userId);
      };
    })

    .controller('ManageUsersController', function ($scope, UserService) {
      UserService.init()
        .then(() => {
          $scope.users = UserService.getAllUsers();
        });

      $scope.$watch(() => {
          return UserService.getAllUsers().length;
      }, () => {
          $scope.users = UserService.getAllUsers();
      });

      $scope.$on('$stateChangeSuccess', () => {
        $scope.users = UserService.getAllUsers();
      });
    })

    .controller('EditUserController', function($ionicHistory, $timeout, $stateParams, $scope, UserService) {
      const userId = $stateParams['userId'];

      UserService.init()
        .then(() => {
          if (userId) {
            $scope.user = UserService.getUserById(userId);
          }
        });

      $scope.saveUser = (user) => {
        if (userId) {
          UserService.updateUserById(userId, user);
        } else {
          UserService.addUser(user);
        }
        $ionicHistory.goBack();
      };

    })

    .controller('AdminEventsController', function ($scope, EventService) {
        EventService.init().then(()=> {
            $scope.events = EventService.getAllEvents();
            console.log($scope.events);
        })
    })
    .controller('EditEventsController', function ($scope, EventService, UserService, $state, $ionicHistory) {
        const eventId = parseInt($state.params.id);
        EventService.init().then(()=> {
            if (!eventId) {
                $scope.event = {};
            } else {
                $scope.event = EventService.getEventById(eventId);
                $scope.event.date = new Date($scope.event.date);
                $scope.users = [];
                _.each($scope.event.persons || [], function (person) {
                    var user= UserService.getUserById(parseInt(person));
                    if(user){
                        $scope.users.push(user);
                    }
                });
            }
            console.log($scope.event)
        });
        $scope.save = function (event) {
            var savedEvent = _.clone($scope.event);
            //convert date back to string
            savedEvent.date = moment($scope.event.date).format('LLLL');
            if (eventId) {
                //edit event
                EventService.updateEventById(eventId, savedEvent);
            } else {
                //add event
                EventService.addEvent(savedEvent);
            }
            $ionicHistory.goBack();
        }
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom');
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('login', {
              url: '/login',
              templateUrl: 'templates/login.html',
              controller: 'LoginController'
            })
            .state('sign-up', {
              url: '/sign-up',
              templateUrl: 'templates/sign-up.html',
              controller: 'SignUpController'
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
          .state('tab.edit-user', {
            url: '/edit-user/:userId',
                params: {
                    userId: null
                },
                views: {
                    'tab-admin-settings': {
                      templateUrl: 'templates/edit-user.html',
                      controller: 'EditUserController',
                    }
                }
            })
            .state('tab.admin-events', {
                url: '/admin-events',
                views: {
                    'tab-admin-settings': {
                        templateUrl: 'templates/admin-events.html',
                        controller: 'AdminEventsController'
                    }
                }
            })
            .state('tab.edit-event', {
                url: '/edit-event?id',
                params: {
                    id: null
                },
                views: {
                    'tab-admin-settings': {
                        templateUrl: 'templates/edit-event.html',
                        controller: 'EditEventsController'
                    }
                }
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
