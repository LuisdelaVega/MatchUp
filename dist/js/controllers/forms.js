var myApp = angular.module('forms', []);

myApp.controller("CreateEventController", function ($scope) {

	// Username
	$scope.userTag = [{
		name: 'Tag',
				}];

	// Organization that the user belongs to
	$scope.userOrganization = [{
		name: 'EsporsPR',
				}, {
		name: 'ESL One',
				}];

	// Push tag into the organization array, this will be used to init the Hosted select form
	$scope.userOrganization.unshift($scope.userTag[0]);

	// Init event type object
	$scope.eventType = [{
		name: 'Local',
				}, {
		name: 'Regional',
				}, {
		name: 'National',
				}];

	// Init tournament type object
	$scope.tournamentType = [{
		name: 'Single Stage',
				}, {
		name: 'Two Stage',
				}];

	// Init tournament format object
	$scope.tournamentFormat = [{
		name: 'Single Elimination',
				}, {
		name: 'Double Elimination',
				}, {
		name: 'Round Robin',
				}];

	// Init tournament format object
	$scope.tournamentFormatTwo = [{
		name: 'Single Elimination',
				}, {
		name: 'Double Elimination',
				}];

	$scope.tournaments = [];

	$scope.fees = [];


	$scope.validateEvent = function () {
		// Chech undefined values and valid stuff
		if (!$scope.event.name) {
			alert("Event name is required");
			return;
		}
		if (!$scope.event.start_date) {
			alert("Event start date is required");
			return;
		}
		if ($scope.event.start_date < new Date()) {
			alert("An event cant be in the past");
			return;
		}
		if ($scope.event.start_date > $scope.event.end_date || !$scope.event.end_date) {
			alert("Start date must be before end date");
			return;
		}
		if ($scope.event.start_date < $scope.event.registration_deadline || !$scope.event.registration_deadline) {
			alert("Registration deadline date must be before start date");
			return;
		}
		if ($scope.event.registration_deadline < new Date()) {
			alert("Registration deadline cant be in the past");
			return;
		}
		if (!$scope.event.is_online && (!$scope.event.location || !$scope.event.venue)) {
			/// TODO THIS LOGIC NEEDS TO TAKE INTO ACCOUNT THE UNDEFINED VALUES OF LOCATION AND VENUE
			alert("Please fill out event location and venue")
			return;
		}

		// Go to user create tournament
		if ($scope.userOrganization[0] == $scope.event.host) {
			$('#tab3').tab('show');
		}
		// Go to organizer page
		else {
			// Get sponsors of the organization
			$scope.sponsors = [{
				name: 'Intel Gaming',
				img: "https://pbs.twimg.com/profile_images/378800000857186263/xyP_oi80_400x400.jpeg"
				}, {
				name: 'Twitch',
				img: "https://pbs.twimg.com/profile_images/509073338191183872/fYdty6yd.png"
				}, {
				name: 'See Puerto Rico',
				img: "http://www.visitusa.org.uk/memberassets/676/LGO-Estrella_SEE_blue-ing.jpg"
				}];
			$('#tab2').tab('show');
		}
	}

	// Creates a fee and clears input in addFeeModal
	$scope.createFee = function () {
		var fee = {
			"name": $scope.fee.name,
			// Ticket amount
			"available": $scope.fee.available,
			// Price
			"amount": $scope.fee.amount,
			"description": $scope.fee.description,
		}

		$scope.fees.push(fee);
		$("#addFeeModal").modal("hide");
		$scope.fee.name = $scope.fee.amount = $scope.fee.available = $scope.fee.description = "";
	}

	$scope.deleteFee = function (index) {
		$scope.fees.splice(index, 1);
	}

	$scope.validateTournament = function () {

		// Check for blank inputs
		if (!$scope.tournament.name | !$scope.tournament.deadline | !$scope.tournament.rules | !$scope.tournament.start_date | !$scope.tournament.fee | !$scope.tournament.seed_money | !$scope.tournament.deduction_fee | !$scope.tournament.capacity) {
			alert("Please fill out the general info section");
			return;
		}

		//		 Validate start date with respect to event
		if ($scope.tournament.start_date < $scope.event.start_date | $scope.tournament.start_date > $scope.event.end_date) {
			alert("Tournament start date cant be after or before the event");
			return;
		}

		// Validate deadline with respect to tournament start date and event end date
		if ($scope.tournament.start_date <= $scope.tournament.deadline | $scope.tournament.deadline > $scope.event.end_date | $scope.tournament.deadline <= $scope.event.start_date) {
			alert("Tournament check in deadline cant be after the event end date or before the tournament start date or end date");
			return;
		}

		// Validate Teams
		if ($scope.tournament.teams) {
			// If not null check teams value
			if ($scope.tournament.teams == 'true') {
				// Check team size null and illegal number
				if ($scope.tournament.team_size <= 1) {
					alert("Theres no I or 0 or negativity in team");
					return;
				}
			} else {
				// If team is false init to 0
				$scope.tournament.team_size = 0;
			}
		} else {
			alert("Please select team based");
			return;
		}

		// Validate Tournament Type
		if ($scope.tournament.type.name == 'Two Stage') {
			// Validate group stuff
			if (!$scope.tournament.group_players || !$scope.tournament.group_winners) {
				alert("Specify competitors per group and competitors advancing");
				return;
			}
			if (parseInt($scope.tournament.group_players) < parseInt($scope.tournament.group_winners)) {
				alert("Competitors can be larger than participants per group");
				return;
			}
		} else {
			// Init group stuff to zero in 
			$scope.tournament.group_players = 0;
			$scope.tournament.group_winners = 0;
		}

		// Validate tournament format
		if (!$scope.tournament.format) {
			alert("Please select tournament format");
			return;
		}

		if ($scope.tournament.scoring)
			$scope.tournament.scoring = "Points";
		else
			$scope.tournament.scoring = "Match";

		var tournament = {
			"name": $scope.tournament.name,
			"game": $scope.tournament.game,
			"rules": $scope.tournament.rules,
			"teams": $scope.tournament.teams,
			"team_size": $scope.tournament.team_size,
			"start_date": $scope.tournament.start_date,
			"deadline": $scope.tournament.deadline,
			"fee": $scope.tournament.fee,
			"capacity": $scope.tournament.capacity,
			"seed_money": $scope.tournament.seed_money,
			"type": $scope.tournament.type.name,
			"format": $scope.tournament.format.name,
			"scoring": $scope.tournament.scoring,
			"group_players": $scope.tournament.group_players,
			"group_winners": $scope.tournament.group_winners,
		};

		// Create Event if user is hosting the event
		if ($scope.userOrganization[0] == $scope.event.host) {
			// Check if event is online to default location and venue to online
			if ($scope.event.is_online)
				$scope.event.location = $scope.event.venue = "Online";
			var request = [$scope.event, $scope.tournament];
			alert("CONGRATULATION YOU MADE AN EVENT!");
			console.log(angular.toJson(request));
			alert(angular.toJson(request));
		}
		// Go to organizer page if an organization is hosting
		else {
			$scope.tournaments.push(tournament);
			$('#tab2').tab('show');
			clearTournamentPage();
		}
	}

	// Cancel Tournament, go to organizer or general info page depending of organization selected
	$scope.cancelTournament = function () {
		// Go to event details if user is hosting the event
		if ($scope.userOrganization[0] == $scope.event.host) {
			$('#tab1').tab('show');
		}
		// Go to organizer page if an organization is hosting
		else {
			//clearTournamentPage();
			$('#tab2').tab('show');
		}

	}

	$scope.addTournament = function () {
		$('#tab3').tab('show');
	}

	$scope.deleteTournament = function (index) {
		$scope.tournaments.splice(index, 1);
	}

	$scope.backToEvent = function () {
		$('#tab1').tab('show');
	}

	// TODO fucntion to create hosted event
	$scope.createHostedEvent = function () {
		if ($scope.tournaments.length == 0 || $scope.fees.length == 0) {
			alert("An event cant be createad without at least one tournament and one spectator fee");
			return;
		}
		if(!$scope.event.deduction_fee){
			alert("Please specify a spectator deduction fee");
			return;	
		}
		var selectedSponsors = [];
		var request = {};
		for(var i =0; i < $scope.sponsors.length; i++)
			if($scope.sponsors[i].checked)
				selectedSponsors.push($scope.sponsors[i]);
		if(selectedSponsors.length==0)
			request = [$scope.event,$scope.tournaments,$scope.fees,{"host":$scope.event.host}];
		else
			request = [$scope.event,$scope.tournaments,$scope.fees,selectedSponsors,{"host":$scope.event.host}];
		console.log(request);
	}

	// Clears tournament inputs
	var clearTournamentPage = function () {
		$scope.tournament.name = $scope.tournament.start_date = $scope.tournament.deadline = $scope.tournament.rules = $scope.tournament.fee = $scope.tournament.seed_money = $scope.tournament.deduction_fee = $scope.tournament.capacity = $scope.tournament.teams = $scope.tournament.team_size = $scope.tournament.type = $scope.tournament.group_players = $scope.tournament.group_winners = $scope.tournament.format = $scope.tournament.scoring = $scope.tournament.game = ""
	}
});