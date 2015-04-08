var myApp = angular.module('genres',[]);

myApp.controller('genreController', function ($scope, $ionicPopover, sharedDataService, $state, $http, $window) {

    //Function called when user selects a genre
    $scope.goToGenreProfile = function(genreName){
        sharedDataService.set(genreName);
        $state.go('app.genreevents');
    };

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };
    
    //Get a list of genres of games being played in tournaments
    $http.get('http://136.145.116.232/matchup/popular/genres', config).
    success(function(data, status, headers, config) {

        $scope.genres = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in goToEvent");
    });

});

myApp.controller('genreProfileController', function ($scope, $ionicPopover, sharedDataService, $http, $window, $state) {

    //get selected genre from sharedDataService
    $scope.selectedGenre = sharedDataService.get();

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };
    
    //Get list of events that have a game of the selected genre.
    $http.get('http://136.145.116.232/matchup/events?filter=genre&value='+$scope.selectedGenre+'', config).
    success(function(data, status, headers, config) {

        $scope.events = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in goToEvent");
    });

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Server call to get event information
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