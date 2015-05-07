var myApp = angular.module('organizer', []);

/*
 * Controller for Event Settings page. This page is only available to event organizers for their events
 * Within this page you will be able to choose distinct options and settings you can change for your event and tournaments
 * This controller verifies that your have permission to access this page and determines of the event is hosted or premium
 * The number of actions available will depend if the event is premium or regular
 */
myApp.controller('eventSettingsController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {
	$q.all([
	// Get Event Info
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + ''),
	// Tournaments
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation)]).then(function (results) {

		// Get Events
		$scope.event = results[0].data;
		// Get Tournaments
		$scope.tournamentsInfo = results[1].data;

		//check if hosted
		if ($scope.event.host == null)
			$scope.isHosted = false;
		else
			$scope.isHosted = true;

		console.log($scope.event);

		//Event is regular
		if (!$scope.isHosted)
			regularEventSettings($scope.event, $scope.tournamentsInfo);

	}, function (err) {
		console.log(err);
		console.log("Oh oh");
	});

	var hostedEventSettings = function (event, tournamentsInfo) {
		//There can be various tournaments since it is premium
		$scope.eventInfo = event;
		$scope.tournaments = tournamentsInfo[0].tournament_name;

	};
	var regularEventSettings = function (event, tournamentsInfo) {
		//There is only one tournament since it's hosted
		$scope.eventInfo = event;
		$scope.tournament = tournamentsInfo[0].tournament_name;

	};

});

/*
 * Controller is used in the events seeding page: Here event organizers can set the seeding for tournaments and create the bracket
 *
 */
myApp.controller("SeedingController", function ($scope, $http, $window, $rootScope, $state, $stateParams) {
	$scope.competitors = [];
	$scope.twoStageCheck = false;

	// Initiate Get from server and get tournaments in the event
	//get all tournaments for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.tournaments = data;

	}).error(function (err) {
		console.log(err);
	}).then(function () {
		$scope.index = 0;
		$scope.getTournament(0);
	});

	//get information about the tournament
	$scope.getTournament = function (index) {
		$scope.index = index;

		//get competitors for tournament $scope.tournaments[index].tournament_name
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/checked?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			$scope.competitors = data.competitors;

			$scope.seedingSaved = data.competitors.length > 0;

			// Check if every player has a seed
			for (var i = 0; i < data.competitors.length; i++) {
				// Seed = 0
				if (!data.competitors[i].competitor_seed)
					$scope.seedingSaved = false;
			}

			//Checking if the bracket has been created and whether the tournament is team based
			$scope.bracket = data.stages_created;
			$scope.teamBased = data.team_size > 1;

			if ($scope.tournaments[index].tournament_type == 'Two Stage') {
				var amountOfGroups = $scope.competitors.length / $scope.tournaments[index].number_of_people_per_group;
				console.log(amountOfGroups)
				var numberOfPeopleAdvancing = amountOfGroups * $scope.tournaments[index].amount_of_winners_per_group;
				console.log(numberOfPeopleAdvancing)
				$scope.twoStageCheck = (numberOfPeopleAdvancing < 4);
			} else
				$scope.twoStageCheck = false;

		}).error(function (err) {
			console.log(err);
		});

	};

	/*
	 * Function for deleting the stages, this function will delete all rounds, matches, sets, groups, and their relatiosn
	 * Only the competitors signed up will remain, currently considering if this feature should only be available to organization owners
	 *
	 * A button to call this function will only be made available if the bracket has been created
	 */

	$scope.deleteBracket = function () {
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/create?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			console.log(data);
			$scope.bracket = false;
			alert("Stages succesfully deleted for the following tournament: " + $scope.tournaments[$scope.index].tournament_name);

		}).error(function (err) {
			console.log(err);
		});
	};

	/*
	 * This function will create a bracket based on the seeding available on the database
	 * It does not save changes done to the seeding in the data base, for this an event organizer must first save the seeding
	 */
	$scope.createBracket = function () {
		//TODO call create bracket
		///* /matchup/events/:event/tournaments/:tournament/create?date=date&location=string
		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/create?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			console.log(data);
			$scope.bracket = true;
			alert("Stages succesfully created for the following tournament: " + $scope.tournaments[$scope.index].tournament_name);

		}).error(function (err) {
			console.log(err);
		});

	};

	/*
	 * This function will save the current seeding in the page
	 * it will not crate the stages
	 */
	$scope.saveSeeding = function () {

		//setting seeds locally based on order
		var seedList = $scope.competitors;
		for (var i = 0; i < seedList.length; i++) {
			seedList[i].seed = i + 1;
		}

		//Sending the local list of seeds in order to the server
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/checked?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, {
			"players": seedList
		}).success(function (data) {
			alert("Seeding succesfully updated for the following tournament: " + $scope.tournaments[$scope.index].tournament_name);
		}).error(function (err) {
			console.log(err);
		});

	};

	// Configure draggable table
	$scope.sortableOptions = {
		containment: '#sortable-container'
	};

});

/*
 * Controller for checking in users and spectators
 */
myApp.controller("RegistrationController", function ($scope, $http, $window, $rootScope, $state, $stateParams) {

	// Initiate Get from server and get tournaments in the event

	//get all SPECTATORS for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/spectators?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		console.log("Spectators");
		console.log(data);
		$scope.spectators = data;
		$scope.signups = data;
	}).error(function (err) {
		console.log(err);
	});

	//get all tournaments for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		console.log("Event Tournaments");
		console.log(data);
		$scope.tournaments = data;

		$scope.tournaments.unshift({
			"tournament_name": "Spectator"
		});

	}).error(function (err) {
		console.log(err);
	}).finally(function () {
		$scope.signups = $scope.spectators;
		$scope.index = 0;
	});

	/*
	 * This function calls the server to get all registered spectators for the event or competitors for a specific event
	 *
	 */
	$scope.getRegistrationInfo = function (index) {
			if (index == 0) {
				$scope.index = index;
				$scope.signups = $scope.spectators;

			} else {
				$scope.index = index;
				$scope.signups = [];
				//get competitors for tournament $scope.tournaments[index].tournament_name
				$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[index].tournament_name + '/competitors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
					console.log("Tournament Competitors");
					console.log(data);
					$scope.signups = data;

				}).error(function (err) {
					console.log(err);
				});

			}
		}
		//Check in competitor or spectator
	$scope.checkIn = function (item) {
		item.check_in = !item.check_in;

		if ($scope.index == 0) {
			//check or uncheck a spectator
			$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/spectators/' + item.customer_username + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {

			}).error(function (err) {
				console.log(err);
			});
		} else {
			//check or uncheck a competitor for tournament $scope.tournaments[$scope.index].tournament_name
			$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/' + item.competitor_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {

			}).error(function (err) {
				console.log(err);
			});
		}
	};

});

myApp.controller("RegistrationRegularController", function ($scope, $http, $window, $rootScope, $state, $stateParams) {

	//get tournament data to check if its team base
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.tournament = data;

	}).error(function (err) {
		console.log(err);
	});

	//get competitors for tournament
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/competitors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.signups = data;

	}).error(function (err) {
		console.log(err);
	});

	$scope.checkIn = function (item) {
		item.check_in = !item.check_in;
		//check or uncheck a competitor
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/competitors/' + item.competitor_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {

		}).error(function (err) {
			console.log(err);
		});
	};

});

myApp.controller("ReportsController", function ($scope, $http, $window, $rootScope, $state, $stateParams) {

	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/reports?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		console.log("Reports");
		console.log(data);
		$scope.reports = data;

	}).error(function (err) {
		console.log(err);
	});

	$scope.index

	$scope.reportModal = function (index) {

		$scope.index = index;

		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.reports[$scope.index].tournament_name + '/rounds/' + $scope.reports[$scope.index].round_number + '/matches/' + $scope.reports[$scope.index].match_number + '?round_of=' + $scope.reports[$scope.index].round_of + '&date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
			$scope.matchInfo = data;
			console.log(data);
		});

		$('#reportModal').modal('show');
	};

	$scope.resolve = function () {

		var tempStatus = "";
		if ($scope.reports[$scope.index].report_status == "Received")
			tempStatus = "Attending";
		else if ($scope.reports[$scope.index].report_status == "Attending")
			tempStatus = "Resolved";

		$http.put($rootScope.baseURL + '/matchup/events/' + $scope.reports[$scope.index].event_name + '/tournaments/' + $scope.reports[$scope.index].tournament_name + '/rounds/' + $scope.reports[$scope.index].round_number + '/matches/' + $scope.reports[$scope.index].match_number + '/' + $scope.reports[$scope.index].set_seq + '/' + $scope.reports[$scope.index].report_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&round_of=' + $scope.reports[$scope.index].round_of, {
			"status": tempStatus
		}).success(function (data) {
			$scope.reports[$scope.index].report_status = tempStatus;
			$('#reportModal').modal('hide');
		}).error(function (err) {
			console.log(err);
		});

	};

});

myApp.controller("StationController", function ($scope, $http, $window, $rootScope, $state, $stateParams, $rootScope) {

	$scope.stations = [];

	$scope.showEventStations = function () {

		//get all stations for this event
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			console.log("Event Stations");
			console.log(data);
			$scope.allStations = data;
			$scope.stations = data;
			$scope.index = 0;

		}).error(function (err) {
			console.log(err);
		});

	};
	$scope.showEventStations();

	//get all tournaments for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		console.log("Event Tournaments");
		console.log(data);
		$scope.tournaments = data;

		$scope.tournaments.unshift({
			"tournament_name": "All Stations"
		});

	}).error(function (err) {
		console.log(err);
	});

	// Index to show active item in list of tournament
	$scope.getTournamentStation = function (index) {
		$scope.index = index;
		if (index == 0) {
			$scope.showEventStations();
			return;
		}

		//get all stations for this tournament
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[index].tournament_name + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			console.log("Event Tournaments");
			console.log(data);
			$scope.stations = data;

		}).error(function (err) {
			console.log(err);
		});

	};

	// Edit a single station
	$scope.editStationModal = function (index) {

		// Index to save the current station selected
		$scope.stationIndex = index;
		$scope.stationInUse = [];

		//	for(j=1; j < $scope.tournaments.length-1; j++){
		var j = 1;

		angular.forEach($scope.tournaments, function (tournament) {
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + tournament.tournament_name + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
				$scope.stationsOfTournament = data;

				angular.forEach($scope.stationsOfTournament, function (tournamentStation) {
					if ($scope.stations[index].station_number == tournamentStation.station_number) {
						$scope.stationInUse.push({
							"name": tournament.tournament_name
						});
						return;
					}

				});

			}).error(function (err) {
				console.log(err);
			});

		});
		//}

		// // Get specific station information
		// $scope.stationInUse = [
		// {
		//
		// "name": "Tournament 2",
		// },
		// {
		//
		// "name": "Tournament 1",
		// }
		// ];

		$scope.newStream = $scope.stations[$scope.stationIndex].stream_link;
		$('#editStationModal').modal('show');
	};

	// Link a existing station to a tournament
	$scope.linkStation = function (index) {
		// Get all stations

		// Array to save available stations
		$scope.availableStations = [];
		// Remove stations in current tournament from the array of all stations
		for (i = 0; i < $scope.allStations.length; i++) {
			for (j = 0; j < $scope.stations.length; j++) {
				// If found jump to next station in allStations
				if ($scope.allStations[i].station_number == $scope.stations[j].station_number) {
					break;
				}
				// Not found add it to availableStations
				if (j == ($scope.stations.length - 1)) {
					$scope.availableStations.push($scope.allStations[i]);

				}
			}
		}
		if (!$scope.stations.length) {
			$scope.availableStations = $scope.allStations;
		}
		// console.log("helllolo");
		// console.log($scope.availableStations.length);
		if (!$scope.availableStations.length)
			alert("No stations available");
		else
			$('#linkStation').modal("show");
	};

	// Radio button model
	$scope.selected = {
		station: null
	};
	// Attach station to a tournament
	$scope.attatch = function () {
		if ($scope.selected.station) {
			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + angular.fromJson($scope.selected.station).station_number).success(function (data) {
				$scope.stations.push(angular.fromJson($scope.selected.station));
				$('#linkStation').modal("hide");
				$scope.selected.station = null;
			}).error(function (err) {
				console.log(err);
			});
		}
	};

	// Add a new station to the event attatch to the selected tournament
	$scope.addStation = function () {

		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			console.log(data);

			$scope.allStations.push({
				"station_number": data.number,
				"station_in_use": false,
				"stream_link": null
			});

			// //add current station to tour
			// if ($scope.index > 0) {
			// $http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + $scope.newStation.station_number).success(function(data) {
			// $scope.stations.push($scope.newStation);
			// }).error(function(err) {
			// console.log(err);
			// });
			// }

		}).error(function (err) {
			console.log(err);
		});

	};

	$scope.editStream = function () {
		// Get input value and overwrite station stream link
		console.log(!$scope.newStream);
		if (!$scope.newStream) {
			alert("Please specify a link for streaming!");
			return;
		}
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations/' + $scope.stations[$scope.stationIndex].station_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, {
			"stream": $scope.newStream
		}).success(function (data) {
			if ($scope.index > 0)
				$scope.stations[$scope.stationIndex].stream_link = $scope.newStream;
			else
				$scope.allStations[$scope.stationIndex].stream_link = $scope.newStream;

			$scope.newStream = "";
			$('#editStationModal').modal('hide');

		}).error(function (err) {
			console.log(err);
		});

	};

	$scope.addStream = function () {
		if (!$scope.newStream) {
			alert("Please specify a link for streaming!");
			return;
		}
		// Get input value and overwrite station stream link
		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations/' + $scope.stations[$scope.stationIndex].station_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, {
			"stream": $scope.newStream
		}).success(function (data) {
			if ($scope.index > 0)
				$scope.stations[$scope.stationIndex].stream_link = $scope.newStream;
			else
				$scope.allStations[$scope.stationIndex].stream_link = $scope.newStream;

			$scope.newStream = "";
			$('#editStationModal').modal('hide');

		}).error(function (err) {
			console.log(err);
		});

	};

	// Remove station from tournament
	$scope.removeStation = function () {
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + $scope.stations[$scope.stationIndex].station_number).success(function (data) {
			$scope.stations.splice($scope.stationIndex, 1);
			$('#editStationModal').modal('hide');
		}).error(function (err) {
			console.log(err);
		});
	};

	// Delete station from tournament
	$scope.deleteStation = function () {
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + $scope.allStations[$scope.stationIndex].station_number).success(function (data) {
			$scope.allStations.splice($scope.stationIndex, 1);
			$('#editStationModal').modal('hide');

		}).error(function (err) {
			console.log(err);
		});

	};
});

myApp.controller("editEventController", function ($scope, $http, $window, $rootScope, $state, $stateParams, $rootScope, $timeout) {

	//Get the event details
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.eventData = data;
		$scope.eventData.event_start_date = new Date($scope.eventData.event_start_date);
		$scope.eventData.event_end_date = new Date($scope.eventData.event_end_date);
		$scope.eventData.event_registration_deadline = new Date($scope.eventData.event_registration_deadline);

		if ($scope.eventData.host) {
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/specfees?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {

				$scope.spectatorFees = data;
				for (var i = 0; i < $scope.spectatorFees.length; i++)
					$scope.spectatorFees[i].sold = parseInt($scope.spectatorFees[i].sold);

				$scope.newFee = {};

			}).error(function (data, status) {
				console.log(status);
			});

			$http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.eventData.host + '/sponsors').success(function (data) {
				$scope.organizationSponsors = data;

				$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
					$scope.sponsorsShown = data;
					angular.forEach($scope.sponsorsShown, function (eventSponsor) {
						angular.forEach($scope.organizationSponsors, function (orgSponsor) {
							//orgSponsor.shown = false;
							if (eventSponsor.sponsor_name == orgSponsor.sponsor_name) {
								orgSponsor.shown = true;
								return;
							}
						});

					});
				}).error(function (data, status) {
					console.log(status);
				});

			}).error(function (data, status) {
				console.log(status);
			});
		}

	}).error(function (data, status) {
		console.log(status);
	});

	$scope.deleteFeeConfirmation = function (index) {
		$('#deleteModal').modal('show');
		$scope.deleteFeeIndex = index;
	};

	$scope.removeFee = function () {

		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/specfees/' + $scope.spectatorFees[$scope.deleteFeeIndex].spec_fee_name + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			if (!$scope.spectatorFees[$scope.deleteFeeIndex].sold)
				$scope.spectatorFees.splice($scope.deleteFeeIndex, 1);
			else
				$scope.spectatorFees[$scope.deleteFeeIndex].spec_fee_amount_available = $scope.spectatorFees[$scope.deleteFeeIndex].sold;
			$('#deleteModal').modal('hide');
		}).error(function (data, err) {
			console.log(err);
		});
	};

	$scope.addFee = function () {

		if (!$scope.newFee.spec_fee_name || !$scope.newFee.spec_fee_amount || !$scope.newFee.spec_fee_amount_available || !$scope.newFee.spec_fee_description) {
			alert("Please fill out all fields");
			return;
		}

		for (var i = 0; i < $scope.spectatorFees; i++) {
			if ($scope.spectatorFees[i].name == $scope.newFee.spec_fee_name) {
				alert("Fee name can not be repeated");
				return;
			}
		}

		// Create fee object to be added to the fees array
		var fee = {
			"name": $scope.newFee.spec_fee_name,
			// Ticket amount
			"available": parseInt($scope.newFee.spec_fee_amount_available),
			// Price
			"fee": parseFloat($scope.newFee.spec_fee_amount),
			"description": $scope.newFee.spec_fee_description,
		};

		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/specfees?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, fee).success(function (data) {
			$scope.newFee.sold = 0;
			$scope.spectatorFees.push($scope.newFee);
			$scope.newFee = {};
			$('#addFeeModal').modal('hide');
		}).error(function (data, err) {
			console.log(err);
		});
	};

	$scope.validCover = true;
	$scope.file_changed = function (element) {

		var photofile = element.files[0];
		var reader = new FileReader();
		// Function fire everytime the file changes
		reader.onload = function (e) {
			var fd = new FormData();
			fd.append("image", e.target.result.split(",")[1]);
			fd.append("key", $rootScope.imgurKey);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "http://api.imgur.com/2/upload.json");
			xhr.onload = function () {
				// Apply changes to scope. Not a angular function it is needed
				$scope.$apply(function () {
					var link = JSON.parse(xhr.responseText).upload.links.original;
					//Check which image was changed
					if (element.id == "logo")
						$scope.eventData.event_logo = link;
					else
						$scope.eventData.event_banner = link;
				});
			}
			xhr.send(fd);

		}
		reader.readAsDataURL(photofile);
	};

	// Validate the input fields of the General Information form
	// This will check for null values, valid dates, and
	// correct length of the strings
	$scope.validateEvent = function () {
			// Check undefined values and valid stuff
			if (!$scope.eventData.event_name) {
				alert("Event name is required");
				return;
			}
			if (!$scope.eventData.event_start_date) {
				alert("Event start date is required");
				return;
			}
			// Check if start date is in the future
			if ($scope.eventData.event_start_date < new Date()) {
				alert("An event cant be in the past");
				return;
			}
			// Valid start date and end date
			if ($scope.eventData.event_start_date > $scope.eventData.event_end_date || !$scope.eventData.event_end_date) {
				alert("Start date must be before end date");
				return;
			}
			// Check if registration deadline is before the start date
			if ($scope.eventData.event_start_date < $scope.eventData.event_registration_deadline || !$scope.eventData.event_registration_deadline) {
				alert("Registration deadline date must be before start date");
				return;
			}
			// Check if deadline is in the past
			if ($scope.eventData.event_registration_deadline < new Date()) {
				alert("Registration deadline cant be in the past");
				return;
			}
			// Prompt the user to fill location and venue if the event is not online
			if (!$scope.eventData.event_is_online && (!$scope.eventData.event_location || !$scope.eventData.event_venue)) {
				alert("Please fill out event location and venue")
				return;
			}
			if (!$scope.eventData.event_deduction_fee) {
				alert("Please specify a spectator deduction fee");
				return;
			} else {

				var updatedEvent = {
					"name": $scope.eventData.event_name,
					"start_date": $scope.eventData.event_start_date,
					"location": $scope.eventData.event_location,
					"venue": $scope.eventData.event_venue,
					"banner": $scope.eventData.event_banner,
					"logo": $scope.eventData.event_logo,
					"end_date": $scope.eventData.event_end_date,
					"registration_deadline": $scope.eventData.event_registration_deadline,
					"rules": $scope.eventData.event_rules,
					"description": $scope.eventData.event_description,
					"deduction_fee": parseFloat($scope.eventData.event_deduction_fee),
					"is_online": $scope.eventData.event_is_online,
					"type": $scope.eventData.event_type
				};

				$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, updatedEvent).success(function (data) {

					$scope.goToEvent(data.name, data.start_date, data.location);

				}).error(function (data, status) {
					console.log(status);
				});
			}
		}
		/* Validate Tournament form
		 * If the user is creating a hosted event the function will
		 * add the event to the array else it will initiate a post
		 * to the server to create the event for the current user
		 * url (POST): http://matchup.neptunolabs.com/matchup/events?hosted=bool
		 */

	$scope.editEventSponsors = function () {
		$scope.selectedSponsors = [];
		$scope.selectedSponsorsAdd = [];
		$scope.selectedSponsorsDelete = [];

		//populate the array which will contain all the sponsors which have been selected
		angular.forEach($scope.organizationSponsors, function (orgSponsor) {
			if (orgSponsor.shown)
				$scope.selectedSponsors.push(orgSponsor);
		});

		//compare if the the values that have been checked were initially there, if not they have been added
		angular.forEach($scope.selectedSponsors, function (currentlySelected) {
			angular.forEach($scope.sponsorsShown, function (initiallySelected) {
				//orgSponsor.shown = false;
				if (currentlySelected.sponsor_name == initiallySelected.sponsor_name) {
					currentlySelected.added = true;
					return;
				}
			});
			if (!currentlySelected.added) {
				$scope.selectedSponsorsAdd.push(currentlySelected);
			}
		});

		//compare if the initial value is in the selected list, if not it has been removed
		angular.forEach($scope.sponsorsShown, function (initiallySelected) {
			angular.forEach($scope.selectedSponsors, function (currentlySelected) {
				if (currentlySelected.sponsor_name == initiallySelected.sponsor_name) {
					initiallySelected.kept = true;
					return;
				}
			});
			if (!initiallySelected.kept) {
				$scope.selectedSponsorsDelete.push(initiallySelected);
			}

		});

		if ($scope.selectedSponsors.length > 0) {

			angular.forEach($scope.selectedSponsorsAdd, function (sponsor) {
				$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&sponsor=' + sponsor.sponsor_name).success(function (data) {

				}).error(function (data, status) {
					console.log(status);
				});
			});

			angular.forEach($scope.selectedSponsorsDelete, function (sponsor) {
				$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&sponsor=' + sponsor.sponsor_name).success(function (data) {

				}).error(function (data, status) {
					console.log(status);
				});
			});
		} else {
			//remove all in initial
			angular.forEach($scope.sponsorsShown, function (sponsor) {
				$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&sponsor=' + sponsor.sponsor_name).success(function (data) {

				}).error(function (data, status) {
					console.log(status);
				});
			});
		}
		$scope.goToEvent($stateParams.eventName, $stateParams.eventDate, $stateParams.eventLocation)
	};
	// Function to create a hosted event
	$scope.editHostedEvent = function () {

		// Check null value

		var selectedSponsors = [];

		var request = {};

		// Iterate through the sponsor check box to add them to the
		// selectedSponsors array
		for (var i = 0; i < $scope.sponsors.length; i++)
		// if checked add them to the array
			if ($scope.organizationSponsors[i].shown)
				selectedSponsors.push($scope.sponsors[i]);
			// No sponsor selected, create request without sponsor
		if (selectedSponsors.length == 0) {
			request.event = $scope.event;
			request.tournament = $scope.tournaments;
			request.fees = $scope.fees;
			request.host = $scope.host;
			request.sponsors = [];
			console.log(request);
			$http.post($rootScope.baseURL + "/matchup/events?hosted=true", request).success(function (data) {
				$scope.goToEvent(data.name, data.start_date, data.location);
			}).error(function (err) {
				console.log(err);
			});
		}
		// Add sponsor to request
		else
			request = [$scope.event, $scope.tournaments, $scope.fees, selectedSponsors, {
				"host": $scope.host
			}];
	}

	$scope.deleteEvent = function () {
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			$('#deleteEventModal').modal('hide');
			$timeout(function () {
				$state.go("app.myEvents", {
					"username": localStorage.getItem("username"),
				});
			}, 300);
		}).error(function (err) {
			console.log(err);
		});
	}
});

myApp.controller('editTournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$q', '$state', '$rootScope', '$filter',
function ($scope, $http, $stateParams, sharedDataService, $q, $state, $rootScope, $filter) {

		// Init stuff
		$scope.games = [];
		// FUCK ACUTE
		$scope.tournament = {};
		$scope.tournament.game = "";

		// Get tournament
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
			$scope.tournament = data;
			console.log(data);
			if ($scope.tournament.team_size == 1) {
				$scope.tournament.is_team_based = false;
			} else {
				$scope.tournament.is_team_based = true;
			}

			$scope.tournament.tournament_start_date = new Date($scope.tournament.tournament_start_date);
			$scope.tournament.tournament_check_in_deadline = new Date($scope.tournament.tournament_check_in_deadline);

			//get event
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
				$scope.event = data;
			});

			// Get games for dropdown
			$http.get($rootScope.baseURL + '/matchup/popular/games').success(function (data) {
				$scope.games = data;
				for (var i = 0; i < $scope.games.length; i++) {
					if ($scope.games[i].game_name == $scope.tournament.game_name)
						$scope.tournament.game = $scope.games[i];
				}
			}).error(function (data, status) {
				console.log(status);
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
			if (!$scope.event.host && $scope.tournament.tournament_max_capacity > 32) {
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

			if ($scope.tournament.team_size < 1) {
				alert("Theres no I or negativity in team");
				return;
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

			if (!$scope.tournament.is_team_based) {
				$scope.tournament.team_size = 1;
			}

			var tournament = {
				"name": $scope.tournament.tournament_name,
				"game": $scope.tournament.game.game_name,
				"rules": $scope.tournament.tournament_rules,
				"teams": $scope.tournament.team_size,
				"start_date": $scope.tournament.tournament_start_date,
				"deadline": $scope.tournament.tournament_check_in_deadline,
				"fee": parseFloat($scope.tournament.competitor_fee),
				"capacity": $scope.tournament.tournament_max_capacity,
				"seed_money": parseFloat($scope.tournament.seed_money),
				"type": $scope.tournament.tournament_type,
				"format": $scope.tournament.tournament_format,
				"scoring": $scope.tournament.score_type,
				"group_players": parseInt($scope.tournament.number_of_people_per_group),
				"group_winners": parseInt($scope.tournament.amount_of_winners_per_group),
				"prize_distribution": $scope.tournament.prize_distribution_name
			};
			$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, tournament).success(function (data, status) {
				$scope.goToEvent(data.event.name, data.event.start_date, data.event.location);
			});
		};

		// Cancel Tournament, go to organizer or general info page depending of organization selected
		$scope.cancelTournament = function () {

			$state.go("app.eventSettings", {
				"eventName": $scope.event.event_name,
				"eventDate": $scope.event.event_start_date,
				"eventLocation": $scope.event.event_location
			});
		};

}]);

myApp.controller("tournamentDetailsController", function ($scope, $http, $window, $rootScope, $state, $stateParams) {
	$scope.competitors = [];

	//Initializing variables for Rounds Checking
	$scope.tournament = {};
	$scope.tournament.tournament_name = $stateParams.tournamentName;
	$scope.initial = true;

	// Get Tournament Information
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.tournament = data;
	});

	$scope.init = function () {
		//Group Stage
		$scope.hasGroupStage = false;
		$scope.groupStageCompleted = true;

		//Winners Round
		$scope.winnerRoundsExist = true;
		$scope.winnerRoundsCompleted = true;

		//Losers Round
		$scope.losersRoundsExist = false;
		$scope.losersRoundsCompleted = true;

		//Variable used to check if a specific round has started
		$scope.roundStarted = true;

		//Get all rounds and matches
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
			$scope.tournamentInfo = data;
			console.log("Getting all info");
			console.log(data);

		}).then(function () {
			$scope.stagesCheck();

		});

	};

	//Function for checking if it has a group stage, afterwerd it will call the function for final stage
	$scope.stagesCheck = function () {

		if ($scope.tournamentInfo.groupStage) {
			$scope.hasGroupStage = true;

			//iterate over groups
			for (var i = 0; $scope.tournamentInfo.groupStage.groups.length > i; i++) {
				//iterate over rounds of that group
				for (var j = 0; $scope.tournamentInfo.groupStage.groups[i].rounds.length > j; j++) {
					if (!$scope.tournamentInfo.groupStage.groups[i].rounds[j].round_completed) {
						$scope.groupStageCompleted = false;
						$scope.winnerRoundsCompleted = false;
						$scope.losersRoundsCompleted = false;
					}

				}
			}
		} else {
			$scope.groupStageCompleted = false;
		}

		$scope.finalStagesCheck();

		//Assign Dropdowns
		$scope.assignDropdowns();
		loggingTime();

	};

	/* Function for checking for checking if there is a final stage
	 * checks if there is a Winners round and if it has been completed
	 * checks if there is a Losers round and it has been completed
	 */
	$scope.finalStagesCheck = function () {
		//Just double checking if a winners round exist
		if ($scope.tournamentInfo.finalStage.winnerRounds) {
			$scope.winnerRoundsExist = true;

			//iterating over all the rounds in the winners rounds to see if all of these have been completed, if not then winners bracket has not been finished
			for (var j = 0; $scope.tournamentInfo.finalStage.winnerRounds.length > j; j++) {
				if (!$scope.tournamentInfo.finalStage.winnerRounds[j].round_completed) {
					$scope.winnerRoundsCompleted = false;
				}

			}

		} else {
			$scope.winnerRoundsCompleted = false;
		}
		// console.log('$scope.tournamentInfo.finalStage.loserRounds');
		//
		// console.log($scope.tournamentInfo.finalStage.loserRounds);

		//Checking if this tournament has losers bracket
		if ($scope.tournamentInfo.finalStage.loserRounds) {
			$scope.losersRoundsExist = true;
			//iterating over all the rounds in the losers bracket to see if all of these have been completed, if not then the losers bracket is still in progress
			for (var j = 0; $scope.tournamentInfo.finalStage.loserRounds.length > j; j++) {
				if (!($scope.tournamentInfo.finalStage.loserRounds[j].round_completed)) {
					$scope.losersRoundsCompleted = false;
				}

			}

		} else {
			$scope.losersRoundsCompleted = false;
		}
	};

	/* Function used for testing, prints to the console the variables used for checking the available stages and types of rounds
	 */
	var loggingTime = function () {
		// console.log('hasGroupStage: ' + $scope.hasGroupStage);
		// console.log('groupStageCompleted: ' + $scope.groupStageCompleted);
		// console.log('\n');
		// console.log('winnerRoundsExist: ' + $scope.winnerRoundsExist);
		// console.log('winnerRoundsCompleted: ' + $scope.winnerRoundsCompleted);
		// console.log('\n');
		// console.log('losersRoundsExist: ' + $scope.losersRoundsExist);
		// console.log('losersRoundsCompleted: ' + $scope.losersRoundsCompleted);

	};

	/* Sets the available types of rounds (Group, Winners, Losers)
	 * This is done using the Variables that check if these types of rounds exist
	 * It only makes the options for which rounds exist available
	 */
	$scope.assignDropdowns = function () {

		//assign what the drop down will have
		if ($scope.winnerRoundsExist && $scope.losersRoundsExist && $scope.hasGroupStage) {
			$scope.stages = ['Group Stage', 'Winners Round', 'Losers Round'];
			if ($scope.initial)
				$scope.selectedGroup = $scope.tournamentInfo.groupStage.groups[0];
			else
				$scope.selectedGroup = $scope.tournamentInfo.groupStage.groups[$scope.selectedGroup.group_number - 1];

		} else if ($scope.winnerRoundsExist && $scope.losersRoundsExist) {
			$scope.stages = ['Winners Round', 'Losers Round'];

		} else if ($scope.winnerRoundsExist && $scope.hasGroupStage) {
			$scope.stages = ['Group Stage', 'Winners Round'];
			if ($scope.initial)
				$scope.selectedGroup = $scope.tournamentInfo.groupStage.groups[0];
			else
				$scope.selectedGroup = $scope.tournamentInfo.groupStage.groups[$scope.selectedGroup.group_number - 1];

		} else if ($scope.winnerRoundsExist) {
			$scope.stages = ['Winners Round'];
		} else {
			//what???? how!?!?!?
		}

		if ($scope.initial) {
			$scope.roundOf = 'Winner';
			$scope.selectedStage = 'Winners Round';
			$scope.rounds = $scope.tournamentInfo.finalStage.winnerRounds;
			$scope.selectedRound = $scope.tournamentInfo.finalStage.winnerRounds[0];
			$scope.index = 0;
		}
		$scope.initial = false;
	};

	/* Selects the rounds to show based on the selected type  (Group, Winners, Losers)
	 * When changing between the distinct types the currently selected round defaults to
	 * the initial round in that type
	 * ex: Changing from Type Winners when in Round 9 to type Losers will change to the following
	 * 		Losers Rounds - Round 01
	 */

	$scope.changeSelectedStage = function () {

		$scope.init();
		$scope.rounds = [];
		if ($scope.selectedStage == 'Group Stage') {
			console.log('groups ' + $scope.selectedGroup.group_number);
			//console.log();
			$scope.rounds = $scope.selectedGroup.rounds;
			$scope.selectedRound = $scope.rounds[0];
			$scope.index = 0;
			$scope.roundOf = 'Group';

		} else if ($scope.selectedStage == 'Winners Round') {
			$scope.rounds = $scope.tournamentInfo.finalStage.winnerRounds;
			$scope.selectedRound = $scope.rounds[0];
			$scope.index = 0;
			$scope.roundOf = 'Winner';

		} else if ($scope.selectedStage == 'Losers Round') {
			$scope.rounds = $scope.tournamentInfo.finalStage.loserRounds;
			$scope.selectedRound = $scope.rounds[0];
			$scope.index = 0;
			$scope.roundOf = 'Loser';
		} else {
			return;
		}
		//console.log($scope.rounds);

	};

	/* The function will get all the matches for the select combination of Round Type and number
	 * ex: Winners Round 02 will provide all the matches in the final stage winners bracket round 02
	 */
	$scope.getRoundMatches = function (round, index) {
		$scope.init();
		$scope.index = index;
		$scope.selectedRound = round;
		//console.log(round);

	};

	$scope.checkScore = function () {
		console.log("helllllllllll");
		$scope.hasScoreSubmitted = false;
		$scope.hasMatchCompleted = false;
		$scope.init();
		console.log("checking score");
		//tiene que estar paused
		//no puede haber score submitted
		console.log("this is the selectedRound");
		console.log($scope.selectedRound);

		if ($scope.selectedRound.round_pause) {
			//are there matches
			if ($scope.selectedRound.matches.length) {
				//is the a match NOT completed
				for (var i = 0; i < $scope.selectedRound.matches.length; i++) {
					if ($scope.selectedRound.matches[i].match_completed)
						$scope.hasMatchCompleted = true;
				}
				if (!$scope.hasMatchCompleted) {

					for (var j = 0; j < $scope.selectedRound.matches.length; j++) {
						//is there people?
						if ($scope.selectedRound.matches[j].players.length < 2) {
							console.log("There are " + $scope.selectedRound.matches[j].players.length + " people in match ");
							console.log("No score Submitted :D");
							//I can change the best of :D

						} else {
							console.log("There are people in the first match");
							//console.log('There are ' + $scope.selectedRound.matches[0].players.length + 'players');
							console.log($scope.selectedRound.matches[j].players);

							if ((parseInt($scope.selectedRound.matches[j].players[0].score) + parseInt($scope.selectedRound.matches[j].players[1].score)) > 0) {
								console.log("Scores have been submitted");
								$scope.hasScoreSubmitted = true;
								//alert("The round has to be paused and no set can be completed in order to change the amount of sets needed to be played.");
								break;
							} else {
								console.log("No score Submitted :D");
								//I can change the best of :D
								// $scope.hasScoreSubmitted = false;
							}
						}

					}
				} else {
					$scope.hasScoreSubmitted = true;
					//alert("The round has to be paused and no set can be completed in order to change the amount of sets needed to be played.");
					console.log("A match has been completed");
				}
			} else {
				console.log("No matches in this round");
			}
		} else {
			//alert("The round has to be paused and no set can be completed in order to change the amount of sets needed to be played.");
			console.log("Round is Paused");
		}

		console.log("has score: " + $scope.hasScoreSubmitted + ", " + "Is Paused: " + $scope.selectedRound.round_pause);

		if ($scope.hasScoreSubmitted || !$scope.selectedRound.round_pause) {
			console.log("***** I can NOT change :( :( *****");
			return false;

		} else {
			console.log("***** I can change :D :D *****");
			return true;
		}
	};

	$scope.pauseToggle = function () {
		$scope.init();
		console.log("pauseToggle");
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds/' + $scope.selectedRound.round_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&round_of=' + $scope.roundOf).success(function (data) {
			//$scope.tournaments = data;
			if ($scope.selectedRound.round_pause) {
				alert("Succesfully un-paused the round");
				$scope.selectedRound.round_pause = false;
			} else {
				alert("Succesfully paused the round");
				$scope.selectedRound.round_pause = true;
			}

		}).error(function (err) {
			console.log(err);
		});
	};

	$scope.favoriteMatchToggle = function (match) {
		// $scope.getTournamentMatch($scope.matchInfo.match);
		console.log("pauseToggle");
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds/' + $scope.selectedRound.round_number + '/matches/' + match + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&round_of=' + $scope.roundOf).success(function (data) {
			console.log("Togle Match");
			$scope.matchInfo.is_favourite = !$scope.matchInfo.is_favourite;
			$scope.selectedRound.matches[match - 1].is_favourite = !$scope.selectedRound.matches[match - 1].is_favourite;

		}).error(function (err) {
			console.log(err);
		}).then(function () {
			$scope.init();
		});

	};
	$scope.changeBestOfPrompt = function () {

		if ($scope.checkScore())
			$('#changeBestOfPrompt').modal('show');
		else
			alert("You cannot change the amount of sets that can be played in this round. Either a match in the round already has a score submitted or the round isn't paused");

	};
	//siempre checkeo al antes otra vez pq no se esta verificando en el server
	$scope.changeBestOf = function () {

		if ($scope.checkScore()) {

			if (!$scope.bestOf) {
				alert("Please choose a number for the amount of sets (Best of)");
				return;
			}

			if (isNaN($scope.bestOf)) {
				alert("The entered value is not a number");
				return;

			}
			if (!$scope.bestOf % 2) {
				alert("The entered value must be an odd number");
				return;

			}
			if ($scope.hasScoreSubmitted) {
				alert("You cannot change the amount of sets that can be played in this round. Either a match in the round already has a score submitted or the round isn't paused");
				return;
			}
			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds/' + $scope.selectedRound.round_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&round_of=' + $scope.roundOf, {
				"best_of": $scope.bestOf
			}).success(function (data) {
				//$scope.tournaments = data;
				alert("Succesfully changed the amount of sets to be best of " + $scope.bestOf);

			}).error(function (err) {
				console.log(err);
			});

		} else {
			alert("You cannot change the amount of sets that can be played in this round. Either a match in the round already has a score submitted or the round isn't paused");
		}

	};

	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		console.log("Event Tournaments");
		console.log(data);
		$scope.stations = data;

	}).error(function (err) {
		console.log(err);
	});
	$scope.changeStation = function (station) {

		//get all stations for this tournament
		///matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match

		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds/' + $scope.selectedRound.round_number + '/matches/' + $scope.matchInfo.match + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&round_of=' + $scope.roundOf, {
			"station": parseInt(station)
		}).success(function (data) {
			console.log("Chaged to Station " + station);
		}).error(function (err) {
			console.log(err);
		}).then(function () {
			var temp = $scope.selectedRound.matches[$scope.matchInfo.match - 1].station_number;

			for (var i = 0; i < $scope.selectedRound.matches.length; i++) {
				if (($scope.selectedRound.matches[i].station_number == station) && (($scope.matchInfo.match - 1) != i)) {
					$scope.selectedRound.matches[i].station_number = temp;
				}
			}
			$scope.selectedRound.matches[$scope.matchInfo.match - 1].station_number = station;
		});

	};

	$scope.getTournamentMatch = function (match) {
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds/' + $scope.selectedRound.round_number + '/matches/' + match + '?round_of=' + $scope.roundOf + '&date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
			$scope.matchInfo = data;
			console.log("All match data!");
			console.log($scope.matchInfo);
			console.log($scope.selectedRound);
			$scope.matchInfo.round = $scope.selectedRound.round_number;
			$scope.matchInfo.round_of = $scope.roundOf;
			$scope.matchInfo.match = match;

			if ($scope.matchInfo.score_type == 'Points') {
				$scope.matchInfo.players[0].score = 0;
				$scope.matchInfo.players[1].score = 0;
				for (var i = 0; i < $scope.matchInfo.sets.length; i++) {
					if ($scope.matchInfo.sets[i].scores[0].competitor_number) {
						if ($scope.matchInfo.sets[i].scores[0].score > $scope.matchInfo.sets[i].scores[1].score)
							$scope.matchInfo.players[0].score++;
						else
							$scope.matchInfo.players[1].score++;
					} else
						break;
				}
			}
			$('#tournamentMatchupModal').modal('show');
			console.log(data);
		});
	};

	$scope.changeScore = function () {
		$scope.getTournamentMatch($scope.matchInfo.match);

		$scope.setCount = 0;
		console.log("here we go");
		angular.forEach($scope.matchInfo.sets, function (setInfo) {

			console.log($scope.setCount++);
			console.log(setInfo);

			if (setInfo.scores.length == 2) {

				if (setInfo.scores[0].score == null || setInfo.scores[1].score == null) {
					alert("Please enter all scores!");

				}
				if (isNaN(setInfo.scores[0].score) || isNaN(setInfo.scores[1].score)) {
					alert("Scores must be a number!");
					return;
				}
				if (setInfo.scores[0].score < 0 || setInfo.scores[1].score < 0) {
					alert("You cannot set a score to negative!");
					return;

				}
				if (setInfo.scores[0].score == setInfo.scores[1].score) {
					alert("There are no ties in eSports!");
					return;
				} else {
					//console.log($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds/' + $scope.matchInfo.round + '/matches/' + $scope.matchInfo.match + '/' + setInfo.set_seq + '/change?round_of=' + $scope.matchInfo.round_of + '&date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation);

					var newScore = {
						"players": [{
							"competitor_number": parseInt(setInfo.scores[0].competitor_number),
							"score": setInfo.scores[0].score
						}, {
							"competitor_number": parseInt(setInfo.scores[1].competitor_number),
							"score": setInfo.scores[1].score
						}]
					};
					console.log(newScore);

					$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds/' + $scope.matchInfo.round + '/matches/' + $scope.matchInfo.match + '/' + setInfo.set_seq + '/change?round_of=' + $scope.matchInfo.round_of + '&date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, newScore).success(function (data, status) {
						$scope.getTournamentMatch($scope.matchInfo.match);
						$scope.init();
					});
				}
			}

		});

		alert("You have succesfully changed the scores for this match!");

	};

	$scope.init();

});

myApp.controller("eventOverviewController", function ($scope, $http, $window, $rootScope, $state, $stateParams) {
	//event/:eventName/:eventDate/:eventLocation/overview",

	//GET EVENT INFO
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '').success(function (data) {
		$scope.eventInfo = data;
		console.log("Event Info");
		console.log(data);
	});
	//GET TOURNAMENT INFO
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.tournamentsInfo = data;
		console.log("Tournament Info");
		console.log(data);

		if ($scope.tournamentsInfo) {
			if ($scope.tournamentsInfo.length)
				$scope.getCompetitors(0);
		}
	});

	//GET SPECTATOR FEES
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/specfees' + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.fees = data;
		console.log("Spectator Fees");
		console.log(data);
	});
	//GET PARTICIPANTS
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/spectators?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
		$scope.participants = data;
		console.log("Participants");
		console.log(data);
	});

	//GET COMPETITORS FOR SELECTED TOURNMANET
	$scope.getCompetitors = function (index) {
		$scope.selectedTournament = $scope.tournamentsInfo[index];

		// Get competitors
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournamentsInfo[index].tournament_name + '/competitors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			$scope.competitors = data;
		});

		// Get standings/payouts
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournamentsInfo[index].tournament_name + '/payouts?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			$scope.payouts = data;
			console.log(data)
		});

		$scope.payout = function (index) {
			console.log($scope.payouts[index]);
			var body = {
				'competitor_number': $scope.payouts[index].competitor_number
			}
			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.selectedTournament.tournament_name + '/payouts?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, body).success(function (data,status) {
				if (status == 200) {
					console.log(status);
					localStorage.setItem('payKey', data.payKey);
					window.location.href = 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=' + data.payKey;
				} else if (status == 201) {
					console.log(201);
				}
			});
		}


	};

});