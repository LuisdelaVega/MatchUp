var myApp = angular.module('regular-events',[]);

myApp.controller('REController', ['$scope', '$http', '$ionicPopup', '$stateParams', '$window', 'sharedDataService', function ($scope, $http, $ionicPopup, $stateParams, $window, sharedDataService) {

    //Create popup when user clicks the sign up button
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sign Up',
            template: 'Are you sure you want to sign up?'
        });
        confirmPopup.then(function (res) {
            if (res) {

                var selectedTournament = sharedDataService.get(); //Get info from sharedDataService

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                $http.post('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+selectedTournament+'/register?date='+$stateParams.date+'&location='+$stateParams.location+'', { }, config).success(function(data, status, headers, config) {

                    console.log("entered tournament");

                }).
                error(function(data, status, headers, config) {
                    console.log("error in regularEventController");
                }); 

            } else {

            }
        });
    };

}]);

//If premium event with multiple tournaments. tournament that is to be displayed has to be passed using SharedDataService
myApp.controller('regularEventController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$window', function ($scope, $http, $stateParams, sharedDataService, $window) {

    $scope.$on('$ionicView.enter', function () {

        $scope.selectedType = [ ];
        $scope.selectedRound = [ ];
        $scope.selectedGroup = [ ];


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
            var startDate = new Date($scope.eventInfo.event_registration_deadline);

            //isOngoing is true if startdate is equal to or greater than the current start date
            $scope.isOngoing = startDate < now_utc;

            //If user came from a premium event sharedDataService is used to find what tournament is to be displayed.
            if($scope.eventInfo.host != null){
                var selectedTournament = sharedDataService.get(); //Get info from sharedDataService

                //Server call to obtain tournament information from selected event
                $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+selectedTournament+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).success(function(data, status, headers, config) {

                    $scope.currentTournament = angular.fromJson(data);

                    if($scope.currentTournament.team_size > 1)
                        $scope.requiresTeam = true;
                    else
                        $scope.requiresTeam = false;

                    //Get tournament rounds 
                    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+$scope.currentTournament.tournament_name+'/rounds?date='+$stateParams.date+'&location='+$stateParams.location+'', config).success(function(data, status, headers, config) {

                        $scope.roundInfo = data;

                        $scope.selectedRound = $scope.roundInfo.finalStage.winnerRounds[0];

                        if($scope.currentTournament.tournament_format == "Double Elimination")
                            $scope.selectedType.type = 'Winner\'s Bracket'; 
                        else if($scope.currentTournament.tournament_format == "Single Elimination")
                            $scope.selectedType.type = 'Bracket'; 

                    }).
                    error(function(data, status, headers, config) {
                        console.log("error in regularEventController");
                    });

                }).
                error(function(data, status, headers, config) {
                    console.log("error in eventPremiumSummaryController");
                });
            }
            //If user is came from a regular event, the only tournament from a regular event is used to display the event.
            else{
                //Server call to obtain tournament information from selected event
                $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments?date='+$stateParams.date+'&location='+$stateParams.location+'', config).success(function(data, status, headers, config) {

                    var tournamentJSON = angular.fromJson(data);

                    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+tournamentJSON[0].tournament_name+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).success(function(data, status, headers, config) {


                        $scope.currentTournament = data;

                        $scope.requiresTeam = $scope.currentTournament.team_size > 1;
                        $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+$scope.currentTournament.tournament_name+'/rounds?date='+$stateParams.date+'&location='+$stateParams.location+'', config).success(function(data, status, headers, config) {


                            $scope.roundInfo = data;  
                            $scope.selectedRound = $scope.roundInfo.finalStage.winnerRounds[0];

                            if($scope.currentTournament.tournament_format == "Double Elimination")
                                $scope.selectedType.type = 'Winner\'s Bracket'; 
                            else if($scope.currentTournament.tournament_format == "Single Elimination")
                                $scope.selectedType.type = 'Bracket'; 

                        }).
                        error(function(data, status, headers, config) {
                            console.log("error in regularEventController");
                        });

                    }).
                    error(function(data, status, headers, config) {
                        console.log("error in regularEventController");
                    });

                }).
                error(function(data, status, headers, config) {
                    console.log("error in regularEventController");
                });
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error in regularEventController");
        });
    });

    $scope.hasMatches = function (matches) {

        var matchesCount = 0;

        angular.forEach(matches, function(match){

            if(match.players[0].competitor_number != null){

                matchesCount++;

            }    
        });

        return matchesCount != 0;

    };

}]);

myApp.controller('teamSignUpController', ['$scope', '$http', '$ionicPopup', '$stateParams', '$window', 'sharedDataService', function ($scope, $http, $ionicPopup, $stateParams, $window, sharedDataService) {

    $scope.$on('$ionicView.enter', function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $scope.checkedMembers = [ ];

        $scope.selectedTeam = [ ];

        $http.get('http://136.145.116.232/matchup/profile/'+$window.sessionStorage.username+'/teams', config).success(function(data) {

            $scope.myTeams = data;

            $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+$stateParams.tournament+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).success(function(data) {

                $scope.tournamentInfo = data;

            }).
            error(function(data, status, headers, config) {
                console.log("error in regularEventController");
            });

        }).
        error(function(data, status, headers, config) {
            console.log("error in regularEventController");
        });

    });

    $scope.updateTeamMembers = function (teamName) {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/teams/'+teamName+'/members', config).success(function(data) {

            $scope.teamMembers = data;

        }).
        error(function(data, status, headers, config) {
            console.log("error in regularEventController");
        });

    };

    $scope.countCheckedMembers = function (teamMembers) {

        $scope.checkedMembers = [ ];

        angular.forEach(teamMembers, function(member){
            if(member.checkbox == true){

                $scope.checkedMembers.push(member.customer_username);

            }
        });     
    };

    $scope.teamSignUp = function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };
        $http.post('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments/'+$stateParams.tournament+'/register?date='+$stateParams.date+'&location='+$stateParams.location+'', {

            "team": $scope.selectedTeam.team.team_name,
            "players": $scope.checkedMembers

        }, config).success(function(data) {

            var confirmPopup = $ionicPopup.alert({
                title: 'Team Sign Up',
                template: 'You have succesfully signed up '+$scope.selectedTeam.team.team_name+' in '+$stateParams.tournament+'!'
            });
            confirmPopup.then(function (res) {

            });

        }).
        error(function(data, status, headers, config) {
            console.log("error in regularEventController");
        });



    };

}]);