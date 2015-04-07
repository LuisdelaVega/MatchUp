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

    //Obtain current date in UTC
    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    //Header containing token
    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Call to get event information. Passing through stateParams the event name, location and date.
    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
    success(function(data, status, headers, config) {

        $scope.eventInfo = angular.fromJson(data);
        var startDate = new Date($scope.eventInfo.event_start_date);

        //isOngoing is true if startdate is equal to or greater than the current start date
        if(startDate > now_utc)
            $scope.isOngoing = false;
        else
            $scope.isOngoing = true;

        
        //If user came from a premium event sharedDataService is used to find what tournament is to be displayed.
        if($scope.eventInfo.host != null){
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
        //If user is came from a regular event, the only tournament from a regular event is used to display the event.
        else{
            $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
            success(function(data, status, headers, config) {

                var tournamentJSON = angular.fromJson(data);
                $scope.currentTournament = tournamentJSON[0]; //Position 0 contains the only tournament of the regular event
                $scope.requiresTeam = $scope.currentTournament.is_team_based;

            }).
            error(function(data, status, headers, config) {
                console.log("error in regularEventController");
            });
        }
    }).
    error(function(data, status, headers, config) {
        console.log("error in regularEventController");
    });

}]);