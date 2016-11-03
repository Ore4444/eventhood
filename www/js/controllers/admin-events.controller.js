angular.module('starter.controllers', [])
    .controller('AdminEventsController', function ($scope, EventService) {

        $scope.$watch(function(){
            console.log(EventService.getAllEvents());
            return EventService.getAllEvents().length;
        }, (newvalue, oldVlaue)=>{
            $scope.events = EventService.getAllEvents();
        });

    });
