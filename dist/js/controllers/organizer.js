var myApp = angular.module('organizer', []);

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
		if ($scope.event.host == null)
			$scope.isHosted = false;
		else
			$scope.isHosted = true;

		console.log($scope.event);

		if (!$scope.isHosted)
			regularEventSettings($scope.event, $scope.tournamentsInfo);

	}, function (err) {
		console.log(err);
		console.log("Oh oh");
	});

	var hostedEventSettings = function (event, tournamentsInfo) {
		//stuff will go here
		$scope.eventInfo = event;
		$scope.tournaments = tournamentsInfo[0].tournament_name;

	};
	var regularEventSettings = function (event, tournamentsInfo) {
		//console.log(tournamentsInfo[0]);
		$scope.eventInfo = event;
		$scope.tournament = tournamentsInfo[0].tournament_name;

	};

});

myApp.controller("SeedingController", function ($scope, $http, $window, $rootScope, $state, $stateParams) {
	$scope.competitors = [];

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

	$scope.getTournament = function (index) {
		$scope.index = index;
		//get competitors for tournament $scope.tournaments[index].tournament_name
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/checked?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			$scope.competitors = data.competitors;
			$scope.bracket = data.stages_created;
			$scope.teamBased = data.team_size > 1;
			console.log(data);

		}).error(function (err) {
			console.log(err);
		});

	};

	$scope.deleteBracket = function () {
		$scope.index
			//TODO call to delete bracket
		console.log("Still testing, we need the current brackets!");

	};

	$scope.createBracket = function () {
		//TODO call create bracket
		///* /matchup/events/:event/tournaments/:tournament/create?date=date&location=string
		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/create?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			console.log(data);
			$scope.bracket = true;
			alert("Bracket succesfully created for the following tournament: " + $scope.tournaments[$scope.index].tournament_name);

		}).error(function (err) {
			console.log(err);
		});

	};

	$scope.saveSeeding = function () {
		var seedList = $scope.competitors;
		for (var i = 0; i < seedList.length; i++) {
			seedList[i].seed = i + 1;
		}
		console.log(seedList);
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
			$timeout(
				function () {
					$state.go("app.myEvents", {
						"username": $window.sessionStorage.username,
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

	$scope.hasGroupStage = false;
	$scope.groupStageCompleted = true;

	$scope.winnerRoundsExist = true;
	$scope.winnerRoundsCompleted = true;

	$scope.losersRoundsExist = false;
	$scope.losersRoundsCompleted = true;
	$scope.tournament = {};
	$scope.tournament.tournament_name = $stateParams.tournamentName;

	//Get all rounds and matches
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $stateParams.tournamentName + '/rounds?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data, status) {
		$scope.tournamentInfo = data;
		console.log(data);

	}).then(function () {
		$scope.stagesCheck();

	});

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
		console.log('$scope.tournamentInfo.finalStage.loserRounds');

		console.log($scope.tournamentInfo.finalStage.loserRounds);

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

	var loggingTime = function () {
		console.log('hasGroupStage: ' + $scope.hasGroupStage);
		console.log('groupStageCompleted: ' + $scope.groupStageCompleted);
		console.log('\n');
		console.log('winnerRoundsExist: ' + $scope.winnerRoundsExist);
		console.log('winnerRoundsCompleted: ' + $scope.winnerRoundsCompleted);
		console.log('\n');
		console.log('losersRoundsExist: ' + $scope.losersRoundsExist);
		console.log('losersRoundsCompleted: ' + $scope.losersRoundsCompleted);

	};

	$scope.assignDropdowns = function () {
		//assign what the drop down will have
		if ($scope.winnerRoundsExist && $scope.losersRoundsExist && $scope.hasGroupStage) {
			$scope.stages = ['Group Stage', 'Winners Round', 'Losers Round'];
			$scope.selectedGroup = $scope.tournamentInfo.groupStage.groups[0];

		} else if ($scope.winnerRoundsExist && $scope.losersRoundsExist) {
			$scope.stages = ['Winners Round', 'Losers Round'];

		} else if ($scope.winnerRoundsExist && $scope.hasGroupStage) {
			$scope.stages = ['Group Stage', 'Winners Round'];
			$scope.selectedGroup = $scope.tournamentInfo.groupStage.groups[0];

		} else if ($scope.winnerRoundsExist) {
			$scope.stages = ['Winners Round'];
		} else {
			//what???? how!?!?!?
		}

		$scope.selectedStage = 'Winners Round';
		$scope.rounds = $scope.tournamentInfo.finalStage.winnerRounds;
		$scope.selectedRound = $scope.tournamentInfo.finalStage.winnerRounds[0];
	};

	$scope.changeSelectedStage = function () {
		$scope.rounds = [];

		if ($scope.selectedStage == 'Group Stage') {
			console.log($scope.selectedGroup);
			$scope.rounds = $scope.selectedGroup.rounds;
			$scope.selectedRound = $scope.rounds[0];
			$scope.index = 0;

		} else if ($scope.selectedStage == 'Winners Round') {
			$scope.rounds = $scope.tournamentInfo.finalStage.winnerRounds;
			$scope.selectedRound = $scope.rounds[0];
			$scope.index = 0;
		} else if ($scope.selectedStage == 'Losers Round') {
			$scope.rounds = $scope.tournamentInfo.finalStage.loserRounds;
			$scope.selectedRound = $scope.rounds[0];
			$scope.index = 0;
		} else {
			return;
		}
		//console.log($scope.rounds);

	};

	$scope.getRoundMatches = function (round, index) {
		$scope.index = index;
		$scope.selectedRound = round;
		console.log(round);

	};
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

	$scope.getTournament = function (index) {
		$scope.index = index;
		//get competitors for tournament $scope.tournaments[index].tournament_name
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/checked?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			$scope.competitors = data.competitors;
			$scope.bracket = data.stages_created;
			$scope.teamBased = data.team_size > 1;
			console.log(data);

		}).error(function (err) {
			console.log(err);
		});

	};

	$scope.deleteBracket = function () {
		$scope.index
			//TODO call to delete bracket
		console.log("Still testing, we need the current brackets!");

	};
	$scope.createBracket = function () {
		//TODO call create bracket
		///* /matchup/events/:event/tournaments/:tournament/create?date=date&location=string
		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/create?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function (data) {
			console.log(data);
			$scope.bracket = true;
			alert("Bracket succesfully created for the following tournament: " + $scope.tournaments[$scope.index].tournament_name);

		}).error(function (err) {
			console.log(err);
		});

	};
	$scope.saveSeeding = function () {
		var seedList = $scope.competitors;
		for (var i = 0; i < seedList.length; i++) {
			seedList[i].seed = i + 1;
		}
		console.log(seedList);
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