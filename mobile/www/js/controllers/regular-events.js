var myApp = angular.module('regular-events',[]);

myApp.controller('REController', ['$scope', '$http', '$ionicPopup', function ($scope, $http, $ionicPopup) {

    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sign Up',
            template: 'Are you sure you want to sign up?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('Yes');
            } else {
                console.log('No');
            }
        });
    };

}]);

//If premium event with multiple tournaments. tournament that is to be displayed has to be passed using SharedDataService
myApp.controller('regularEventController', ['$scope', '$http', '$stateParams', 'sharedDataService', function ($scope, $http, $stateParams, sharedDataService) {

    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    $http.get('http://136.145.116.232/events/'+$stateParams.eventname+'?date='+$stateParams.date+'&location='+$stateParams.location+'').
    success(function(data, status, headers, config) {

        $scope.eventInfo = angular.fromJson(data);
        var startDate = new Date($scope.eventInfo.info.event_start_date);
        
        console.log($scope.eventInfo);
        
        if(startDate > now_utc)
            $scope.isOngoing = false;
        else
            $scope.isOngoing = true

        $scope.requiresTeam = $scope.eventInfo.tournaments.is_team_based;
        
        if($scope.eventInfo.tournaments.length == 1)
            $scope.currentTournament = $scope.eventInfo.tournaments[0];
        else
            $scope.currentTournament = sharedDataService.get();

        console.log('Event start date:'+ startDate);
        console.log('Current date:'+ now_utc);

    }).
    error(function(data, status, headers, config) {
        console.log("error in eventPremiumSummaryController");
    });

}]);