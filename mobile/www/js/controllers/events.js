//Module used for the events view found in the sidebar.
var myApp = angular.module('events',[]);

myApp.controller('EventController', function ($scope, $ionicPopover, $http, sharedDataService, $state, $window) {

    //goToEvent requires the event name, date and location to access the specific event that is to be transitioned to.
    $scope.goToEvent = function(eventName, date, location){
    
        eventName = eventName.replace(" ", "%20"); //Replaces all space with %20.
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Call to get event information.
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

myApp.controller('PremiumEventController', function ($scope, $http, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Obtains hosted events from the server to populate the view.
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

    //Obtains regular events from the server to populate the view.
    $http.get('http://matchup.neptunolabs.com/matchup/events?type=regular', config).
    success(function(data, status, headers, config) {

        $scope.regularEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in RegularEventController");
    });

});