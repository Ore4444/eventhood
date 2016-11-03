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
      dataBase: getInstance().database()
    };
  })

  .factory('UserService', ['$q', 'fireBaseInit', function($q, fireBaseInit) {

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
    }

    function updateUserById(userId, data) {
      db.ref('users/' + userId).update(data);
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
      return users[parseInt(userId)];
    }

    function registerUserToEvent(eventId, userId){
      var user = getUserById(userId),
        userEvents =  _.clone(user.events);

      userEvents.push(eventId);

      updateUserById(userId, {
        events: userEvents
      });
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

    return {
      addUser: addUser,
      updateUserById: updateUserById,
      getUserById: getUserById,
      deleteUserById: deleteUserById,
      registerUserToEvent: registerUserToEvent,
      getAllUsers: getAllUsers,
      init: init
    };
  }])

  .factory('EventService', ['fireBaseInit', function(fireBaseInit) {

    let db = fireBaseInit.dataBase,
        ref = db.ref("events"),
        events = [];

    function getKey() {
      return new Date().getTime();
    }

    function addEvent(eventData) {
/*      {
        "title": "",
        "timestamp": 0, //timestamp of beginning of first event
        "min_persons": 0,
        "max_persons": 0,
        "location": "",
        "hours_before_cant_regret": 0,
        "hours_before_close_registration": 0,
        "persons": [124, 14]
      }*/

      let key = getKey();
        db.ref('events/' + key).set(eventData);
    }

    function updateEventById(eventId, data) {
      db.ref('events/' + key).update(data);
    }

    function getEventById(eventId){
      return _.find(events, (event)=>{
        return event.id === eventId;
      })
    }

    function deleteEventById(eventId) {
      db.ref('events/' + eventId).remove();
    }


    ref.on("value", function(snapshot) {
      events = snapshot.val()
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


    return {
      addEvent: addEvent,
      updateEventById: updateEventById,
      getEventById: getEventById,
      deleteEventById: deleteEventById,
      events: events
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
