var myApp = angular.module('tournaments', []);

/* This controller will interact in two ways.
 * The controller can manage data of a regular event or of a tournament
 * Using angular we can choose what displays can be used through boolean variables and can use the same view for regular events and tournaments
 * This is because regular events lack alot of added features that are present in premium events and are in essence a single tournament
 *
 * This controller will determine if the data sent is either a tournament from a premium event or a regular event and act accordingly
 */
myApp.controller('tournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$q', '$state', '$rootScope',
function($scope, $http, $stateParams, sharedDataService, $q, $state, $rootScope) {

	var now_utc = new Date();

	// Variables that control what is shown in the tournament page
	$scope.competitorsTab = false;
	$scope.standingsTab = false;
	$scope.groupStageTab = false;
	$scope.roundsTab = false;
	$scope.bracketTab = false;
	$scope.canRegister = false;

	// Get event Info
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function(data, status) {
		$scope.eventInfo = data;

		// Check if event is premium
		if ($scope.eventInfo.host)
			getPremiumTournament();
		else
			getRegularTournament();
	});

	var getPremiumTournament = function() {
		// Get Tournament Information
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function(data) {
			$scope.tournamentInfo = data;
			$q.all([
			// Get Organization
			$http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.eventInfo.host),
			// Competitors
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location),

			// Get Sponsors
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/sponsors?date=' + $stateParams.date + '&location=' + $stateParams.location)]).then(function(results) {
				// Get Organization
				$scope.hostInfo = results[0].data;
				// Get Competitors
				$scope.competitors = results[1].data;
				// Get sponsors
				$scope.sponsors = results[2].data;
				initStuff();
				getRounds();
			}, function(err) {
				console.log(err);
				console.log("Oh oh");
			});
		});

	};

	var getRegularTournament = function() {
		// get tournaments
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments?date=' + $stateParams.date + '&location=' + $stateParams.location).then(function(data) {
			$scope.tournamentInfo = data.data[0];
			if ($scope.tournamentInfo.tournament_type == 'Two Stage')
				$scope.groupStage = true;
			else
				$scope.groupStage = false;
			$q.all([
			// Get Creator
			$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.eventInfo.creator),
			// Competitors
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $scope.tournamentInfo.tournament_name + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location)]).then(function(results) {
				// Get Organization
				$scope.hostInfo = results[0].data;
				// Get Competitors
				$scope.competitors = results[1].data;

				initStuff();
				// Comentado por ahora
//				getRounds();
			}, function(err) {
				console.log(err);
				console.log("Oh oh");
			});
		});
	};

	var initStuff = function() {

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

		$scope.bracketTypes = ['Winners', 'Losers'];
		$scope.bracket = 'Winners';
	};

	var getRounds = function() {
		//http://matchup.neptunolabs.com/matchup/events/Event 01/tournaments/Ultra Street Fighter IV Qualifiers/rounds/1/matches/1?date=2015-03-25 09:00:00&location=miradero
		//http://matchup.neptunolabs.com/matchup/events/Event 01/tournaments/Ultra Street Fighter IV Qualifiers/rounds?date=2015-03-25T09:00:00.000Z&location=miradero
		//http://matchup.neptunolabs.com/matchup/events/Event 01/tournaments/Ultra Street Fighter IV Qualifiers/rounds?date=2015-03-25 09:00:00&location=miradero
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $scope.tournamentInfo.tournament_name + '/rounds?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function(data, status) {
			$scope.tournamentInfo = data;
			
			// Lo puse por ahora, manejo de tabs se debe hacer antes
			$scope.roundsTab = true;
			//console.log(data);
		}).then(function() {
			$scope.bracketType = $scope.tournamentInfo.finalStage.winnerRounds
			$scope.selectedRound = $scope.bracketType[0];
			if ($scope.tournamentInfo.groupStage) {

				$scope.selectedGroup = $scope.tournamentInfo.groupStage.groups[0];
				$scope.selectedGroupRound = $scope.selectedGroup.rounds[0];
			}
			//console.log($scope.selectedGroupRound);
			$scope.getMatch(1, 1);

		});
	};
	$scope.resetGroup = function() {
		$scope.selectedGroupRound = $scope.selectedGroup.rounds[0];
	};
	$scope.bracketChange = function(bracket) {
		//testing.....
		// console.log('enter');
 		console.log("Winners");
		if (bracket == 'Winners') {
			$scope.bracketType = $scope.tournamentInfo.finalStage.winnerRounds;
			$scope.selectedRound = $scope.tournamentInfo.finalStage.winnerRounds[0];

		} else {
			console.log("Losers");
			$scope.bracketType = $scope.tournamentInfo.finalStage.loserRounds;
			$scope.selectedRound = $scope.tournamentInfo.finalStage.loserRounds[0];

		}
	};
	//not sure if needed, waiting on new DB dump
	$scope.getMatch = function(round, match) {
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '/rounds/' + round + '/matches/' + match + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function(data, status) {
			$scope.matchInfo = data;

			console.log(data);
		}).then(function() {
			console.log($scope.matchInfo);

		});

	};
}]);

myApp.controller('editTournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$q', '$state', '$rootScope', '$filter',
function($scope, $http, $stateParams, sharedDataService, $q, $state, $rootScope, $filter) {

	// Get tournament
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data, status) {
		$scope.tournament = data;

		$scope.tournament.tournament_start_date = new Date($scope.tournament.tournament_start_date);
		$scope.tournament.tournament_check_in_deadline = new Date($scope.tournament.tournament_check_in_deadline);

		console.log($scope.tournament);
		$scope.tournament.team_size = 9001;

		//get event
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data, status) {
			$scope.event = data;
			if (event.host == null)
				$scope.event.isHosted = false;
			else
				$scope.event.isHosted = true;

		});

		$http.get($rootScope.baseURL + '/matchup/popular/games').success(function(data, status) {
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

	$scope.validateTournament = function() {

		// Check for blank inputs
		if (!$scope.tournament.tournament_name | !$scope.tournament.tournament_check_in_deadline | !$scope.tournament.tournament_rules | !$scope.tournament.tournament_start_date | !$scope.tournament.competitor_fee | !$scope.tournament.seed_money | !$scope.tournament.tournament_max_capacity) {
			alert("Please fill out the general info section");
			console.log(!$scope.tournament.tournament_name + ', ' + !$scope.tournament.tournament_check_in_deadline + ', ' + !$scope.tournament.tournament_rules + ', ' + !$scope.tournament.tournament_start_date + ', ' + !$scope.tournament.competitor_fee + ', ' + !$scope.tournament.seed_money + ', ' + !$scope.tournament.deduction_fee + ', ' + !$scope.tournament.tournament_max_capacity);
			return;
		}
		if (!event.isHosted && $scope.tournament.tournament_max_capacity > 32) {
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
			"name" : $scope.tournament.tournament_name,
			"game" : $scope.tournament.game_name,
			"rules" : $scope.tournament.tournament_rules,
			"teams" : $scope.tournament.is_team_based,
			//"team_size": $scope.tournament.team_size,
			"start_date" : $scope.tournament.tournament_start_date,
			"deadline" : $scope.tournament.tournament_check_in_deadline,
			"fee" : $scope.tournament.competitor_fee,
			"capacity" : $scope.tournament.tournament_max_capacity,
			"seed_money" : $scope.tournament.seed_money,
			"type" : $scope.tournament.tournament_type,
			"format" : $scope.tournament.tournament_format,
			"scoring" : $scope.tournament.score_type,
			"group_players" : $scope.tournament.number_of_people_per_group,
			"group_winners" : $scope.tournament.amount_of_winners_per_group,
		};
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, tournament).success(function(data, status) {
			alert("Tournament Succesfully Edited");

			$state.go("app.eventSettings", {
				"eventName" : $scope.event.event_name,
				"eventDate" : $scope.event.event_start_date,
				"eventLocation" : $scope.event.event_location
			});
		});
	};

	// Cancel Tournament, go to organizer or general info page depending of organization selected
	$scope.cancelTournament = function() {

		$state.go("app.eventSettings", {
			"eventName" : $scope.event.event_name,
			"eventDate" : $scope.event.event_start_date,
			"eventLocation" : $scope.event.event_location
		});
	};

}]);


myApp.controller('bracketController', ['$scope', function ($scope) {

	var checkNamePostions = function checkNamePosition(j, rounds) {
		// Check if the current match of the current round has players
		if (rounds[1][j].players.length != 0) {
			var found = false;
			// Check where that player is in the newly pushed matches which are in correct order
			// of the bracket
			// Check last match push if its completed
			if (rounds[0][rounds[0].length - 1].match_completed) {
				// Current match player[0] == last pushed match.player 0 OR player[0] == last pushed player 1
				// This will check for the match child who is currently in the bottom
				if (rounds[1][j].players[0].customer_username == rounds[0][rounds[0].length - 1].players[0].customer_username || rounds[1][j].players[0].customer_username == rounds[0][rounds[0].length - 1].players[1].customer_username) {
					// Check if players exist
					if (rounds[1][j].players[0])
						rounds[1][j].players[0].position = "bottom";
					if (rounds[1][j].players[1])
						rounds[1][j].players[1].position = "top";
					// Got both players in the right position. Go to next iteration
					found = true;
				}
			}
			// Check for null
			if (rounds[0][rounds[0].length - 2]) {
				// This will check for the match child who is currently in the top
				if (rounds[0][rounds[0].length - 2].completed && !found) {
					if (rounds[1][j].players[0].customer_username == rounds[0][rounds[0].length - 2].players[0].customer_username || rounds[1][j].players[0].customer_username == rounds[0][rounds[0].length - 2].players[1].customer_username) {
						if (rounds[1][j].players[0])
							rounds[1][j].players[0].position = "top";
						if (rounds[1][j].players[1])
							rounds[1][j].players[1].position = "bottom";
					}
				}
			}
		}
	}

	var tournamentData = {
    "finalStage": {
      "winnerRounds": [
        {
          "round_number": 1,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Alicia",
                  "customer_tag": "Alicia",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "0"
              },
                {
                  "customer_username": "Lexter",
                  "customer_tag": "Lexter",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              }
            ]
          },
            {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Pablo",
                  "customer_tag": "Pablo",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Luis",
                  "customer_tag": "Luis",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              }
            ]
          },
            {
              "match_number": 3,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Wesley",
                  "customer_tag": "Wesley",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Nayda",
                  "customer_tag": "Nayda",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "0"
              }
            ]
          },
            {
              "match_number": 4,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Fernando",
                  "customer_tag": "Fernando",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "0"
              }
            ]
          },
           {
              "match_number": 5,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Tavarez",
                  "customer_tag": "Tavarez",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Couvi",
                  "customer_tag": "Couvi",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "0"
              }
            ]
          },
          {
              "match_number": 6,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Sam",
                  "customer_tag": "Sam",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Badillo",
                  "customer_tag": "Badillo",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "0"
              }
            ]
          },
          {
              "match_number": 7,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Rapol",
                  "customer_tag": "Rapol",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Final Boss",
                  "customer_tag": "Final Boss",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 8,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Enrique",
                  "customer_tag": "Enrique",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Snow",
                  "customer_tag": "Snow",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 9,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Juan",
                  "customer_tag": "Juan",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Pedro",
                  "customer_tag": "Pedro",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "1"
              }
            ]
          }
        ]
      },
        {
          "round_number": 2,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Leo",
                  "customer_tag": "Leo",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Juan",
                  "customer_tag": "Juan",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "1"
              }
            ]
          },
            {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Maria",
                  "customer_tag": "Maria",
                  "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Snow",
                  "customer_tag": "Snow",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 3,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Fwosh",
                  "customer_tag": "Fwosh",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Final Boss",
                  "customer_tag": "Final Boss",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 4,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Ramon",
                  "customer_tag": "Ramon",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Sam",
                  "customer_tag": "Sam",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 5,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Rick",
                  "customer_tag": "Rick",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Tavarez",
                  "customer_tag": "Tavarez",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 6,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Oscar",
                  "customer_tag": "Oscar",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "0"
              },
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 7,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Angel",
                  "customer_tag": "Angel",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "0"
              },
                {
                  "customer_username": "Wesley",
                  "customer_tag": "Wesley",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 8,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Lexter",
                  "customer_tag": "Lexter",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Luis",
                  "customer_tag": "Luis",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          }
        ]
      },
        {
          "round_number": 3,
          "matches": [
          {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Leo",
                  "customer_tag": "Leo",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Tavarez",
                  "customer_tag": "Tavarez",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Wesley",
                  "customer_tag": "Wesley",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Snow",
                  "customer_tag": "Snow",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 3,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Final Boss",
                  "customer_tag": "Final Boss",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 4,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Tavarez",
                  "customer_tag": "Tavarez",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Sam",
                  "customer_tag": "Sam",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          }

          ]
            
        },
          {
          "round_number": 4,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Leo",
                  "customer_tag": "Leo",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Tavarez",
                  "customer_tag": "Tavarez",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Wesley",
                  "customer_tag": "Wesley",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "0"
              },
                {
                  "customer_username": "Final Boss",
                  "customer_tag": "Final Boss",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          }
        ]
      },
        {
          "round_number": 5,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Leo",
                  "customer_tag": "Leo",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Final Boss",
                  "customer_tag": "Final Boss",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          }
        ]
      },
      {
          "round_number": 6,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Final Boss",
                  "customer_tag": "Final Boss",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                  "score": "1"
              }
            ]
          }
        ]
      }
    ],
      "loserRounds": [
        {
          "round_number": 1,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Pedro",
                  "customer_tag": "Pedro",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "0"
              },
                {
                  "customer_username": "Enrique",
                  "customer_tag": "Enrique",
                  "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg",
                  "score": "2"
              }
            ]
          }
        ]
      },
        {
          "round_number": 2,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Juan",
                  "customer_tag": "Juan",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Enrique",
                  "customer_tag": "Enrique",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Maria",
                  "customer_tag": "Maria",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Rick",
                  "customer_tag": "Rick",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 3,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Ramon",
                  "customer_tag": "Ramon",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Luis",
                  "customer_tag": "Luis",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 4,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Oscar",
                  "customer_tag": "Oscar",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Fwosh",
                  "customer_tag": "Fwosh",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 5,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Nayda",
                  "customer_tag": "Nayda",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Angel",
                  "customer_tag": "Angel",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 6,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Alicia",
                  "customer_tag": "Alicia",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Pablo",
                  "customer_tag": "Pablo",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 7,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Couvi",
                  "customer_tag": "Couvi",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "0"
              },
                {
                  "customer_username": "Fernando",
                  "customer_tag": "Fernando",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 8,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Rapol",
                  "customer_tag": "Rapol",
                  "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Badillo",
                  "customer_tag": "Badillo",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              }
            ]
          }
        ]
      },
        {
          "round_number": 3,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Juan",
                  "customer_tag": "Juan",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Rapol",
                  "customer_tag": "Rapol",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "0"
              }
            ]
          },
          {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Fernando",
                  "customer_tag": "Fernando",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Maria",
                  "customer_tag": "Maria",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "0"
              }
            ]
          },
          {
              "match_number": 3,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Luis",
                  "customer_tag": "Luis",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Alicia",
                  "customer_tag": "Alicia",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 4,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Oscar",
                  "customer_tag": "Oscar",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Nayda",
                  "customer_tag": "Nayda",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          }
        ]
      },
        {
          "round_number": 4,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Juan",
                  "customer_tag": "Juan",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Lexter",
                  "customer_tag": "Lexter",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Snow",
                  "customer_tag": "Snow",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Fernando",
                  "customer_tag": "Fernando",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 3,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Alicia",
                  "customer_tag": "Alicia",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          },
          {
              "match_number": 4,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Sam",
                  "customer_tag": "Sam",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Nayda",
                  "customer_tag": "Nayda",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          }
        ]
      },
        {
          "round_number": 5,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Sam",
                  "customer_tag": "Sam",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Lexter",
                  "customer_tag": "Lexter",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Snow",
                  "customer_tag": "Snow",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "0"
              },
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          }
        ]
      },
        {
          "round_number": 6,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Tavarez",
                  "customer_tag": "Tavarez",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "1"
              },
                {
                  "customer_username": "Lexter",
                  "customer_tag": "Lexter",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "2"
              }
            ]
          },
          {
              "match_number": 2,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Wesley",
                  "customer_tag": "Wesley",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "1"
              }
            ]
          }
        ]
      },
        {
          "round_number": 7,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Lexter",
                  "customer_tag": "Lexter",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "0"
              }
            ]
          }
        ]
      },
        {
          "round_number": 8,
          "matches": [
            {
              "match_number": 1,
              "match_completed": true,
              "players": [
                {
                  "customer_username": "Amir",
                  "customer_tag": "Amir",
                  "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                  "score": "2"
              },
                {
                  "customer_username": "Leo",
                  "customer_tag": "Leo",
                  "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                  "score": "0"
              }
            ]
          }
        ]
      }
    ]
    },
    "groupStage": {
      "groups": [
        {
          "group_number": 1,
          "rounds": [
            {
              "round_number": 1,
              "matches": [
                {
                  "match_number": 1,
                  "match_completed": true,
                  "players": [
                    {
                      "customer_username": "papaluisre",
                      "customer_tag": "FZN.PaPa",
                      "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                      "score": "2"
                  },
                    {
                      "customer_username": "rapol",
                      "customer_tag": "rapol",
                      "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg",
                      "score": "0"
                  }
                ]
              }
            ]
          },
            {
              "round_number": 2,
              "matches": [
                {
                  "match_number": 1,
                  "match_completed": true,
                  "players": [
                    {
                      "customer_username": "rapol",
                      "customer_tag": "rapol",
                      "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg",
                      "score": "1"
                  },
                    {
                      "customer_username": "samdlt",
                      "customer_tag": "samdlt",
                      "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                      "score": "2"
                  }
                ]
              }
            ]
          },
            {
              "round_number": 3,
              "matches": [
                {
                  "match_number": 1,
                  "match_completed": true,
                  "players": [
                    {
                      "customer_username": "papaluisre",
                      "customer_tag": "FZN.PaPa",
                      "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                      "score": "1"
                  },
                    {
                      "customer_username": "samdlt",
                      "customer_tag": "samdlt",
                      "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                      "score": "2"
                  }
                ]
              }
            ]
          }
        ]
      },
        {
          "group_number": 2,
          "rounds": [
            {
              "round_number": 1,
              "matches": [
                {
                  "match_number": 2,
                  "match_completed": true,
                  "players": [
                    {
                      "customer_username": "ollidab",
                      "customer_tag": "ollidab",
                      "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                      "score": "1"
                  },
                    {
                      "customer_username": "jems9102",
                      "customer_tag": "jems9102",
                      "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
                      "score": "2"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
    }
  }

  $scope.format = "Double Elimination";

	// Formatted rounds
	$scope.rounds = [];

	if ($scope.format == "Single Elimination") {

		var roundsResponse = tournamentData.rounds;

		// Init bracket by pushing final match
		$scope.rounds.push([]);
		$scope.rounds[0].push(roundsResponse[roundsResponse.length - 1].matches[0]);

		// Build perfect bracket
		if (getNextPowerOf2(roundsResponse[1].matches.length) == roundsResponse[0].matches.length) {
			// Start iterating from the last round
			for (var i = roundsResponse.length - 1; i > 0; i--) {
				// Unshift new round to first index in rounds
				$scope.rounds.unshift([]);
				// Iterate through the matches of each round
				for (var j = 0; j < roundsResponse[i].matches.length; j++) {
					// Get the match number of the current round which is in order with repect to the bracket
					var curMatch = $scope.rounds[1][j].match_number - 1;
					// Magic numbers
					var matchChild1 = curMatch;
					var matchChild2 = roundsResponse[i - 1].matches.length - curMatch - 1;
					// Push child matches of round 0 to the new array of scope.rounds0 which are in the correct
					// order of the bracket
					$scope.rounds[0].push(roundsResponse[i - 1].matches[matchChild1]);
					$scope.rounds[0].push(roundsResponse[i - 1].matches[matchChild2]);
					checkNamePostions(j, $scope.rounds);
				}
			}
		}
		// Build bracket with byes
		else {
			// Start iterating from the last round, stop at round 1
			for (var i = roundsResponse.length - 1; i > 1; i--) {
				// Unshift new round to first index in rounds
				$scope.rounds.unshift([]);
				// Iterate through the matches of each round
				for (var j = 0; j < roundsResponse[i].matches.length; j++) {
					// Get the match number of the current round which is in order with repect to the bracket
					var curMatch = $scope.rounds[1][j].match_number - 1;
					// Magic numbers
					var matchChild1 = curMatch;
					var matchChild2 = roundsResponse[i - 1].matches.length - curMatch - 1;
					// Push child matches of round 0 to the new array of scope.rounds0 which are in the correct
					// order of the bracket
					$scope.rounds[0].push(roundsResponse[i - 1].matches[matchChild1]);
					$scope.rounds[0].push(roundsResponse[i - 1].matches[matchChild2]);

					checkNamePostions(j, $scope.rounds);
				}
			}
			// Unshift fist round
			$scope.rounds.unshift([]);
			// Last round has byes
			// Winners Round 1 - Winner goes to
			for (j = 0; j < roundsResponse[0].matches.length; j++) {
				var goesTo;
				if (j < (roundsResponse[0].matches.length - $scope.rounds[1].length)) {
					// Calculate where does the current match goes to in round 2
					goesTo = roundsResponse[0].matches.length + j - ((roundsResponse[0].matches.length - $scope.rounds[1].length) * 2);
					// Init child matches for the second round match if null
					if (!$scope.rounds[1][goesTo].childMatches)
						$scope.rounds[1][goesTo].childMatches = [];
					$scope.rounds[1][goesTo].childMatches.push(j);
				} else {
					// Calculate where does the current match goes to in round 2
					goesTo = roundsResponse[0].matches.length - j - 1;
					// Init child matches for the second round match if null
					if (!$scope.rounds[1][goesTo].childMatches)
						$scope.rounds[1][goesTo].childMatches = [];
					$scope.rounds[1][goesTo].childMatches.push(j);
				}
			}
			// Populate first round with spacers and players when necessary
			var firstRoundIndex = 0;
			for (j = 0; j < $scope.rounds[1].length; j++) {
				var curMatch = $scope.rounds[1][j].match_number - 1;
				if (typeof $scope.rounds[1][curMatch].childMatches === "undefined") {
					$scope.rounds[0][firstRoundIndex] = {
						"bye": true,
					};
					$scope.rounds[0][firstRoundIndex + 1] = {
						"bye": true,
					};
				} else if ($scope.rounds[1][curMatch].childMatches.length == 1) {
					$scope.rounds[0][firstRoundIndex] = {
						"bye": true,
					};
					$scope.rounds[0][firstRoundIndex + 1] = roundsResponse[0].matches[$scope.rounds[1][curMatch].childMatches[0]];
				} else {
					$scope.rounds[0][firstRoundIndex] = roundsResponse[0].matches[$scope.rounds[1][curMatch].childMatches[0]];
					$scope.rounds[0][firstRoundIndex + 1] = roundsResponse[0].matches[$scope.rounds[1][curMatch].childMatches[1]];
				}
				firstRoundIndex += 2;
			}

		}
		var bracketHeight = $scope.rounds[0].length * 96 + 18 + 39 + 20;
		$scope.bracketHeight = {
			"height": bracketHeight + 'px',
		}
	}

	// Double Elimination
	else {

		var roundsResponse = tournamentData.finalStage;

		// Winners

		var winnerRounds = roundsResponse.winnerRounds;

		// Init bracket by initializing first round
		$scope.rounds.push([]);

		// Round length variable used to fool the algorithm to work with extra rounds
		var roundLength = 0;

		// Checking extra round
		if (winnerRounds.length >= 3) {
			// Checking for nulls
			if (winnerRounds[winnerRounds.length - 1].matches.length == 1 && winnerRounds[winnerRounds.length - 2].matches.length == 1 && winnerRounds[winnerRounds.length - 3].matches.length == 1) {
				// Theres an extra round

				// Push final match Extra round (Loser winner VS winner)
				$scope.rounds[0].push(winnerRounds[winnerRounds.length - 1].matches[0]);

				// Make it smaller
				$scope.rounds[0][0].extra = true;

				// Make room for first match of the finals
				$scope.rounds.unshift([]);

				// Push final match (Loser winner VS winner)
				$scope.rounds[0].push(winnerRounds[winnerRounds.length - 2].matches[0]);

				// This match needs to be formatted to show that a player comes from the losers bracket
				$scope.rounds[0][0].isLoser = true;

				// Make it smaller
				$scope.rounds[0][0].extra = true;

				// Start fors at roundLength after this mess
				roundLength = winnerRounds.length - 2;

			}
			// No extra Round
			else {

				// Push final match (Loser winner VS winner)
				$scope.rounds[0].push(winnerRounds[winnerRounds.length - 1].matches[0]);
				// Format loser position
				$scope.rounds[0][0].isLoser = true;
				// Make it smaller
				$scope.rounds[0][0].extra = true;
				roundLength = winnerRounds.length - 1;
			}
		}
		// No extra Round and less than 3 matches
		else {
			// Push final match (Loser winner VS winner)
			$scope.rounds[0].push(winnerRounds[winnerRounds.length - 1].matches[0]);
			// Format loser position
			$scope.rounds[0][0].isLoser = true;
			// Make it smaller
			$scope.rounds[0][0].extra = true;
			roundLength = winnerRounds.length - 1;
		}

		$scope.rounds.unshift([]);
		$scope.rounds[0].push(winnerRounds[roundLength - 1].matches[0]);

		// Arrange the position of players for the final match
		checkNamePostions(0, $scope.rounds);

		// Build perfect bracket
		if (getNextPowerOf2(winnerRounds[1].matches.length) == winnerRounds[0].matches.length) {
			// Start iterating from the last round
			for (var i = roundLength - 1; i > 0; i--) {
				// Unshift new round to first index in rounds
				$scope.rounds.unshift([]);
				// Iterate through the matches of each round
				for (var j = 0; j < winnerRounds[i].matches.length; j++) {
					// Get the match number of the current round which is in order with repect to the bracket
					var curMatch = $scope.rounds[1][j].match_number - 1;
					// Magic numbers
					var matchChild1 = curMatch;
					// Push child matches of round 0 to the new array of scope.rounds0 which are in the correct
					// order of the bracket
					$scope.rounds[0].push(winnerRounds[i - 1].matches[matchChild1]);
					// Used for final match which only has one child
					if (winnerRounds.length[i - 1] != 1) {
						var matchChild2 = winnerRounds[i - 1].matches.length - curMatch - 1;
						$scope.rounds[0].push(winnerRounds[i - 1].matches[matchChild2]);
					}
					checkNamePostions(j, $scope.rounds);
				}
			}
		}
		// Build bracket with byes
		else {
			// Start iterating from the last round, stop at round 1
			for (var i = roundLength - 1; i > 1; i--) {
				// Unshift new round to first index in rounds
				$scope.rounds.unshift([]);
				// Iterate through the matches of each round
				for (var j = 0; j < winnerRounds[i].matches.length; j++) {
					// Get the match number of the current round which is in order with repect to the bracket
					var curMatch = $scope.rounds[1][j].match_number - 1;
					// Magic numbers
					var matchChild1 = curMatch;
					// Push child matches of round 0 to the new array of scope.rounds0 which are in the correct
					// order of the bracket
					$scope.rounds[0].push(winnerRounds[i - 1].matches[matchChild1]);
					// Used for final match which only has one child
					if (winnerRounds.length[i - 1] != 1) {
						var matchChild2 = winnerRounds[i - 1].matches.length - curMatch - 1;
						$scope.rounds[0].push(winnerRounds[i - 1].matches[matchChild2]);
					}
					checkNamePostions(j, $scope.rounds);
				}
			}
			// Unshift fist round
			$scope.rounds.unshift([]);
			// Last round has byes
			// Winners Round 1 - Winner goes to
			for (j = 0; j < winnerRounds[0].matches.length; j++) {
				var goesTo;
				if (j < (winnerRounds[0].matches.length - $scope.rounds[1].length)) {
					// Calculate where does the current match goes to in round 2
					goesTo = winnerRounds[0].matches.length + j - ((winnerRounds[0].matches.length - $scope.rounds[1].length) * 2);
					// Init child matches for the second round match if null
					if (!$scope.rounds[1][goesTo].childMatches)
						$scope.rounds[1][goesTo].childMatches = [];
					$scope.rounds[1][goesTo].childMatches.push(j);
				} else {
					// Calculate where does the current match goes to in round 2
					goesTo = winnerRounds[0].matches.length - j - 1;
					// Init child matches for the second round match if null
					if (!$scope.rounds[1][goesTo].childMatches)
						$scope.rounds[1][goesTo].childMatches = [];
					$scope.rounds[1][goesTo].childMatches.push(j);
				}
			}
			// Populate first round with spacers and players when necessary
			var firstRoundIndex = 0;
			for (j = 0; j < $scope.rounds[1].length; j++) {
				var curMatch = $scope.rounds[1][j].match_number - 1;
				if (typeof $scope.rounds[1][curMatch].childMatches === "undefined") {
					$scope.rounds[0][firstRoundIndex] = {
						"bye": true,
					};
					$scope.rounds[0][firstRoundIndex + 1] = {
						"bye": true,
					};
				} else if ($scope.rounds[1][curMatch].childMatches.length == 1) {
					$scope.rounds[0][firstRoundIndex] = {
						"bye": true,
					};
					$scope.rounds[0][firstRoundIndex + 1] = winnerRounds[0].matches[$scope.rounds[1][curMatch].childMatches[0]];
				} else {
					$scope.rounds[0][firstRoundIndex] = winnerRounds[0].matches[$scope.rounds[1][curMatch].childMatches[0]];
					$scope.rounds[0][firstRoundIndex + 1] = winnerRounds[0].matches[$scope.rounds[1][curMatch].childMatches[1]];
				}
				firstRoundIndex += 2;
			}
		}


		var bracketHeight = $scope.rounds[0].length * 96 + 18 + 39 + 20;
		$scope.bracketHeight = {
			"height": bracketHeight + 'px',
		}

		// Losers Bracket

		var losersRound = roundsResponse.loserRounds;

		$scope.loserRounds = [];

		// Init rounds by pushing the first round
		$scope.loserRounds.push([]);
		$scope.loserRounds[0].push(losersRound[losersRound.length - 1].matches[0]);
		$scope.loserRounds[0][0].extra = true;

		// Start iterating from the last round till the round 2
		for (var i = losersRound.length - 1; i > 1; i--) {

			// Make room for the new round
			$scope.loserRounds.unshift([]);

			// If the current round and next round have the same number of matches
			if (losersRound[i].matches.length == losersRound[i - 1].matches.length) {
				// The first round will recieve the loser of the winner bracket
				$scope.loserRounds[1].isLoser = true;
				// Iterate through the current round to find the child match
				for (var j = 0; j < losersRound[i].matches.length; j++) {
					// Get the match number of the current round which is in order with repect to the bracket
					var curMatch = $scope.loserRounds[1][j].match_number - 1;
					// Magic numbers
					var matchChild1 = curMatch;
					// Push the corresponding match in the next round. If the lenght of the match are equal
					// the matches with the same match number must be side by side ie R2 Match 2 must
					// be index 3 if R3 Match 1 is index 3
					$scope.loserRounds[0].push(losersRound[i - 1].matches[matchChild1]);
					checkNamePostions(j, $scope.loserRounds);
				}
			}
			//
			else {
				// Iterate through the matches of last round pushed to arrange the child matches
				for (var j = 0; j < losersRound[i].matches.length; j++) {
					// Get the match number of the current round which is in order with repect to the bracket
					var curMatch = $scope.loserRounds[1][j].match_number - 1;
					// Magic numbers
					var matchChild1 = curMatch;
					var matchChild2 = losersRound[i - 1].matches.length - curMatch - 1;
					// Push child matches of round 0 to the new array of scope.rounds0 which are in the correct
					// order of the bracket
					$scope.loserRounds[0].push(losersRound[i - 1].matches[matchChild1]);
					$scope.loserRounds[0].push(losersRound[i - 1].matches[matchChild2]);
					checkNamePostions(j, $scope.loserRounds);
				}
			}
		}

		// Unshift fist round
		$scope.loserRounds.unshift([]);
		// Last round has byes
		// Winners Round 1 - Winner goes to
		for (j = 0; j < losersRound[0].matches.length; j++) {
			var goesTo;
			if (j < (losersRound[0].matches.length - $scope.loserRounds[1].length)) {
				// Calculate where does the current match goes to in round 2
				goesTo = losersRound[0].matches.length + j - ((losersRound[0].matches.length - $scope.loserRounds[1].length) * 2);
				// Init child matches for the second round match if null
				if (!$scope.loserRounds[1][goesTo].childMatches)
					$scope.loserRounds[1][goesTo].childMatches = [];
				$scope.loserRounds[1][goesTo].childMatches.push(j);
			} else {
				// Calculate where does the current match goes to in round 2
				goesTo = losersRound[0].matches.length - j - 1;
				// Init child matches for the second round match if null
				if (!$scope.loserRounds[1][goesTo].childMatches)
					$scope.loserRounds[1][goesTo].childMatches = [];
				$scope.loserRounds[1][goesTo].childMatches.push(j);
			}
		}
		// Populate first round with spacers and players when necessary
		var firstRoundIndex = 0;
		for (j = 0; j < $scope.loserRounds[1].length; j++) {
			var curMatch = $scope.loserRounds[1][j].match_number - 1;
			if (typeof $scope.loserRounds[1][curMatch].childMatches === "undefined") {
				$scope.loserRounds[0][firstRoundIndex] = {
					"bye": true,
				};
				$scope.loserRounds[0][firstRoundIndex + 1] = {
					"bye": true,
				};
			} else if ($scope.loserRounds[1][curMatch].childMatches.length == 1) {
				$scope.loserRounds[0][firstRoundIndex] = {
					"bye": true,
				};
				$scope.loserRounds[0][firstRoundIndex + 1] = losersRound[0].matches[$scope.loserRounds[1][curMatch].childMatches[0]];
			} else {
				$scope.loserRounds[0][firstRoundIndex] = losersRound[0].matches[$scope.loserRounds[1][curMatch].childMatches[0]];
				$scope.loserRounds[0][firstRoundIndex + 1] = losersRound[0].matches[$scope.loserRounds[1][curMatch].childMatches[1]];
			}
			firstRoundIndex += 2;
		}
		
		var loserBracketHeight = $scope.loserRounds[0].length * 96 + 18 + 39 + 20;
		$scope.loserBracketHeight = {
			"height": loserBracketHeight + 'px',
		}
	}
			}]);

function getNextPowerOf2(numOfRounds) {
	var power = 1;
	while (power <= numOfRounds)
		power *= 2;
	return power;
}