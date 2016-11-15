angular.module('starter.services', [])

  .factory('fireBaseInit', function() {

    var firebaseObj;

    function createInstance(){
      // Initialize Firebase
      firebase.initializeApp({
        apiKey: "AIzaSyCbFIwQ3Z9ovnrZgsqe5unQnikVV92DAhQ",
        authDomain: "hackathonproj-12729.firebaseapp.com",
        databaseURL: "https://hackathonproj-12729.firebaseio.com",
        storageBucket: "hackathonproj-12729.appspot.com",
        messagingSenderId: "218970006552"
      });

      firebaseObj = firebase;

      return firebaseObj;
    }

    function getInstance() {
      if (!firebaseObj) {
        createInstance();
      }
      return firebaseObj;
    }

    return {
      dataBase: getInstance().database(),
      fireBase: getInstance()
    };
  })

  .factory('loggedInUser', ($state, $rootScope) => {
    function login(userId) {
      localStorage.setItem('loggedInUserId', userId);
    }

    function logout() {
      localStorage.removeItem('loggedInUserId');
      localStorage.removeItem('isAdmin');
      $state.go('login');
    }

    return {login, logout};
  })

  .factory('UserService', ['fireBaseInit', '$q', function(fireBaseInit, $q) {

    let db = fireBaseInit.dataBase,
        users = [],
        deferred = $q.defer(),
        initialized = false,
        ref = db.ref("users");

    function getKey() {
      return new Date().getTime();
    }

    function addUser(userData) {
      let key = getKey();
          userData.id = key;

      db.ref('users/' + key).set(userData);
      return key;
    }

    function updateUserById(userId, data) {
      db.ref('users/' + userId).update(data);
      users[userId] = data;
    }

    function deleteUserById(userId) {
      db.ref('users/' + userId).remove();
    }

    ref.on("value", function(snapshot) {
        users = snapshot.val();
        initialized = true;
        deferred.resolve('success');
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        deferred.reject('failure');
    });

    function getUserById(userId){
      return _.find(users, (user)=>{
         return user.id === userId;
      })
    }

    function getUserByEmail(email){
      return _.find(users, user => user.email === email)
    }

    function isPasswordCorrect(email, password){
      const user = _.find(users, user => user.email === email);
      if (user && (user.password === password)) {
        return true;
      } else {
        return false;
      }
    }

    function init(){
      if (!initialized) {
        return deferred.promise;
      }
      return $q.resolve('success');
    }

    function getAllUsers() {
      return users;
    }

    function registerUserToEvent(eventId, userId){
      var user = getUserById(userId);
          user.events.push(eventId);
          updateUserById(userId, user);
    }

    function deleteUserFromEvent(userId, eventId){
        var user = getUserById(userId),
          events = _.filter(user.events, (item) => {
            return item !== eventId;
          });
        event.events = events;
        updateUserById(eventId, event);
    }

    return {
      addUser: addUser,
      updateUserById: updateUserById,
      getUserById: getUserById,
      deleteUserById: deleteUserById,
      registerUserToEvent: registerUserToEvent,
      deleteUserFromEvent: deleteUserFromEvent,
      getAllUsers: getAllUsers,
      init: init,
      getUserByEmail,
      isPasswordCorrect,
    };
  }])

  .factory('EventService', ['fireBaseInit','$q', function(fireBaseInit, $q) {

    let db = fireBaseInit.dataBase,
        ref = db.ref("events"),
        deferred = $q.defer(),
        initialized = false,
        events = [];

    function getKey() {
      return new Date().getTime();
    }

    function addEvent(eventData) {
      let key = getKey();
        eventData.id = key;
        db.ref('events/' + key).set(eventData);
    }

    function updateEventById(eventId, data) {
      db.ref('events/' + eventId).update(data);
    }

    function getEventById(eventId){
      return events[eventId];
    }

    function deleteEventById(eventId) {
      db.ref('events/' + eventId).remove();
    }

    function init(){
      if (!initialized) {
        return deferred.promise;
      }
      return $q.resolve('success');
    }

    ref.on("value", function(snapshot) {
      events = snapshot.val() || [];
      initialized = true;
      deferred.resolve('success');
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      deferred.reject('failure');
    });

    function getAllEvents() {
      return events;
    }

    function registerUserToEvent(userId, eventId){
      var event = getEventById(eventId);
          event.persons.push(userId);
          updateEventById(eventId, event);
    }

   function deleteEventFromUser(userId, eventId){
     var event = getEventById(eventId),
         persons = _.filter(event.persons, (item) => {
           return item !== userId;
         });
         event.persons = persons;
         updateEventById(eventId, event);
   }

    return {
      addEvent: addEvent,
      updateEventById: updateEventById,
      getEventById: getEventById,
      deleteEventById: deleteEventById,
      registerUserToEvent: registerUserToEvent,
      deleteEventFromUser: deleteEventFromUser,
      getAllEvents: getAllEvents,
      init: init
    };
  }])

  .factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function() {
        return chats;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
