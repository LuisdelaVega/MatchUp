var myApp = angular.module('organizer', []);

myApp.controller("SeedingController", function($scope, $http, $window, $rootScope, $state, $stateParams) {
	$scope.competitors = [];

	// Initiate Get from server and get tournaments in the event
	//get all tournaments for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
		$scope.tournaments = data;

	}).error(function(err) {
		console.log(err);
	}).then(function() {
		$scope.index = 0;
		$scope.getTournament(0);

	});

	$scope.getTournament = function(index) {
		$scope.index = index;
		//get competitors for tournament $scope.tournaments[index].tournament_name
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/checked?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
			$scope.competitors = data.competitors;
			$scope.bracket = data.stages_created;
			$scope.teamBased = data.team_size > 1;
			console.log(data);

		}).error(function(err) {
			console.log(err);
		});

	};

	$scope.deleteBracket = function() {
		$scope.index
		//TODO call to delete bracket
		console.log("Still testing, we need the current brackets!");

	};
	$scope.createBracket = function() {
		//TODO call create bracket
		///* /matchup/events/:event/tournaments/:tournament/create?date=date&location=string
		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/create?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
			console.log(data);
			$scope.bracket = true;
			alert("Bracket succesfully created for the following tournament: " + $scope.tournaments[$scope.index].tournament_name);

		}).error(function(err) {
			console.log(err);
		});

	};
	$scope.saveSeeding = function() {
		var seedList = $scope.competitors;
		for (var i = 0; i < seedList.length; i++) {
			seedList[i].seed = i + 1;
		}
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/checked?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, {
			"players" : seedList
		}).success(function(data) {
			console.log(data);
		}).error(function(err) {
			console.log(err);
		});

	};

	// Configure draggable table
	$scope.sortableOptions = {
		containment : '#sortable-container'
	};

});

myApp.controller("RegistrationController", function($scope, $http, $window, $rootScope, $state, $stateParams) {

	// Initiate Get from server and get tournaments in the event

	//get all SPECTATORS for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/spectators?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
		console.log("Spectators");
		console.log(data);
		$scope.spectators = data;
	}).error(function(err) {
		console.log(err);
	});

	//get all tournaments for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
		console.log("Event Tournaments");
		console.log(data);
		$scope.tournaments = data;

		$scope.tournaments.unshift({
			"tournament_name" : "Spectator"
		});

	}).error(function(err) {
		console.log(err);
	}).finally(function() {
		$scope.signups = $scope.spectators;
		$scope.index = 0;
	});

	$scope.getRegistrationInfo = function(index) {
		if (index == 0) {
			$scope.index = index;
			$scope.signups = $scope.spectators;

		} else {
			$scope.index = index;
			$scope.signups = [];
			//get competitors for tournament $scope.tournaments[index].tournament_name
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[index].tournament_name + '/competitors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
				console.log("Tournament Competitors");
				console.log(data);
				$scope.signups = data;

			}).error(function(err) {
				console.log(err);
			});

		}
	}

	$scope.checkIn = function(item) {
		if ($scope.index == 0) {
			//check or uncheck a spectator
			$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/spectators/' + item.customer_username + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {

				//console.log("Checking in " + item.customer_username + " as a spectator");
				alert(item.customer_username + " ( " + item.customer_first_name + " " + item.customer_last_name + " ) " + checked(item) + " as a spectator");

			}).error(function(err) {
				console.log(err);
			});
		} else {
			//check or uncheck a competitor for tournament $scope.tournaments[$scope.index].tournament_name
			$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/competitors/' + item.competitor_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
				//console.log("Checking in " + item.customer_username + " as a competitor to the following tournament: '" + $scope.tournaments[index].tournament_name +"'");
				alert(item.customer_username + " ( " + item.customer_first_name + " " + item.customer_last_name + " ) " + checked(item) + " as a competitor for the following tournament: '" + $scope.tournaments[$scope.index].tournament_name + "'");
			}).error(function(err) {
				console.log(err);
			});
		}

	};

	var checked = function(item) {
		if (item.check_in) {
			//alert(item.customer_username + " (" + item.customer_tag + ") was unchecked");
			item.check_in = false;
			return "has been un-checked";

		} else {
			//alert(item.customer_username + " (" + item.customer_tag + ") was checked");
			item.check_in = true;
			return "has succesfully been checked in";
		}
	};

});

myApp.controller("ReportsController", function($scope, $rootScope) {

	$scope.reports = [{
		"type" : "Score Dispute",
		"tournamentName" : "Tournamet 1",
		"station" : "Station 1",
		"round" : "Round 1 Match 3 Set 2",
		"status" : true,
		"img" : "image",
		"date" : "8:00PM 8 June",
		"content" : "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
	}, {
		"type" : "Faulty Equipment",
		"tournamentName" : "Tournamet 3",
		"station" : "Station 12",
		"round" : "Round 10 Match 4 Set 2",
		"status" : true,
		"img" : "image",
		"date" : "8:13PM 8 June",
		"content" : "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
	}, {
		"type" : "Score Dispute",
		"tournamentName" : "Tournamet 1",
		"station" : "Station 1",
		"round" : "Round 3 Match 1 Set 2",
		"status" : false,
		"img" : "image",
		"date" : "7:00PM 8 June",
		"content" : "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
	}, {
		"type" : "No Show",
		"tournamentName" : "Tournamet 3",
		"station" : "Station 3",
		"round" : "Round 1 Match 3 Set 2",
		"status" : true,
		"img" : "",
		"date" : "8:32PM 8 June",
		"content" : "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
	}];
	$scope.index

	$scope.reportModal = function(index) {
		$scope.index = index;
		$('#reportModal').modal('show');
	};

	$scope.resolve = function() {
		$scope.reports[$scope.index].status = true;
		$('#reportModal').modal('hide');
	};

});

myApp.controller("StationController", function($scope, $http, $window, $rootScope, $state, $stateParams, $rootScope) {

	//get all stations for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
		console.log("Event Stations");
		console.log(data);
		$scope.allStations = data;

	}).error(function(err) {
		console.log(err);
	});

	//get all tournaments for this event
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
		console.log("Event Tournaments");
		console.log(data);
		$scope.tournaments = data;

		$scope.tournaments.unshift({
			"tournament_name" : "All Stations"
		});

	}).error(function(err) {
		console.log(err);
	}).finally(function() {
		$scope.stations = $scope.allStations;
		$scope.index = 0;
	});
	// Index to show active item in list of tournament

	$scope.getTournamentStation = function(index) {
		$scope.index = index;
		if (index == 0) {
			$scope.stations = $scope.allStations;
			return;
		}

		//get all stations for this tournament
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[index].tournament_name + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
			console.log("Event Tournaments");
			console.log(data);
			$scope.stations = data;

		}).error(function(err) {
			console.log(err);
		});

	};

	// Edit a single station
	$scope.editStationModal = function(index) {

		// Index to save the current station selected
		$scope.stationIndex = index;
		$scope.stationInUse = [];

		//	for(j=1; j < $scope.tournaments.length-1; j++){
		var j = 1;

		angular.forEach($scope.tournaments, function(tournament) {
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + tournament.tournament_name + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
				$scope.stationsOfTournament = data;

				angular.forEach($scope.stationsOfTournament, function(tournamentStation) {
					if ($scope.stations[index].station_number == tournamentStation.station_number) {
						$scope.stationInUse.push({
							"name" : tournament.tournament_name
						});
						return;
					}

				});

			}).error(function(err) {
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
	$scope.linkStation = function(index) {
		// Get all stations

		// Array to save available stations
		$scope.availableStations = [];
		// Remove stations in current tournament from the array of all stations
		for ( i = 0; i < $scope.allStations.length; i++) {
			for ( j = 0; j < $scope.stations.length; j++) {
				// If found jump to next station in allStations
				if ($scope.allStations[i].station_number == $scope.stations[j].station_number) {
					break;
				}
				// Not found add it to availableStations
				if (j == $scope.stations.length - 1) {
					$scope.availableStations.push($scope.allStations[i]);

				}
			}
		}
		if ($scope.availableStations.length == 0)
			alert("No stations available");
		else
			$('#linkStation').modal("show");
	};

	// Radio button model
	$scope.selected = {
		station : null
	};
	// Attach station to a tournament
	$scope.attatch = function() {
		if ($scope.selected.station) {
			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + angular.fromJson($scope.selected.station).station_number).success(function(data) {
				$scope.stations.push(angular.fromJson($scope.selected.station));
				$('#linkStation').modal("hide");
				$scope.selected.station = null;
			}).error(function(err) {
				console.log(err);
			});
		}
	};

	// Add a new station to the event attatch to the selected tournament
	$scope.addStation = function() {
		$scope.newStation = {
			"station_number" : $scope.allStations.length + 1,
			"station_in_use" : false,
			"stream_link" : null
		};

		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
			$scope.allStations.push($scope.newStation);

		}).error(function(err) {
			console.log(err);
		});

		//add to current station
		if ($scope.index > 0) {
			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + $scope.newStation.station_number).success(function(data) {
				$scope.stations.push($scope.newStation);
			}).error(function(err) {
				console.log(err);
			});
		}

	};

	$scope.editStream = function() {
		// Get input value and overwrite station stream link
		$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations/' + $scope.stations[$scope.stationIndex].station_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, {
			"stream" : $scope.newStream
		}).success(function(data) {
			if ($scope.index > 0)
				$scope.stations[$scope.stationIndex].stream_link = $scope.newStream;
			else
				$scope.allStations[$scope.stationIndex].stream_link = $scope.newStream;

			$scope.newStream = "";
			$('#editStationModal').modal('hide');

		}).error(function(err) {
			console.log(err);
		});

	};

	$scope.addStream = function() {
		// Get input value and overwrite station stream link
		$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations/' + $scope.stations[$scope.stationIndex].station_number + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, {
			"stream" : $scope.newStream
		}).success(function(data) {
			if ($scope.index > 0)
				$scope.stations[$scope.stationIndex].stream_link = $scope.newStream;
			else
				$scope.allStations[$scope.stationIndex].stream_link = $scope.newStream;

			$scope.newStream = "";
			$('#editStationModal').modal('hide');

		}).error(function(err) {
			console.log(err);
		});

	};

	// Remove station from tournament
	$scope.removeStation = function() {
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments/' + $scope.tournaments[$scope.index].tournament_name + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + $scope.stations[$scope.stationIndex].station_number).success(function(data) {
			$scope.stations.splice($scope.stationIndex, 1);
			$('#editStationModal').modal('hide');
		}).error(function(err) {
			console.log(err);
		});
	};

	// Delete station from tournament
	$scope.deleteStation = function() {
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/stations?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&station=' + $scope.allStations[$scope.stationIndex].station_number).success(function(data) {
			$scope.allStations.splice($scope.stationIndex, 1);
			$('#editStationModal').modal('hide');

		}).error(function(err) {
			console.log(err);
		});

	};
});

myApp.controller("editEventController", function($scope, $http, $window, $rootScope, $state, $stateParams, $rootScope) {

	//Get the event details
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
		$scope.eventData = data;
		$scope.eventData.event_start_date = new Date($scope.eventData.event_start_date);
		$scope.eventData.event_end_date = new Date($scope.eventData.event_end_date);
		$scope.eventData.event_registration_deadline = new Date($scope.eventData.event_registration_deadline);
		//CHANGE TO THE SPECTATOR FEE GET
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {

			$scope.spectatorFees = [{
				spec_fee_name : 'One day Pass',
				spec_fee_amount : 4.00,
				spec_fee_amount_available : 10,
				spec_fee_description : 'Selfies Shoreditch locavore XOXO next level, literally whatever cred actually direct trade. Marfa artisan Portland 3 wolf moon, cliche pork belly Intelligentsia cray dreamcatcher Wes Anderson Vice'
			}, {
				spec_fee_name : 'VIP Pass',
				spec_fee_amount : 10.00,
				spec_fee_amount_available : 5,
				spec_fee_description : 'Post-ironic distillery keytar migas, slow-carb bitters Carles. Tumblr ennui meditation fashion axe meggings, paleo mlkshk'
			}];

			$scope.newFee = {};

		}).error(function(data, status) {
			console.log(status);
		});
		if ($scope.eventData.host) {
			$http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.eventData.host + '/sponsors').success(function(data) {
				$scope.organizationSponsors = data;

				$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation).success(function(data) {
					$scope.sponsorsShown = data;
					angular.forEach($scope.sponsorsShown, function(eventSponsor) {
						angular.forEach($scope.organizationSponsors, function(orgSponsor) {
							//orgSponsor.shown = false;
							if (eventSponsor.sponsor_name == orgSponsor.sponsor_name) {
								orgSponsor.shown = true;
								return;
							}
						});

					});
				}).error(function(data, status) {
					console.log(status);
				});

			}).error(function(data, status) {
				console.log(status);
			});
		}

	}).error(function(data, status) {
		console.log(status);
	});

	$scope.deleteFeeConfirmation = function(fee) {
		$('#deleteModal').modal('show');
		$scope.deleteFee = fee;
	};

	$scope.removeFee = function() {
		//HTTP DELETE MISSING
		$scope.spectatorFees.splice($scope.spectatorFees.indexOf($scope.deleteFee), 1);
		$('#deleteModal').modal('hide');
	};

	$scope.addFee = function() {
		$scope.spectatorFees.push($scope.newFee);
		$scope.newFee = {};
		$('#addFeeModal').modal('hide');
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
			xhr.open("POST", "http://api.imgur.com/2/upload.json");
			xhr.onload = function() {
				// Apply changes to scope. Not a angular function it is needed
				$scope.$apply(function() {
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
	$scope.validateEvent = function() {
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
				"name" : $scope.eventData.event_name,
				"start_date" : $scope.eventData.event_start_date,
				"location" : $scope.eventData.event_location,
				"venue" : $scope.eventData.event_venue,
				"banner" : $scope.eventData.event_banner,
				"logo" : $scope.eventData.event_logo,
				"end_date" : $scope.eventData.event_end_date,
				"registration_deadline" : $scope.eventData.event_registration_deadline,
				"rules" : $scope.eventData.event_rules,
				"description" : $scope.eventData.event_description,
				"deduction_fee" : $scope.eventData.event_deduction_fee,
				"is_online" : $scope.eventData.event_is_online,
				"type" : $scope.eventData.event_type
			};

			$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation, updatedEvent).success(function(data) {

				$state.go("app.eventSettings", {
					eventName : $stateParams.eventName,
					eventDate : $stateParams.eventDate,
					eventLocation : $stateParams.eventLocation
				});

			}).error(function(data, status) {
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
	$scope.testSpoon = function() {

		console.log('Initial Sponsors');
		console.log($scope.sponsorsShown);

		console.log('Sponsors Selected');
		console.log($scope.selectedSponsors);

		console.log('Sponsors Added');
		console.log($scope.selectedSponsorsAdd);

		console.log('Sponsors Deleted');
		console.log($scope.selectedSponsorsDelete);

	};
	$scope.editEventSponsors = function() {
		$scope.selectedSponsors = [];
		$scope.selectedSponsorsAdd = [];
		$scope.selectedSponsorsDelete = [];

		//populate the array which will contain all the sponsors which have been selected
		angular.forEach($scope.organizationSponsors, function(orgSponsor) {
			if (orgSponsor.shown)
				$scope.selectedSponsors.push(orgSponsor);
		});

		//compare if the the values that have been checked were initially there, if not they have been added
		angular.forEach($scope.selectedSponsors, function(currentlySelected) {
			angular.forEach($scope.sponsorsShown, function(initiallySelected) {
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
		angular.forEach($scope.sponsorsShown, function(initiallySelected) {
			angular.forEach($scope.selectedSponsors, function(currentlySelected) {
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

			angular.forEach($scope.selectedSponsorsAdd, function(sponsor) {
				$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&sponsor=' + sponsor.sponsor_name).success(function(data) {

				}).error(function(data, status) {
					console.log(status);
				});
			});

			angular.forEach($scope.selectedSponsorsDelete, function(sponsor) {
				$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&sponsor=' + sponsor.sponsor_name).success(function(data) {

				}).error(function(data, status) {
					console.log(status);
				});
			});
		} else {
			//remove all in initial
			angular.forEach($scope.sponsorsShown, function(sponsor) {
				$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/sponsors?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&sponsor=' + sponsor.sponsor_name).success(function(data) {

				}).error(function(data, status) {
					console.log(status);
				});
			});
		}
		$state.go("app.eventSettings", {
			eventName : $stateParams.eventName,
			eventDate : $stateParams.eventDate,
			eventLocation : $stateParams.eventLocation
		});

	};
	// Function to create a hosted event
	$scope.editHostedEvent = function() {

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
	}
});
