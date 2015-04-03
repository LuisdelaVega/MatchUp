var myApp = angular.module('events',[]);

myApp.controller('EventController', function ($scope, $ionicPopover, $http, sharedDataService, $state, $window) {

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.is_hosted;

            sharedDataService.set(params);

            if(isHosted != 'null'){
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

myApp.controller('PremiumEventController', function ($scope, $http, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://matchup.neptunolabs.com/matchup/events?type=hosted', config).
    success(function(data, status, headers, config) {

        $scope.hostedEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in PremiumEventController");
    });



});

myApp.controller('RegularEventController', function ($scope, $http, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://matchup.neptunolabs.com/matchup/events?type=regular', config).
    success(function(data, status, headers, config) {

        $scope.regularEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in RegularEventController");
    });

});