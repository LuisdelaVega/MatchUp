var myApp = angular.module('events',[]);

myApp.controller('EventController', function ($scope, $ionicPopover, $http, sharedDataService, $state) {
    //    $ionicPopover.fromTemplateUrl('templates/events/events-popover.html', {
    //        scope: $scope,
    //    }).then(function (popover) {
    //        $scope.popover = popover;
    //    });
    //    $scope.openPopover = function ($event) {
    //        $scope.popover.show($event);
    //    };
    //    $scope.closePopover = function () {
    //        $scope.popover.hide();
    //    };


    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location]

        $http.get('http://136.145.116.232/events/'+eventName+'?date='+date+'&location='+location+'').
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.info.is_hosted;

            sharedDataService.set(params);

            if(isHosted){
                $state.go('app.eventpremium.summary', {"eventname": eventName, "date": date, "location": location});

            }
            else{
                $state.go('app.regularevent', {"eventname": eventName, "date": date, "location": location});
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });

    };

});

myApp.controller('PremiumEventController', function ($scope, $http) {

    $http.get('http://matchup.neptunolabs.com/events?type=hosted').
    success(function(data, status, headers, config) {

        $scope.hostedEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in PremiumEventController");
    });



});

myApp.controller('RegularEventController', function ($scope, $http) {

    $http.get('http://matchup.neptunolabs.com/events?type=regular').
    success(function(data, status, headers, config) {

        $scope.regularEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in RegularEventController");
    });

});