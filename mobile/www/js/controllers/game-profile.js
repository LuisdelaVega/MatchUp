var myApp = angular.module('game-profile',[]);

myApp.controller('gameProfileParentController', ['$scope', '$http', '$state', 'sharedDataService', function ($scope, $http, $state, sharedDataService) {

    $scope.$on('$ionicView.beforeEnter', function(){
        var params = sharedDataService.get();
        $scope.gameName = params[0];
        $scope.gameImage = params[1];
    });

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

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

}]);

myApp.controller('gameProfileSummaryController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', function ($scope, $http, sharedDataService, $state, $stateParams) {

    $http.get('http://matchup.neptunolabs.com/events?type=hosted&filter=game&value='+$stateParams.gamename+'').
    success(function(data, status, headers, config) {

        $scope.promotedEvents = data;

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileSummaryController");
    });

}]);

myApp.controller('gameProfileUpcomingController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', function ($scope, $http, sharedDataService, $state, $stateParams) {

    $http.get('http://matchup.neptunolabs.com/events?type=hosted&filter=game&value='+$stateParams.gamename+'&state=upcoming').
    success(function(data, status, headers, config) {

        $scope.upcomingEvents = data;

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileUpcomingController");
    });



}]);

myApp.controller('gameProfileLiveController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', function ($scope, $http, sharedDataService, $state, $stateParams) {

    $http.get('http://matchup.neptunolabs.com/events?type=hosted&filter=game&value='+$stateParams.gamename+'&state=live').
    success(function(data, status, headers, config) {

        $scope.liveEvents = data;

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileLiveController");
    });

}]);

myApp.controller('gameProfileHistoryController', ['$scope', '$http', 'sharedDataService', '$state', '$stateParams', function ($scope, $http, sharedDataService, $state, $stateParams) {

    $http.get('http://matchup.neptunolabs.com/events?type=hosted&filter=game&value='+$stateParams.gamename+'&state=past').
    success(function(data, status, headers, config) {

        $scope.pastEvents = data;

    }).
    error(function(data, status, headers, config) {
        console.log("error in gameProfileHistoryController");
    });

}]);