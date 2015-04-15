// Forms module. It contains all controller that manage
// form inputs
var myApp = angular.module('forms', []);

/*
 *	Controller that handles all the input field of the create
 *	event module. It will also initiate calls to the server
 *	to create the event
 *	templateUrl: "event/create_event.html"
 *	url (POST): http://matchup.neptunolabs.com/matchup/events?hosted=bool
 */
myApp.controller("CreateEventController", function($scope, $http, $window, $rootScope, $state) {

	//Get the organization the customer belongs to
	$http.get($rootScope.baseURL + '/matchup/profile/' + $window.sessionStorage.username + '/organizations').success(function(data) {

		$scope.userOrganization = [];
		$scope.userOrganization.push($window.sessionStorage.username);
		for (var i = 0; i < data.length; i++) {
			$scope.userOrganization.push(data[i].organization_name);
		}
		$scope.host = $scope.userOrganization[0];
	}).error(function(data, status) {
		console.log(status);
	});

	// Arrays to store local data before sending to the server.
	// Only used for the organizer page
	$scope.tournaments = [];
	$scope.fees = [];

	// Validate the input fields of the General Information form
	// This will check for null values, valid dates, and
	// correct length of the strings
	$scope.validateEvent = function() {
		// Check undefined values and valid stuff
		if (!$scope.event.name) {
			alert("Event name is required");
			return;
		}
		if (!$scope.event.start_date) {
			alert("Event start date is required");
			return;
		}
		// Check if start date is in the future
		if ($scope.event.start_date < new Date()) {
			alert("An event cant be in the past");
			return;
		}
		// Valid start date and end date
		if ($scope.event.start_date > $scope.event.end_date || !$scope.event.end_date) {
			alert("Start date must be before end date");
			return;
		}
		// Check if registration deadline is before the start date
		if ($scope.event.start_date < $scope.event.registration_deadline || !$scope.event.registration_deadline) {
			alert("Registration deadline date must be before start date");
			return;
		}
		// Check if deadline is in the past
		if ($scope.event.registration_deadline < new Date()) {
			alert("Registration deadline cant be in the past");
			return;
		}
		// Prompt the user to fill location and venue if the event is not online
		if (!$scope.event.is_online && (!$scope.event.location || !$scope.event.venue)) {
			alert("Please fill out event location and venue")
			return;
		}

		// Data was validated

		// Go to user create tournament if the event is hosted by the user
		if ($scope.userOrganization[0] == $scope.host) {
			$('#tab3').tab('show');
		}
		// Go to organizer page
		else {
			// Retrieve sponsors of the organization
			$scope.sponsors = [{
				name : 'Intel Gaming',
				img : "https://pbs.twimg.com/profile_images/378800000857186263/xyP_oi80_400x400.jpeg"
			}, {
				name : 'Twitch',
				img : "https://pbs.twimg.com/profile_images/509073338191183872/fYdty6yd.png"
			}, {
				name : 'See Puerto Rico',
				img : "http://www.visitusa.org.uk/memberassets/676/LGO-Estrella_SEE_blue-ing.jpg"
			}];
			$('#tab2').tab('show');
		}
	};

	// Creates a fee and clears input in addFeeModal
	$scope.createFee = function() {
		// Create fee object to be added to the fees array
		var fee = {
			"name" : $scope.fee.name,
			// Ticket amount
			"available" : parseInt($scope.fee.available),
			// Price
			"amount" : parseFloat($scope.fee.amount),
			"description" : $scope.fee.description,
		};
		// Push fee
		$scope.fees.push(fee);
		// Hide modal
		$("#addFeeModal").modal("hide");
		// Reset form
		$scope.fee.name = $scope.fee.amount = $scope.fee.available = $scope.fee.description = "";
	};

	// Delete the selected fee
	// @params
	// index: item to be deleted from the aray
	$scope.deleteFee = function(index) {
		$scope.fees.splice(index, 1);
	};

	/* Validate Tournament form
	 * If the user is creating a hosted event the function will
	 * add the event to the array else it will initiate a post
	 * to the server to create the event for the current user
	 * url (POST): http://matchup.neptunolabs.com/matchup/events?hosted=bool
	 */
	$scope.validateTournament = function() {

		// Check for blank inputs
		if ($scope.userOrganization[0] == $scope.host) {
			if (!$scope.tournament.name | !$scope.tournament.deadline | !$scope.tournament.rules | !$scope.tournament.start_date | !$scope.tournament.capacity) {
				alert("Please fill out the general info section");
				return;
			}
		} else {
			if (!$scope.tournament.name | !$scope.tournament.deadline | !$scope.tournament.rules | !$scope.tournament.start_date | !$scope.tournament.fee | !$scope.tournament.seed_money | !$scope.tournament.capacity) {
				alert("Please fill out the general info section");
				return;
			}
		}

		//	Validate start date with respect to event dates
		if ($scope.tournament.start_date < $scope.event.start_date | $scope.tournament.start_date > $scope.event.end_date) {
			alert("Tournament start date cant be after or before the event");
			return;
		}

		// Validate deadline with respect to tournament start date and event end date
		if ($scope.tournament.start_date <= $scope.tournament.deadline | $scope.tournament.deadline > $scope.event.end_date | $scope.tournament.deadline <= $scope.event.start_date) {
			alert("Tournament check in deadline cant be after the event end date or before the tournament start date or end date");
			return;
		}

		if ($scope.tournament.teams) {
			// Illegal team size
			if ($scope.tournament.team_size <= 1) {
				alert("Theres no I or 0 or negativity in team");
				return;
			}
		} else {
			// If team is false init to 0
			$scope.tournament.team_size = 0;
		}

		// Validate Tournament Type
		if ($scope.tournament.type == 'Two Stage') {
			// Validate group stuff
			if (!$scope.tournament.group_players || !$scope.tournament.group_winners) {
				alert("Specify competitors per group and competitors advancing");
				return;
			}
			// Check if number of winners per group makes sense with respect
			// to number of players per group
			if (parseInt($scope.tournament.group_players) < parseInt($scope.tournament.group_winners)) {
				alert("Competitors can not be larger than participants per group");
				return;
			}
			if (parseInt($scope.tournament.capacity) < parseInt($scope.tournament.group_players)) {
				alert("Capacity can not be less than the number of players per group");
				return;
			}
		} else {
			// Init group stuff to zero if two stage is no selected
			$scope.tournament.group_players = 0;
			$scope.tournament.group_winners = 0;
		}

		// Validate tournament format
		if (!$scope.tournament.format) {
			alert("Please select tournament format");
			return;
		}

		// Initialize scoring to a readable format for the server
		if ($scope.tournament.scoring)
			$scope.tournament.scoring = "Points";
		else
			$scope.tournament.scoring = "Match";

		// Check if event is online to default location and venue to online
		if ($scope.event.is_online)
			$scope.event.location = $scope.event.venue = "Online";

		// Format event stuff
		$scope.event.banner = "http://neptunolabs.com/images/ckmagic.jpg";
		$scope.event.logo = "http://neptunolabs.com/images/matchup-logo.png";

		// Tournament object
		var tournament = {
			"name" : $scope.tournament.name,
			"game" : $scope.tournament.game,
			"rules" : $scope.tournament.rules,
			"teams" : $scope.tournament.teams,
			"team_size" : $scope.tournament.team_size,
			"start_date" : $scope.tournament.start_date,
			"deadline" : $scope.tournament.deadline,
			"fee" : 0,
			"capacity" : parseInt($scope.tournament.capacity),
			"seed_money" : 0,
			"type" : $scope.tournament.type,
			"format" : $scope.tournament.format,
			"scoring" : $scope.tournament.scoring,
			"group_players" : parseInt($scope.tournament.group_players),
			"group_winners" : parseInt($scope.tournament.group_winners),
		};

		// Create Event if user is hosting the event by calling a post
		// to the url describe in the controller definition
		if ($scope.userOrganization[0] == $scope.host) {
			$scope.event.deduction_fee = 0;
			var tournamentArray = [];
			tournamentArray.push(tournament);
			var request = {
				"event" : $scope.event,
				"tournament" : tournamentArray
			};
			console.log(request);
			$http.post($rootScope.baseURL + "/matchup/events", request).success(function(data) {
				$scope.goToEvent(data.name, data.start_date, data.location);
			}).error(function(err) {
				console.log(err);
			});
		}
		// Go to organizer page if an organization is hosting
		else {
			// Set premium tournament values
			tournament.fee = parseFloat($scope.tournament.fee);
			tournament.seed_money = parseFloat($scope.tournament.seed_money);
			$scope.tournaments.push(tournament);
			$('#tab2').tab('show');
			clearTournamentPage();
		}
	};

	// Cancel Tournament, go to organizer or general info page depending
	// if an organization is selected
	$scope.cancelTournament = function() {
		// Go to event details if user is hosting the event
		if ($scope.userOrganization[0] == $scope.host) {
			$('#tab1').tab('show');
		}
		// Go to organizer page if an organization is hosting
		else {
			//clearTournamentPage();
			$('#tab2').tab('show');
		}

	};

	// Transition function
	$scope.addTournament = function() {
		$('#tab3').tab('show');
	};

	// Splice selected tournament from the tournament array
	$scope.deleteTournament = function(index) {
		$scope.tournaments.splice(index, 1);
	};

	// Transition function
	$scope.backToEvent = function() {
		$('#tab1').tab('show');
	};

	// Function to create a hosted event
	$scope.createHostedEvent = function() {
		// Proceed if theres tournaments and fees created
		if ($scope.tournaments.length == 0 || $scope.fees.length == 0) {
			alert("An event cant be createad without at least one tournament and one spectator fee");
			return;
		}
		// Check null value
		if (!$scope.event.deduction_fee) {
			alert("Please specify a spectator deduction fee");
			return;
		}

		var selectedSponsors = [];

		var request = {};

		// Iterate through the sponsor check box to add them to the
		// selectedSponsors array
		for (var i = 0; i < $scope.sponsors.length; i++)
		// if checked add them to the array
			if ($scope.sponsors[i].checked)
				selectedSponsors.push($scope.sponsors[i]);
		// No sponsor selected, create request without sponsor
		if (selectedSponsors.length == 0) {
			request.event = $scope.event;
			request.tournament = $scope.tournaments;
			request.fees = $scope.fees;
			request.host = $scope.host;
			request.sponsors = [];
			console.log(request);
			$http.post($rootScope.baseURL + "/matchup/events?hosted=true", request).success(function(data) {
				$scope.goToEvent(data.name, data.start_date, data.location);
			}).error(function(err) {
				console.log(err);
			});
		}
		// Add sponsor to request
		else
			request = [$scope.event, $scope.tournaments, $scope.fees, selectedSponsors, {
				"host" : $scope.host
			}];
	};

	// Clears tournament inputs
	var clearTournamentPage = function() {
		$scope.tournament.name = $scope.tournament.start_date = $scope.tournament.deadline = $scope.tournament.rules = $scope.tournament.fee = $scope.tournament.seed_money = $scope.tournament.deduction_fee = $scope.tournament.capacity = $scope.tournament.team_size = $scope.tournament.group_players = $scope.tournament.group_winners = $scope.tournament.scoring = $scope.tournament.game = "";

	}
});

/*
 *	Handles input fields of the create team form.
 *	templateUrl: "team/create_team.html"
 *	url (POST): http://matchup.neptunolabs.com/matchup/teams
 */
myApp.controller("CreateTeamController", function($scope) {

	$scope.submitCreateTeam = function(valid) {
		if (valid) {
			console.log($scope.team)
		}
	}
});

/*
 *	Request organization controller
 *	templateUrl: "organization/request_organization.html",
 *	URL (POST): http://matchup.neptunolabs.com/matchup/organizations
 */
myApp.controller("RequestOrganizationController", function($scope, $window, $http, $rootScope, $state) {

	$scope.submitOrganization = function(valid) {
		if (valid) {
			//Organization objects
			$http.post($rootScope.baseURL + "/matchup/organizations", $scope.organization).success(function() {
				alert("Request for an organization successful");
				$state.go("app.userProfile", {
					"username" : $window.sessionStorage.username
				});
			});
		};
	};
});

/*
 *
 */
myApp.controller("editOrganizationController", function($scope, $window, $stateParams, $http, $rootScope, $state) {
	// Check if data service is empty
	$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName).success(function(data) {
		$scope.organization = data;
	});

	$scope.file_changed = function(element) {

		var photofile = element.files[0];
		var reader = new FileReader();
		// Function fire everytime the file changes
		reader.onload = function(e) {
			var fd = new FormData();
			fd.append("image", e.target.result.split(",")[1]);
			fd.append("key", $rootScope.imgurKey);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "http://api.imgur.com/2/upload.json");
			xhr.onload = function() {
				// Apply changes to scope. Not a angular function it is needed
				$scope.$apply(function() {
					var link = JSON.parse(xhr.responseText).upload.links.original;
					//Check which image was changed
					if (element.id == "cover")
						$scope.organization.organization_cover_photo = link;
					else
						$scope.organization.organization_logo = link;
				});
			};
			xhr.send(fd);

		};
		reader.readAsDataURL(photofile);
	};

	$scope.submitEditOrganization = function(valid) {
		var organization = {
			"cover" : $scope.organization.organization_cover_photo,
			"bio" : $scope.organization.organization_bio,
			"logo" : $scope.organization.organization_logo,

		};

		$http.put($rootScope.baseURL + "/matchup/organizations/" + $scope.organization.organization_name, organization).success(function() {
			alert("Edit successful");
		});
	};
});

/*
 *	Get a list of tournaments of the event
 *	templateUrl: "organizer/tournament_list.html"
 *	URL (PUT): http://matchup.neptunolabs.com/matchup/teams/{{team}}
 *	URL (DELETE) http://matchup.neptunolabs.com/matchup/events/{{event}}/tournaments/{{tournament}}?date={{date}}&location={{location}}
 */
myApp.controller("editTournamentController", function($scope) {

	// Miscellaneous information for static data
	var d = new Date();
	var start_date = new Date(d);
	start_date.setDate(d.getDate() + 1);
	var deadline = new Date(start_date);
	deadline.setDate(start_date.getHours() - 1);

	// Init tournament type object for the dropdown
	$scope.tournamentType = [{
		name : 'Single Stage',
	}, {
		name : 'Two Stage',
	}];

	// Init tournament format (Single Stage) object for the dropdown
	$scope.tournamentFormat = [{
		name : 'Single Elimination',
	}, {
		name : 'Double Elimination',
	}, {
		name : 'Round Robin',
	}];

	// Init tournament format (Two Stage) object for the dropdown
	// As we can see, we limit the selection to Single and Dobule
	// elimantion because round robing is not supported as a final
	// stage
	$scope.tournamentFormatTwo = [{
		name : 'Single Elimination',
	}, {
		name : 'Double Elimination',
	}];

	//Get all tournaments of the selected event
	var tournament = {
		"name" : "Tourney 1",
		"game" : "Mario",
		"rules" : "There are no rules right now",
		"teams" : false,
		"team_size" : 0,
		"start_date" : start_date,
		"deadline" : deadline,
		"fee" : 22.50,
		"deduction_fee" : 8,
		"capacity" : 50,
		"seed_money" : 100.00,
		"type" : "Two Stage",
		"format" : "Single Elimination",
		"scoring" : "Match",
		"group_players" : 4,
		"group_winners" : 2,
	};

	// Array for persiting tournaments
	$scope.tournaments = [];
	$scope.tournaments.push(tournament);
	$scope.tournamentIndex = 0;

	// Transition function to the tournament form
	$scope.addTournament = function() {
		$("#edit-tab2").tab("show");
	}
	// Transition function to tournament list view
	$scope.cancel = function() {
		$("#edit-tournament-tab1").tab("show");
	}
	//
	$scope.createTournament = function() {
		$("#edit-tournament-tab1").tab("show");
	}
	// Save index of tournament to be deleted
	// and show the modal
	$scope.deleteTournament = function(index) {
		$scope.tournamentIndex = index;
		$('#deleteModal').modal("show");
	}
	// Populate tournament edit form and transition to the page
	$scope.editTournament = function(index) {
		$scope.tournament = $scope.tournaments[index];
		$("#edit-tab2").tab("show");
	}
	// Delete tournament
	$scope.delete = function() {
		$scope.tournaments.splice($scope.tournamentIndex, 1);
		$('#deleteModal').modal("hide");
	}
});
