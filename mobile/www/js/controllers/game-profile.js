var myApp = angular.module('game-profile',[]);

myApp.controller('gameProfileParentController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {


    var params = sharedDataService.get();
    $scope.gameName = params[1];
    $scope.gameImage = params[0];

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

}]);

myApp.controller('gameProfileSummaryController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', '$window', function ($scope, $http, sharedDataService, $state, $stateParams, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://matchup.neptunolabs.com/matchup/events?filter=game&value='+$stateParams.gamename+'', config).
    success(function(data, status, headers, config) {
        console.log('http://matchup.neptunolabs.com/matchup/events?filter=game&value='+$stateParams.gamename+'');
        $scope.promotedEvents = data;

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileSummaryController");
    });

}]);

myApp.controller('gameProfileUpcomingController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', '$window', function ($scope, $http, sharedDataService, $state, $stateParams, $window) {

    console.log('entered gameProfileUpcomingController');

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://matchup.neptunolabs.com/matchup/events?filter=game&value='+$stateParams.gamename+'&state=upcoming', config).
    success(function(data, status, headers, config) {

        console.log('http://matchup.neptunolabs.com/matchup/events?type=hosted&filter=game&value='+$stateParams.gamename+'&state=upcoming');
        $scope.upcomingEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileUpcomingController");
    });



}]);

myApp.controller('gameProfileLiveController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', '$window', function ($scope, $http, sharedDataService, $state, $stateParams, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };


    $http.get('http://matchup.neptunolabs.com/matchup/events?filter=game&value='+$stateParams.gamename+'&state=live', config).
    success(function(data, status, headers, config) {

        console.log('http://matchup.neptunolabs.com/matchup/events?type=hosted&filter=game&value='+$stateParams.gamename+'&state=live');
        $scope.liveEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileLiveController");
    });

}]);

myApp.controller('gameProfileHistoryController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', '$window', function ($scope, $http, sharedDataService, $state, $stateParams, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://matchup.neptunolabs.com/matchup/events?filter=game&value='+$stateParams.gamename+'&state=past', config).
    success(function(data, status, headers, config) {

        console.log('http://matchup.neptunolabs.com/matchup/events?type=hosted&filter=game&value='+$stateParams.gamename+'&state=past');
        $scope.pastEvents = data;

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileHistoryController");
    });

}]);