var myApp = angular.module('registered-events',[]);

myApp.controller('registeredEventsParentController', function ($scope, $ionicPopover, $state, sharedDataService) {

    $scope.customer_username = sharedDataService.get(); //Get username from sharedDataService

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