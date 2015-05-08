var myApp = angular.module('registered-events',[]);

myApp.controller('registeredEventsParentController', function ($scope, $ionicPopover, $state, sharedDataService, $http, $window) {

    $scope.customer_username = sharedDataService.get(); //Get username from sharedDataService

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Get event information
        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.host; //Server returns organization that is hosting the event. If the event does not have a host than the value returned is null.

            sharedDataService.set(params);

            //If isHosted is null, than the user is requesting to go to a regular event. Otherwise the user is going to a premium event. 
            if(isHosted != null){
                $state.go('app.eventpremium', {"eventname": eventName, "date": date, "location": location});
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

myApp.controller('registeredEventsCompetitorController', function ($scope, $ionicPopover, $state, sharedDataService, $window, $http) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Get events the selected user is registered as a competitor
    $http.get('http://136.145.116.232/matchup/profile/'+$scope.customer_username+'/events/registered?type=competitor', config).success(function (data) {

        $scope.eventsCompeting = angular.fromJson(data);

    }).error(function (err) {
        console.log(err);
    });


});

myApp.controller('registeredEventsSpectatorController', function ($scope, $ionicPopover, $state, sharedDataService, $window, $http) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Get events the selected user is registered as a spectator
    $http.get('http://136.145.116.232/matchup/profile/'+$scope.customer_username+'/events/registered?type=spectator', config).success(function (data) {

        $scope.eventsSpectating = angular.fromJson(data);

    }).error(function (err) {
        console.log(err);
    });


});