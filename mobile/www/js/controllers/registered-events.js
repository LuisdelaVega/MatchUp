var myApp = angular.module('registered-events',[]);

myApp.controller('registeredEventsParentController', function ($scope, $ionicPopover, $state, sharedDataService) {

    $scope.customer_username = sharedDataService.get();

});

myApp.controller('registeredEventsCompetitorController', function ($scope, $ionicPopover, $state, sharedDataService, $window, $http) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/profile/'+$scope.customer_username+'/events/registered?type=competitor', config).success(function (data) {
        
        console.log('http://136.145.116.232/matchup/profile/'+$scope.customer_username+'/events/registered?type=competitor');

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

    $http.get('http://136.145.116.232/matchup/profile/'+$scope.customer_username+'/events/registered?type=spectator', config).success(function (data) {

        console.log('http://136.145.116.232/matchup/profile/'+$scope.customer_username+'/events/registered?type=spectator');
        $scope.eventsSpectating = angular.fromJson(data);

    }).error(function (err) {
        console.log(err);
    });


});