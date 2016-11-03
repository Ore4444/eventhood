angular.module('starter.controllers', [])
  .controller('MyEventsController', function($scope, EventService) {

    function init(){
      EventService.init().then(function(){
        $scope.events = EventService.getAllEvents();
        console.log('init');
      });
    }

    $scope.addEvent =  function(){

      EventService.addEvent({
           "title": "Pilates",
           "timestamp": "11/11/16, 19:15", //timestamp of beginning of first event
           "min_persons": 0,
           "max_persons": 0,
           "location": "Floor 21, Ofri",
           "hours_before_cant_regret": 0,
           "hours_before_close_registration": 0,
           "persons": [124, 14]
      });
    };

      $scope.deleteEventFromUser = function(eventId){
        EventService.deleteEventFromUser(eventId, 14)
      };

      $scope.$watch(function(){
        console.log(EventService.getAllEvents());
        return EventService.getAllEvents().length;
      }, (newvalue, oldVlaue)=>{
        $scope.events = EventService.getAllEvents();
      });

     init();
  });
