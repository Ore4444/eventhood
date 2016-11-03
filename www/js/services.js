

angular.module('starter.services', [])

.factory('firebaseInit', ['$firebaseObject', function($firebaseObject) {


  var fireBase;

  function createInstance (){
     fireBase = $firebaseObject;

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

  function getInstance() {
    if (!fireBase) {
      createInstance();
    }
    return fireBase;
  }


  return {
    getInstance: getInstance,
  }

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
