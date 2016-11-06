// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

    .run(function ($rootScope, loggedInUser, $ionicPlatform, $state) {
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
        $rootScope.isAdmin = () => localStorage.isAdmin;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (!localStorage.getItem('loggedInUserId')) {
              if (toState.name !== "sign-up") {
                $state.go('login');
              }
            }
        });
    })


    .controller('LoginController', function($rootScope, $scope, UserService, loggedInUser, $state) {
      $scope.user = {};
      $scope.errorMessage = '';

      function alreadyLoggedIn() {
        if (localStorage.getItem('loggedInUserId')) {
          $state.go('tab.my-events');
        }
      }

      $scope.loginUser = function(user) {
        if (user.email && user.password) {
          UserService.init()
            .then(() => {
              if (UserService.isPasswordCorrect(user.email, user.password)) {
                const userObject = UserService.getUserByEmail(user.email);
                loggedInUser.login(userObject.id);

                if (userObject.admin === true) {
                  localStorage.isAdmin = true;
                }
                $state.go('tab.my-events');
              } else {
                $scope.errorMessage = 'Wrong combination of email and password.';
              }
            });
        }
      };

      $scope.$on('$stateChangeSuccess', alreadyLoggedIn);
    })


    .controller('SignUpController', function($scope, UserService, loggedInUser, $state) {
      $scope.user = {};
      $scope.errorMessage = '';

      function alreadyLoggedIn() {
        if (localStorage.getItem('loggedInUserId')) {
          $state.go('tab.my-events');
        }
      }

      $scope.signUpUser = function(user) {
        if (user.email && user.password) {
          UserService.init()
            .then(() => {
              const userExists = UserService.getUserByEmail(user.email);
              if (userExists) {
                $scope.errorMessage = 'This email already exists.';
                return false;
              }
              const userId = UserService.addUser(user);
              loggedInUser.login(userId);
              $state.go('tab.my-events');
            });
        }
      };

      $scope.$on('$stateChangeSuccess', alreadyLoggedIn);
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
        })

        $scope.delete = function (id) {
            UserService.deleteEventById(id);
        };
    })

    .controller('EditUserController', function ($ionicHistory, $timeout, $stateParams, $scope, UserService) {
        const userId = $stateParams['userId'];

        UserService.init()
            .then(() => {
                if (userId) {
                    $scope.user = UserService.getUserById(parseInt(userId));
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
        function init() {
            EventService.init().then(()=> {
                $scope.events = EventService.getAllEvents();
                // console.log($scope.events);
            });
        }

        init();
        $scope.$on('$stateChangeSuccess', init);

        $scope.delete = function (id) {
            EventService.deleteEventById(id);
            init();
        };
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
                    var user = UserService.getUserById(parseInt(person));
                    if (user) {
                        $scope.users.push(user);
                    }
                });
            }
            // console.log($scope.event)
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

    .controller('MyEventsController', function ($scope, EventService, UserService) {
        var userId;

        function init() {
            userId = parseInt(localStorage.getItem('loggedInUserId'));
            UserService.init()
                .then(EventService.init)
                .then(() => {
                    $scope.user = UserService.getUserById(userId);
                    // console.log($scope.user)
                })
                .then(() => {
                $scope.view = "myEvents";
                getEvents();
            });
        }

        function getUsersEvents() {
            var events = [];
            $scope.userEvents = [];
            _.each($scope.user.events || [], function (event) {
                events.push(EventService.getEventById(event));
            });
            return events;
        }

        function getAllEvents() {
            return EventService.getAllEvents();
        }

        function getEvents() {
            var events = [];
            if ($scope.view === "myEvents") {
                events = getUsersEvents()
            } else {
                events = getAllEvents();
            }

            //process events data
            $scope.events = _.compact(_.map(events, function (event) {
                if (event.date) var eventStartTime = new Date(event.date);

                //filter out old events
                if (eventStartTime && eventStartTime < Date.now()) {
                    return null;
                }

                //check if the user is registered to event
                event.persons = event.persons || []
                if ((event.persons).indexOf(userId) > -1) {
                    //check if user can cancel the event
                    var hoursTillTheEvent = (eventStartTime - Date.now()) / (1000 * 60 * 60);
                    if ((hoursTillTheEvent > event.hours_before_cant_regret) || !event.hours_before_cant_regret) {
                        event.button = "cancel";
                    } else {
                        event.button = "cancel-disabled";
                    }
                } else {
                    //check if event is already full
                    if (event.persons.length === event.max_persons) {
                        event.button = "full";
                    } else {
                        if ($scope.user.events_left > 0) {
                            event.button = "register";
                        } else {
                            event.button = "register-disabled";
                        }
                    }
                }

                // console.log(event);
                return event;
            }));

            $scope.$on('$stateChangeSuccess', init);
        }

        $scope.register = function (eventId) {
            //update event object
            var event = EventService.getEventById(eventId);
            if (!event.persons) {
                event.persons = [];
            }
            event.persons.push(userId);
            event.persons = _.uniq(event.persons);
            delete event.button;
            EventService.updateEventById(eventId, event);

            //update user object
            var user = UserService.getUserById(userId);
            if (!user.events) {
                user.events = [];
            }
            user.events.push(eventId);
            user.events_left -= 1;
            UserService.updateUserById(userId, user);
            //refresh the data
            init();
        };

        $scope.cancel = function (eventId) {
            //update event object
            var event = EventService.getEventById(eventId);
            event.persons = _.without(event.persons, userId);
            EventService.updateEventById(eventId, event);

            //update user object
            var user = UserService.getUserById(userId);
            user.events = _.without(user.events, eventId);
            user.events_left += 1;
            UserService.updateUserById(userId, user);
            //refresh the data
            init();
        };

        $scope.switchView = function (view) {
            $scope.view = view;
            getEvents();
        }
        $scope.$on('$stateChangeSuccess', init);

        init();
    })

    .controller('MyInfoController', function ($scope, EventService, UserService) {
        var userId;

        function init() {
            userId = parseInt(localStorage.getItem('loggedInUserId'));
            UserService.init()
                .then(EventService.init)
                .then(function () {
                    $scope.user = UserService.getUserById(userId);
                    $scope.user.events = _.compact(_.map($scope.user.events, function (eventID) {
                        var event = EventService.getEventById(eventID);
                        if (event) {
                          //return only events that happened in the past
                          return Date.now() - new Date(event.date) > 0 ? event : null;
                        } else {
                          return null;
                        }

                    }));
                    // console.log($scope.user);
                });
        }

      $scope.$on('$stateChangeSuccess', init);

        init();
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
            .state('tab.my-info', {
                url: '/my-info',
                views: {
                    'tab-my-info': {
                        templateUrl: 'templates/tab-my-info.html',
                        controller: 'MyInfoController'
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
