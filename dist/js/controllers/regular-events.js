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
myApp.controller('regularEventController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$window', function ($scope, $http, $stateParams, sharedDataService, $window) {

    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
    success(function(data, status, headers, config) {

        $scope.eventInfo = angular.fromJson(data);
        var startDate = new Date($scope.eventInfo.event_start_date);


        if(startDate > now_utc)
            $scope.isOngoing = false;
        else
            $scope.isOngoing = true;

        

        if($scope.eventInfo.is_hosted){
            var selectedTournament = sharedDataService.get();

            $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+selectedTournament+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
            success(function(data, status, headers, config) {

                $scope.currentTournament = angular.fromJson(data);
                $scope.requiresTeam = $scope.currentTournament.is_team_based;


            }).
            error(function(data, status, headers, config) {
                console.log("error in eventPremiumSummaryController");
            });
        }
        else{
            $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
            success(function(data, status, headers, config) {

                var tournamentJSON = angular.fromJson(data);
                $scope.currentTournament = tournamentJSON[0];
                $scope.requiresTeam = $scope.currentTournament.is_team_based;

            }).
            error(function(data, status, headers, config) {
                console.log("error in eventPremiumSummaryController");
            });
        }
    }).
    error(function(data, status, headers, config) {
        console.log("error in eventPremiumSummaryController");
    });

}]);