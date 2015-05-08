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

	// Init stuff
	$scope.games = [];
	// FUCK ACUTE
	$scope.tournament = {};
	$scope.tournament.game = "";

	//Get the organization the customer belongs to
	$http.get($rootScope.baseURL + '/matchup/profile/' + localStorage.getItem("username") + '/organizations').success(function(data) {

		$scope.userOrganization = [];
		$scope.userOrganization.push(localStorage.getItem("username"));
		for (var i = 0; i < data.length; i++) {
			$scope.userOrganization.push(data[i].organization_name);
		}
		$scope.host = $scope.userOrganization[0];
	}).error(function(data, status) {
		console.log(status);
	});

	// Get games for dropdown
	$http.get($rootScope.baseURL + '/matchup/popular/games').success(function(data) {
		$scope.games = data;
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
		if ((!$scope.event.location || !$scope.event.venue) && !$scope.event.is_online) {
			alert("Please fill out event location and venue")
			return;
		}

		if (!$scope.event.banner)
			$scope.event.banner = "http://neptunolabs.com/images/ckmagic.jpg";
		if (!$scope.event.logo)
			$scope.event.logo = "http://neptunolabs.com/images/matchup-logo.png";

		// Data was validated

		// Go to user create tournament if the event is hosted by the user
		if ($scope.userOrganization[0] == $scope.host) {
			$('#tab3').tab('show');
		}
		// Go to organizer page
		else {

			// Retrieve sponsors of the organization
			$http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.host + '/sponsors').success(function(data) {
				$scope.sponsors = data;
			}).error(function(data, status) {
				console.log(status);
			});
			$('#tab2').tab('show');
		}
	};

	// Creates a fee and clears input in addFeeModal
	$scope.createFee = function() {
		if (!$scope.fee.name || !$scope.fee.available || !$scope.fee.amount || !$scope.fee.description) {
			alert("Please fill out all fields");
			return;
		}
		for (var i = 0; i < $scope.fees; i++) {
			if ($scope.fees[i].name == $scope.fee.name) {
				alert("Fee name can not be repeated");
				return;
			}
		}
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
			if (!$scope.tournament.name | !$scope.tournament.deadline | !$scope.tournament.rules | !$scope.tournament.start_date | !$scope.tournament.capacity | !$scope.tournament.game) {
				alert("Please fill out the general info section");
				return;
			}
			if (parseInt($scope.tournament.capacity) > 32) {
				alert("Regular events have a limit of 32 competitors");
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
			alert("Tournament check in deadline can not be before the tournament start date or the event start date.");
			return;
		}

		if ($scope.tournament.teams) {
			// Illegal team size
			if ($scope.tournament.team_size <= 1 || isNaN($scope.tournament.team_size)) {
				alert("Theres no I or 0 or negativity in team");
				return;
			}
		} else {
			// If team is false init to 1
			$scope.tournament.team_size = 1;
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

		// Tournament object
		// Some values are to default. This values are later change if the tournament is hosted or regular
		var tournament = {
			"name" : $scope.tournament.name,
			"game" : $scope.tournament.game.game_name,
			"rules" : $scope.tournament.rules,
			"teams" : $scope.tournament.team_size,
			"start_date" : $scope.tournament.start_date,
			"deadline" : $scope.tournament.deadline,
			"prize_distribution" : "None",
			"fee" : 0,
			"capacity" : parseInt($scope.tournament.capacity),
			"seed_money" : 0,
			"type" : $scope.tournament.type,
			"format" : $scope.tournament.format,
			"scoring" : $scope.tournament.scoring,
			"group_players" : parseInt($scope.tournament.group_players),
			"group_winners" : parseInt($scope.tournament.group_winners),
		};

		console.log($scope.tournament);

		// Create Event if user is hosting the event by calling a post
		// to the url describe in the controller definition
		if ($scope.userOrganization[0] == $scope.host) {
			// Configuring some
			$scope.event.deduction_fee = 0;
			var tournamentArray = [];
			tournamentArray.push(tournament);
			if ($scope.event.is_online) {
				$scope.event.location = "Online";
				$scope.event.venue = "Online";
			}
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
			tournament.prize_distribution = $scope.tournament.prize_distribution;
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
		if (!isNaN($scope.event.deduction_fee) && parseFloat($scope.event.deduction_fee) <= 0 && parseFloat($scope.event.deduction_fee) >= 100) {
			alert("Please specify a spectator deduction fee");
			return;
		}

		$scope.event.deduction_fee = parseFloat($scope.event.deduction_fee);

		var selectedSponsors = [];

		// Iterate through the sponsor check box to add them to the
		// selectedSponsors array
		for (var i = 0; i < $scope.sponsors.length; i++)
		// if checked add them to the array
			if ($scope.sponsors[i].checked)
				selectedSponsors.push($scope.sponsors[i].sponsor_name);

		var request = {};

		if ($scope.event.is_online) {
			$scope.event.location = "Online";
			$scope.event.venue = "Online";
		}

		request.event = $scope.event;
		request.tournament = $scope.tournaments;
		request.fees = $scope.fees;
		request.host = $scope.host;
		request.sponsors = selectedSponsors;

		console.log(request);

		$http.post($rootScope.baseURL + "/matchup/events?hosted=true", request).success(function(data) {
			$scope.goToEvent(data.name, data.start_date, data.location);
		}).error(function(err) {
			console.log(err);
		});

	};

	// Clears tournament inputs
	var clearTournamentPage = function() {
		$scope.tournament.name = $scope.tournament.start_date = $scope.tournament.deadline = $scope.tournament.rules = $scope.tournament.fee = $scope.tournament.seed_money = $scope.tournament.deduction_fee = $scope.tournament.capacity = $scope.tournament.team_size = $scope.tournament.group_players = $scope.tournament.group_winners = $scope.tournament.scoring = "";

	};
	// Image upload
	$scope.file_changed = function(element) {

		var photofile = element.files[0];
		var reader = new FileReader();
		// Function fire everytime the file changes
		reader.onload = function(e) {
			var fd = new FormData();
			fd.append("image", e.target.result.split(",")[1]);
			fd.append("key", $rootScope.imgurKey);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://api.imgur.com/2/upload.json");
			xhr.onload = function() {
				// Apply changes to scope. Not a angular function it is needed
				$scope.$apply(function() {
					var link = JSON.parse(xhr.responseText).upload.links.original;
					//Check which image was changed
					if (element.id == "banner")
						$scope.event.banner = link;
					else
						$scope.event.logo = link;
				});
			};
			xhr.send(fd);

		};
		reader.readAsDataURL(photofile);
	};
});

/*
 * Create Meet Up Controller
 * templateUrl: "event/create_meetup.html",
 * url: "/meetup/:eventName/:eventDate/:eventLocation/create",
 * POST http://matchup.neptunolabs.com/matchup/events/event/meetups?date=2015-03-25T09:00:00.000Z&location=miradero
 */
myApp.controller("createMeetUpController", function($scope, $http, $window, $rootScope, $state, $stateParams) {
	$scope.eventName = $stateParams.eventName;
	$scope.eventDate = $stateParams.eventDate;
	$scope.eventLocation = $stateParams.eventLocation;
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '').success(function(data) {
		$scope.eventDetails = data;
		//console.log(eventDetails);

	});

	$scope.SubmitCreateMeetup = function(valid) {

		if (valid) {

			if ($scope.meetup.start_date > $stateParams.eventDate) {
				alert("A meetup cannot start after it is supposed to finish!");
				return;
			}
			if ($scope.meetup.start_date < new Date()) {
				alert("A meetup cannot occur in the past!");
				return;
			}
			if (new Date($scope.eventDetails.event_end_date) < $scope.meetup.start_date) {
				alert("A meetup cannot start after the event has ended!");
				return;
			}

			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/meetups?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, $scope.meetup).success(function(data) {
				alert("Creation of a MeetUp successful");
				$state.go("app.meetup", {
					"eventName" : data.event.name,
					"eventLocation" : data.event.location,
					"eventDate" : data.event.date,
					"meetupDate" : data.meetup.start_date,
					"meetupLocation" : data.meetup.location,
					"customerUsername" : data.meetup.creator

				});
			});
		};
	};
});

/*
 *	Handles input fields of the create team form.
 *	templateUrl: "team/create_team.html"
 *	url (POST): http://matchup.neptunolabs.com/matchup/teams
 */
myApp.controller("CreateTeamController", function($scope, $window, $rootScope, $http, $state) {

	$scope.team = {};
	$scope.validCover = true;
	$scope.file_changed = function(element) {
		console.log(element);

		var photofile = element.files[0];
		var reader = new FileReader();
		// Function fire everytime the file changes
		reader.onload = function(e) {
			var fd = new FormData();
			fd.append("image", e.target.result.split(",")[1]);
			fd.append("key", $rootScope.imgurKey);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://api.imgur.com/2/upload.json");
			xhr.onload = function() {
				// Apply changes to scope. Not a angular function it is needed
				$scope.$apply(function() {
					var link = JSON.parse(xhr.responseText).upload.links.original;
					//Check which image was changed
					if (element.id == "logo")
						$scope.team.logo = link;
					else
						$scope.team.cover = link;
				});
			};
			xhr.send(fd);

		};
		reader.readAsDataURL(photofile);
	};

	$scope.submitCreateTeam = function(valid) {
		if (angular.isUndefined($scope.team.cover)) {
			$scope.validCover = false;
			return;
		} else {
			$scope.validCover = true;
		}
		if (valid) {

			$http.post($rootScope.baseURL + '/matchup/teams', $scope.team).success(function(data, status) {

				$state.go("app.teamProfile", {
					"teamName" : data.team_name
				});

			});

		} else {
			return;
		}
	};
});

/* Manage/edit team controller:
 * Controller contains the necessary logic to manage a specific team, this includes editing general information about a team, adding/deleting members of a team,
 * making another member the captain (if and only if you are the captain) and deleting the team.
 */
myApp.controller("editTeamController", function($scope, $rootScope, $http, $state, $stateParams, $timeout) {

	$http.get($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName).success(function(data) {
		console.log(data);
		$scope.team = {
			"name" : data.team_name,
			"bio" : data.team_bio,
			"logo" : data.team_logo,
			"cover" : data.team_cover_photo,
			"team_paypal_info" : data.team_paypal_info
		};
		getMembers();
	});

	var getMembers = function() {
		//get all users that belong to an organization
		$http.get($rootScope.baseURL + '/matchup/teams/' + $scope.team.name + '/members').success(function(data) {
			$scope.members = data;
			$scope.membersList = [];
			$scope.currentUser = {};
			$scope.currentUser.customer_username = $scope.me;
			$scope.currentUser.is_captain = false;
			$scope.currentUser.is_member = false;

			angular.forEach($scope.members, function(member) {
				$scope.membersList.push(member.customer_username);
				if ($scope.currentUser.customer_username == member.customer_username) {
					$scope.currentUser.is_member = true;
					if (member.is_captain) {
						$scope.currentUser.is_captain = true;
					}
				}
			});

		});
	};

	$scope.filterArray = function(user) {
		return ($scope.membersList.indexOf(user.customer_username) == -1);
	};

	$scope.validCover = true;
	$scope.file_changed = function(element) {

		var photofile = element.files[0];
		var reader = new FileReader();
		// Function fire everytime the file changes
		reader.onload = function(e) {
			var fd = new FormData();
			fd.append("image", e.target.result.split(",")[1]);
			fd.append("key", $rootScope.imgurKey);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://api.imgur.com/2/upload.json");
			xhr.onload = function() {
				// Apply changes to scope. Not a angular function it is needed
				$scope.$apply(function() {
					var link = JSON.parse(xhr.responseText).upload.links.original;
					//Check which image was changed
					if (element.id == "logo")
						$scope.team.logo = link;
					else
						$scope.team.cover = link;
				});
			};
			xhr.send(fd);

		};
		reader.readAsDataURL(photofile);
	};

	$scope.submitEditTeam = function(valid) {
		if (angular.isUndefined($scope.team.cover)) {
			$scope.validCover = false;
			return;
		} else {
			$scope.validCover = true;
			$http.put($rootScope.baseURL + '/matchup/teams/' + $scope.team.name, $scope.team).success(function(data, status) {
				$state.go("app.teamProfile", {
					"teamName" : $scope.team.name
				});

			});
		}

	};

	$scope.deleteTeam = function() {
		$http.delete($rootScope.baseURL + '/matchup/teams/' + $scope.team.name).success(function(data, status) {
			$('#deleteTeamModal').modal('hide');
			$timeout(function() {
				$state.go("app.userTeams", {
					username : $scope.me
				});
			}, 300);
		});
	};

	$scope.addMember = function(user) {

		$http.post($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName + '/members?username=' + user.customer_username + '').success(function(data, status) {
			$scope.lastUserAdded = user;
			$scope.membersList.push(user.customer_username);
			$scope.members.push(user);
			$('#addTeammateModal').modal('hide');
			$('#teammateAddSuccesModal').modal('show');

		});

	};

	$scope.deleteUserPrompt = function(user) {
		$('#deleteTeammateModal').modal('show');
		$scope.deleteTeammate = user;
	};

	$scope.removeMember = function() {

		$http.delete($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName + '/members?username=' + $scope.deleteTeammate.customer_username + '').success(function(data, status) {

			$('#deleteTeammateModal').modal('hide');

			$scope.membersList.splice($scope.membersList.indexOf($scope.deleteTeammate), 1);
			$scope.members.splice($scope.members.indexOf($scope.deleteTeammate), 1);

			if ($scope.deleteTeammate.customer_username == $scope.me) {
				$timeout(function() {
					$state.go("app.teamProfile", {
						teamName : $stateParams.teamName
					});
				}, 300);
			} else
				$('#teammateDeleteSuccesModal').modal('show');
		});

	};

	$scope.makeUserCaptainPrompt = function(user) {
		$('#makeCaptainModal').modal('show');
		$scope.captainTeammate = user;
	};

	$scope.makeMemberCaptain = function() {
		$http.put($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName + '/members?username=' + $scope.captainTeammate.customer_username + '').success(function(data, status) {
			getMembers();
			$('#makeCaptainModal').modal('hide');
			$('#makeCaptainSuccesModal').modal('show');

		});

	};

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
				$state.go("app.userOrganizations", {
					"username" : $scope.me
				});
			});
		};
	};
});

/*
 * edit Organization Controller
 * url: "/organization/:organizationName/edit",
 * templateUrl: "organization/edit_organization.html",
 * Editing bio, logo and cover photo to an organization.
 */
myApp.controller("editOrganizationController", function($scope, $window, $stateParams, $http, $rootScope, $state, $timeout) {

	// Get organization details
	$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName).success(function(data) {
		$scope.organization = data;

		// Get Members
		$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/members').success(function(data, status) {
			$scope.members = data;
			$scope.membersList = [];

			$scope.currentUser = {};
			$scope.currentUser.customer_username = $scope.me;
			$scope.currentUser.is_owner = false;
			$scope.currentUser.is_member = $scope.organization.is_member;

			// Check if current user is owner
			angular.forEach($scope.members, function(member) {
				$scope.membersList.push(member.customer_username);
				if ($scope.currentUser.customer_username == member.customer_username) {
					if (member.is_owner) {
						$scope.currentUser.is_owner = true;
					}
				}
			});
		});

		$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/sponsors').success(function(data) {
			$scope.sponsors = data;
			console.log(data);
		});

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
			xhr.open("POST", "https://api.imgur.com/2/upload.json");
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
			"organization_paypal_info" : $scope.organization.organization_paypal_info,

		};

		$http.put($rootScope.baseURL + "/matchup/organizations/" + $scope.organization.organization_name, organization).success(function() {
			$state.go('app.organizationProfile', {
				organizationName : $scope.organization.organization_name
			});
		});
	};

	$scope.deleteOrganization = function() {
		$http.delete($rootScope.baseURL + '/matchup/organizations/' + $scope.organization.organization_name).success(function(data, status) {
			$state.go("app.home");
		});
	};

	$scope.filterArray = function(user) {
		return ($scope.membersList.indexOf(user.customer_username) == -1);
	};

	$scope.addOwner = false;

	$scope.addMember = function(user) {
		$http.post($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/members?username=' + user.customer_username + '&owner=' + $scope.addOwner + '').success(function(data, status) {
			$scope.lastUserAdded = user;
			$scope.membersList.push(user.customer_username);
			user.is_owner = $scope.addOwner;
			$scope.members.unshift(user);
			$('#addMemberModal').modal('hide');
			$('#memberAddSuccesModal').modal('show');

		});
	};

	$scope.deleteUserPrompt = function(user) {
		// Chec if the user is leaving
		if (user.customer_username == $scope.me) {
			if (user.is_owner) {
				var count = 0;
				// Check if there's another member
				angular.forEach($scope.members, function(member) {
					if (member.is_owner)
						count++;
				});
				// The current user is the only member
				if (count == 1) {
					$('#alertOwnerModal').modal('show');
					return;
				}
			}
			$('#leaveModal').modal('show');
		}
		// User is deleting another member
		else
			$('#deleteMemberModal').modal('show');
		$scope.deleteMember = user;
	};

	$scope.removeMember = function() {

		$http.delete($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/members?username=' + $scope.deleteMember.customer_username + '').success(function(data, status) {
			// If current user was deleted
			if ($scope.deleteMember.customer_username == $scope.me) {
				// Redirect to organization list
				$('#leaveModal').modal('hide');
				$timeout(function() {
					$state.go("app.userOrganizations", {
						username : $scope.me
					});
				}, 300);
			} else {
				// Delete current member
				$scope.membersList.splice($scope.membersList.indexOf($scope.deleteMember), 1);

				$scope.members.splice($scope.members.indexOf($scope.deleteMember), 1);
				$('#deleteMemberModal').modal('hide');
				$('#memberDeleteSuccesModal').modal('show');
			}
		});

	};

	$scope.newOwner = {};
	$scope.makeMemberOwnerPrompt = function(user) {
		$('#addOwnerModal').modal('show');
		$scope.newOwner = user;
	};

	$scope.makeMemberOwner = function() {

		$http.post($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/members?username=' + $scope.newOwner.customer_username + '&owner=true').success(function(data, status) {
			$scope.newOwner.is_owner = true;
			$scope.lastUserAdded = $scope.newOwner;
			$scope.members[$scope.members.indexOf($scope.lastUserAdded)].is_owner = true;
			$('#addOwnerModal').modal('hide');
			$('#memberAddOwnerSuccesModal').modal('show');
			$scope.newOwner = {};

		});

	};

	$scope.deleteSponsor = {};
	$scope.deleteSponsorPrompt = function(sponsor) {
		$('#deleteSponsorModal').modal('show');
		$scope.deleteSponsor = sponsor;
	};

	$scope.removeSponsor = function() {
		console.log($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/sponsors?sponsor=' + $scope.deleteSponsor.sponsor_name + '');
		$http.delete($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/sponsors?sponsor=' + $scope.deleteSponsor.sponsor_name + '').success(function(data, status) {
			console.log(status);
			console.log("should remove");
			$scope.sponsors.splice($scope.sponsors.indexOf($scope.deleteSponsor), 1);
			$('#deleteSponsorModal').modal('hide');
			$scope.deleteSponsor = {};

		});

	};
});

/*
 *	Get a list of tournaments of the event
 *	templateUrl: "organizer/tournament_list.html"
 *	URL (PUT): http://matchup.neptunolabs.com/matchup/teams/{{team}}
 *	URL (DELETE) http://matchup.neptunolabs.com/matchup/events/{{event}}/tournaments/{{tournament}}?date={{date}}&location={{location}}
 */
myApp.controller("editHostedTournamentListController", function($scope, $http, $window, $rootScope, $state, $stateParams) {
	// Init stuff
	$scope.games = [];
	// FUCK ACUTE
	$scope.newTournament = {};
	$scope.newTournament.game = "";

	$scope.type = $stateParams.manage == 'edit';

	// Get games for dropdown
	$http.get($rootScope.baseURL + '/matchup/popular/games').success(function(data) {
		$scope.games = data;
	}).error(function(data, status) {
		console.log(status);
	});

	// Miscellaneous information for static data
	var d = new Date();
	var start_date = new Date(d);
	start_date.setDate(d.getDate() + 1);
	var deadline = new Date(start_date);
	deadline.setDate(start_date.getHours() - 1);

	// Init tournament type object for the dropdown
	$scope.tournamentType = ["Single Stage", "Two Stage"];

	// Init tournament format (Single Stage) object for the dropdown
	$scope.tournamentFormat = ["Single Elimination", "Double Elimination", "Round Robin"];

	// Init tournament format (Two Stage) object for the dropdown
	// As we can see, we limit the selection to Single and Dobule
	// elimantion because round robing is not supported as a final
	// stage
	$scope.tournamentFormatTwo = ["Single Elimination", "Double Elimination"];

	//get event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data, status) {
		$scope.eventInfo = data;

	});

	//get all tournaments for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
		console.log("Event Tournaments");
		console.log(data);
		$scope.tournaments = data;

	}).error(function(err) {
		console.log(err);
	});

	// Array for persiting tournaments

	$scope.tournamentIndex = 0;

	// Transition function to the tournament form
	$scope.addTournament = function() {
		$("#edit-tab2").tab("show");
	};
	// Transition function to tournament list view
	$scope.cancel = function() {
		$("#edit-tournament-tab1").tab("show");
	};
	//
	$scope.createTournament = function() {

		// Check for blank inputs

		if (!$scope.newTournament.tournament_name | !$scope.newTournament.deadline | !$scope.newTournament.rules | !$scope.newTournament.start_date | !$scope.newTournament.competitor_fee | !$scope.newTournament.seed_money | !$scope.newTournament.tournament_max_capacity) {
			alert("Please fill out the general info section");
			console.log(!$scope.newTournament.tournament_name, !$scope.newTournament.deadline, !$scope.newTournament.rules, !$scope.newTournament.start_date, !$scope.newTournament.competitor_fee, !$scope.newTournament.seed_money, !$scope.newTournament.tournament_max_capacity);

			return;
		}

		//	Validate start date with respect to event dates
		if ($scope.newTournament.start_date < $scope.eventInfo.start_date | $scope.newTournament.start_date > $scope.eventInfo.end_date) {
			alert("Tournament start date cant be after or before the event");
			return;
		}

		// Validate deadline with respect to tournament start date and event end date
		if ($scope.newTournament.start_date <= $scope.newTournament.deadline | $scope.newTournament.deadline > $scope.eventInfo.end_date | $scope.newTournament.deadline <= $scope.eventInfo.start_date) {
			alert("Tournament check in deadline cant be after the event end date or before the tournament start date or end date");
			return;
		}

		if ($scope.newTournament.teams) {
			// Illegal team size
			if ($scope.newTournament.team_size <= 1) {
				alert("Theres no I or 0 or negativity in team");
				return;
			}
		} else {
			// If team is false init to 0
			$scope.newTournament.team_size = 1;
		}

		// Validate Tournament Type
		if ($scope.newTournament.tournament_type == 'Two Stage') {
			// Validate group stuff
			if (!$scope.newTournament.group_players || !$scope.newTournament.group_winners) {
				alert("Specify competitors per group and competitors advancing");
				return;
			}
			// Check if number of winners per group makes sense with respect
			// to number of players per group
			if (parseInt($scope.newTournament.group_players) < parseInt($scope.newTournament.group_winners)) {
				alert("Competitors can not be larger than participants per group");
				return;
			}
			if (parseInt($scope.newTournament.capacity) < parseInt($scope.newTournament.group_players)) {
				alert("Capacity can not be less than the number of players per group");
				return;
			}
		} else {
			// Init group stuff to zero if two stage is no selected
			$scope.newTournament.group_players = 0;
			$scope.newTournament.group_winners = 0;
		}

		// Validate tournament format
		if (!$scope.newTournament.tournament_format) {
			alert("Please select tournament format");
			return;
		}

		// Initialize scoring to a readable format for the server
		if ($scope.newTournament.scoring)
			$scope.newTournament.scoring = "Points";
		else
			$scope.newTournament.scoring = "Match";

		// Tournament object
		var tournament = {
			"name" : $scope.newTournament.tournament_name,
			"game" : $scope.newTournament.game.game_name,
			"rules" : $scope.newTournament.rules,
			"teams" : $scope.newTournament.team_size,
			"start_date" : $scope.newTournament.start_date,
			"deadline" : $scope.newTournament.deadline,
			"fee" : parseFloat($scope.newTournament.competitor_fee),
			"capacity" : parseInt($scope.newTournament.tournament_max_capacity),
			"seed_money" : parseFloat($scope.newTournament.seed_money),
			"type" : $scope.newTournament.tournament_type,
			"format" : $scope.newTournament.tournament_format,
			"scoring" : $scope.newTournament.scoring,
			"group_players" : parseInt($scope.newTournament.group_players),
			"group_winners" : parseInt($scope.newTournament.group_winners),
			"prize_distribution" : $scope.newTournament.prize_distribution
		};
		console.log(tournament);

		console.log($scope.newTournament);

		//ON SUCCES PUSH TO THE ARRAY THAT IS SHOWING THE TOURNAMEBTS
		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, tournament).success(function(data) {
			//TODO for some reason when I push it's not showing upcorrectly in the list. I need to check if i'm sending the parameters incorrectly or something.
			$scope.tournaments.push({
				"tournament_name" : $scope.newTournament.tournament_name,
				"game_name" : $scope.newTournament.game.game_name,
				"tournament_rules" : $scope.newTournament.rules,
				"team_size" : $scope.newTournament.team_size,
				"tournament_start_date" : $scope.newTournament.start_date,
				"tournament_check_in_deadline" : $scope.newTournament.deadline,
				"competitor_fee" : parseFloat($scope.newTournament.competitor_fee),
				"tournament_max_capacity" : parseInt($scope.newTournament.tournament_max_capacity),
				"seed_money" : parseFloat($scope.newTournament.seed_money),
				"tournament_type" : $scope.newTournament.tournament_type,
				"tournament_format" : $scope.newTournament.tournament_format,
				"number_of_people_per_group" : parseInt($scope.newTournament.group_players),
				"amount_of_winners_per_group" : parseInt($scope.newTournament.group_winners),
				"prize_distribution_name" : $scope.newTournament.prize_distribution
			});

		}).error(function(err) {
			console.log(err);
		}).finally(function() {

			clearTournamentPage();
			$("#edit-tournament-tab1").tab("show");
		});

	};
	// Clears tournament inputs
	var clearTournamentPage = function() {
		$scope.newTournament.tournament_name = $scope.newTournament.start_date = $scope.newTournament.deadline = $scope.newTournament.rules = $scope.newTournament.competitor_fee = $scope.newTournament.seed_money = $scope.newTournament.deduction_fee = $scope.newTournament.tournament_max_capacity = $scope.newTournament.team_size = $scope.newTournament.group_players = $scope.newTournament.group_winners = $scope.newTournament.scoring = $scope.newTournament.game_name = "";

	};
	// Save index of tournament to be deleted
	// and show the modal
	$scope.deleteTournament = function(index) {
		$scope.tournamentIndex = index;

		$('#deleteModal').modal("show");
	};
	// Delete tournament
	$scope.delete = function() {
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.tournamentIndex].tournament_name + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
			$scope.tournaments.splice($scope.tournamentIndex, 1);
			$('#deleteModal').modal("hide");
		}).error(function(err) {
			console.log(err);
		});

	};
});

myApp.controller("editMeetUpController", function($scope, $http, $window, $rootScope, $state, $stateParams) {
	console.log("fixed");

	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/meetups/' + $stateParams.customerUsername + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&meetup_date=' + $stateParams.meetupDate + '&meetup_location=' + $stateParams.meetupLocation).success(function(data, status, headers) {
		$scope.meetup = data;
		$scope.meetup.meetup_end_date = new Date($scope.meetup.meetup_end_date);
		$scope.meetup.meetup_start_date = new Date($scope.meetup.meetup_start_date);
		console.log(data);
		$scope.meetup.customer_username = $stateParams.customerUsername;
	});

	$http.get($rootScope.baseURL + '/matchup/profile').success(function(data, status, headers) {
		$scope.currentUser = data;
	});

	$scope.submitEditmeetup = function(valid) {

		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/meetups/' + $stateParams.customerUsername + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&meetup_date=' + $stateParams.meetupDate + '&meetup_location=' + $stateParams.meetupLocation, {
			"location" : $scope.meetup.meetup_location,
			"name" : $scope.meetup.meetup_name,
			"start_date" : $scope.meetup.meetup_start_date,
			"end_date" : $scope.meetup.meetup_end_date,
			"description" : $scope.meetup.meetup_description

		}).success(function(data, status, headers) {
			alert("Editing of a MeetUp successful");
			$state.go("app.meetup", {
				"eventName" : $stateParams.eventName,
				"eventDate" : $stateParams.eventDate,
				"eventLocation" : $stateParams.eventLocation,
				"meetupDate" : $scope.meetup.meetup_start_date.toJSON(),
				"meetupLocation" : $scope.meetup.meetup_location,
				"customerUsername" : $stateParams.customerUsername,
			});
		});
	};
});
