var myApp = angular.module('regular-events', []);

/* This controller will interact in two ways.
 * The controller can managae data of a regular event or of a tournament
 * Using angular we can choose what displays can be used through boolean variables and can use the same view for regular events and tournaments
 * This is because regular events lack alot of added features that are present in premium events and are in essence a single tournament
 *
 * This controller will determine if the data sent is either a tournament from a premium event or a regular event and act accordingly
 */
myApp.controller('tournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$q', '$state', '$rootScope',
function ($scope, $http, $stateParams, sharedDataService, $q, $state, $rootScope) {

        var now_utc = new Date();

        // Vairables that control what is shown in the tournament page
        $scope.competitorsTab = false;
        $scope.standingsTab = false;
        $scope.groupStageTab = false;
        $scope.roundsTab = false;
        $scope.bracketTab = false;
        $scope.canRegister = false;

        // Get event Info
        $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location)
            .success(function (data, status) {
                $scope.eventInfo = data;

                // Check if event is premium
                if ($scope.eventInfo.host)
                    getPremiumTournament();
                else
                    getRegularTournament();
            });

        var getPremiumTournament = function () {
            // Get Tournament Information
            $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function (data) {
                $scope.tournamentInfo = data;
                $q.all(
      [
       // Get Organization
       $http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.eventInfo.host),
       // Competitors
       $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location),

       // Get Sponsors
       $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/sponsors?date=' + $stateParams.date + '&location=' + $stateParams.location),
      ])
                    .then(function (results) {
                        // Get Organization
                        $scope.hostInfo = results[0].data;
                        // Get Competitors
                        $scope.competitors = results[1].data;
                        // Get sponsors
                        $scope.sponsors = results[2].data;
                        initStuff();
                    }, function (err) {
                        console.log(err);
                        console.log("Oh oh");
                    });
            });

        }


        var getRegularTournament = function () {
            // get tournaments
            $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments?date=' + $stateParams.date + '&location=' + $stateParams.location)
                .then(function (data) {
                    $scope.tournamentInfo = data.data[0];
                    $scope.requiresTeam = $scope.tournamentInfo.is_team_based;
                    if ($scope.tournamentInfo.tournament_format == 'Two Stage')
                        $scope.groupStage = true;
                    else
                        $scope.groupStage = false;
                    $q.all(
      [
       // Get Creator
       $http.get($rootScope.baseURL + '/matchup/profile/' + $scope.eventInfo.creator),
       // Competitors
       $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $scope.tournamentInfo.tournament_name + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location),

      ])
                        .then(function (results) {
                            // Get Organization
                            $scope.hostInfo = results[0].data;
                            // Get Competitors
                            $scope.competitors = results[1].data;

                            initStuff();
                        }, function (err) {
                            console.log(err);
                            console.log("Oh oh");
                        });
                });
        }


        var initStuff = function () {

            var start_date = new Date($scope.tournamentInfo.tournament_start_date);
            // Check if ongoing
            if (now_utc.getTime() > start_date.getTime()) {
                // Tournament Started
                $scope.standingsTab = true;

            } else
            // Tournament not started
                $scope.competitorsTab = true;

            // Check registration deadline with current time
            $scope.canRegister = (new Date($scope.eventInfo.event_registration_deadline)).getTime() > now_utc.getTime();
        }

}]);



myApp.controller('editTournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$q', '$state', '$rootScope', '$filter',
function ($scope, $http, $stateParams, sharedDataService, $q, $state, $rootScope, $filter) {

        // Get tournament
        $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
            $scope.tournament = data;
            $scope.tournament.tournament_start_date = new Date($scope.tournament.tournament_start_date).toUTCString();
            $scope.tournament.tournament_check_in_deadline = new Date($scope.tournament.tournament_check_in_deadline).toUTCString();

            console.log("datadetor");

            console.log($scope.tournament);
            $scope.tournament.team_size = 9001;

            //get event
            $http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
                $scope.event = data;
                if(event.host == null)
                    $scope.event.isHosted = false;
                else
                    $scope.event.isHosted = true;
                    

            });

            $http.get($rootScope.baseURL + '/matchup/popular/games').success(function (data, status) {
                $scope.games = data;
                console.log($scope.games);


            });

        });


        // Init tournament type object
        $scope.tournamentType = ['Single Stage', 'Two Stage'];

        // Init tournament format object
        $scope.tournamentFormat = ['Single Elimination', 'Double Elimination', 'Round Robin'];

        // Init tournament format object
        $scope.tournamentFormatTwo = ['Single Elimination', 'Double Elimination'];


        $scope.validateTournament = function () {

            // Check for blank inputs
            if (!$scope.tournament.tournament_name | !$scope.tournament.tournament_check_in_deadline | !$scope.tournament.tournament_rules | !$scope.tournament.tournament_start_date | !$scope.tournament.competitor_fee | !$scope.tournament.seed_money | !$scope.tournament.tournament_max_capacity) {
                alert("Please fill out the general info section");
                console.log(!$scope.tournament.tournament_name + ', ' + !$scope.tournament.tournament_check_in_deadline + ', ' + !$scope.tournament.tournament_rules + ', ' + !$scope.tournament.tournament_start_date + ', ' + !$scope.tournament.competitor_fee + ', ' + !$scope.tournament.seed_money + ', ' + !$scope.tournament.deduction_fee + ', ' + !$scope.tournament.tournament_max_capacity);
                return;
            }
            if(!event.isHosted && $scope.tournament.tournament_max_capacity > 32){
                   alert("Capacity for regular events can not be more than 32.");
                return;
            }

            //		 Validate start date with respect to event
            if ($scope.tournament.tournament_start_date < $scope.event.event_start_date | $scope.tournament.tournament_start_date > $scope.event.event_end_date) {
                alert("Tournament start date cant be after or before the event");
                return;
            }

            // Validate deadline with respect to tournament start date and event end date
            if ($scope.tournament.tournament_start_date <= $scope.tournament.tournament_check_in_deadline | $scope.tournament.tournament_check_in_deadline > $scope.event.event_end_date | $scope.tournament.tournament_check_in_deadline <= $scope.event.event_start_date) {
                alert("Tournament check in deadline cant be after the event end date or before the tournament start date or end date");
                return;
            }

            if ($scope.tournament.is_team_based) {
                // Check team size null and illegal number
                if ($scope.tournament.team_size <= 1) {
                    alert("Theres no I or 0 or negativity in team");
                    return;
                }
            } else {
                // If team is false init to 0
                $scope.tournament.team_size = 0;
            }


            // Validate Tournament Type
            if ($scope.tournament.tournament_type == 'Two Stage') {
                // Validate group stuff
                if (!$scope.tournament.number_of_people_per_group || !$scope.tournament.amount_of_winners_per_group) {
                    alert("Specify competitors per group and competitors advancing");
                    return;
                }
                if (parseInt($scope.tournament.number_of_people_per_group) < parseInt($scope.tournament.amount_of_winners_per_group)) {
                    alert("Competitors can be larger than participants per group");
                    return;
                }
            } else {
                // Init group stuff to zero in 
                $scope.tournament.number_of_people_per_group = 0;
                $scope.tournament.amount_of_winners_per_group = 0;
            }

            // Validate tournament format
            if (!$scope.tournament.tournament_format) {
                alert("Please select tournament format");
                return;
            }

            if ($scope.tournament.scoring)
                $scope.tournament.score_type = "Points";
            else
                $scope.tournament.score_type = "Match";

            var tournament = {
                "name": $scope.tournament.tournament_name,
                "game": $scope.tournament.game_name,
                "rules": $scope.tournament.tournament_rules,
                "teams": $scope.tournament.is_team_based,
                //"team_size": $scope.tournament.team_size,
                "start_date": $scope.tournament.tournament_start_date,
                "deadline": $scope.tournament.tournament_check_in_deadline,
                "fee": $scope.tournament.competitor_fee,
                "capacity": $scope.tournament.tournament_max_capacity,
                "seed_money": $scope.tournament.seed_money,
                "type": $scope.tournament.tournament_type,
                "format": $scope.tournament.tournament_format,
                "scoring": $scope.tournament.score_type,
                "group_players": $scope.tournament.number_of_people_per_group,
                "group_winners": $scope.tournament.amount_of_winners_per_group,
            };
            $http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, tournament).success(function (data, status) {
                alert("Tournament Succesfully Edited");


                $state.go("app.eventSettings", {
                    "eventName": $scope.event.event_name,
                    "eventDate": $scope.event.event_start_date,
                    "eventLocation": $scope.event.event_location
                })
            });
        }

        // Cancel Tournament, go to organizer or general info page depending of organization selected
        $scope.cancelTournament = function () {

            $state.go("app.eventSettings", {
                "eventName": $scope.event.event_name,
                "eventDate": $scope.event.event_start_date,
                "eventLocation": $scope.event.event_location
            })
        }


                }]);