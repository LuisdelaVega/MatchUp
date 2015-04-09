// Organizer module. It contains all controllers that manage
// the organizer view
var myApp = angular.module('organizer', []);

/*
 *	Controller that handles the arragement of seeding, initiates the creation
 *	of a tournament, and sets the date of the rounds
 *	templateUrl: "organizer/seeding.html"
 */
myApp.controller("SeedingController", function ($scope) {

	// Initiate Get from server and get tournaments in the event
	$scope.tournaments = [
		{
			"name": "Tournament 1"
			},
		{
			"name": "Tournament 2"
			},
		{
			"name": "Tournament 3"
			}
		];

	// Get competitors for the first tournament
	$scope.competitors = [
		{
			name: 'tag 1',
			firstName: 'Rafa'
				}, {
			name: 'tag 2',
			firstName: 'Luis'
				},
		{
			name: 'tag 3',
			firstName: 'Sam'
				}, {
			name: 'tag 4',
			firstName: 'Badillo'
				}];

	// Get rounds information if the tournament has already started
	$scope.rounds = [
		{
			name: 'Round 1',
				}, {
			name: 'Round 2',
				},
		{
			name: 'Round 3',

				}, {
			name: 'Round 4'
				}];

	$scope.index = 0;

	// Variable to handle seeding logic
	$scope.seedingCreated = false;

	// Static logic for getting seeding information of each tournament
	// This will wil implemented with acutal server calls
	$scope.getSeedingInfo = function (index) {
		if (index == 0) {
			$scope.index = index;
			$scope.seedingCreated = false;
			$scope.competitors = [{
					name: 'tag 1',
					firstName: 'Rafa'
				}, {
					name: 'tag 2',
					firstName: 'Luis'
				},
				{
					name: 'tag 3',
					firstName: 'Sam'
				}, {
					name: 'tag 4',
					firstName: 'Badillo'
				}];
		} else if (index == 1) {
			$scope.index = index;
			$scope.seedingCreated = true;
			$scope.competitors = [{
				name: 'tag 1',
				firstName: 'Jill'
				}, {
				name: 'tag 2',
				firstName: 'Apu'
				}];
			$scope.rounds = [{
					name: 'Round 1',
				}, {
					name: 'Round 2',
				},
				{
					name: 'Round 3',

				}, {
					name: 'Round 4'
				}];
		} else {
			$scope.index = index;
			$scope.seedingCreated = true;
			$scope.rounds = [{
					name: 'Round 1',
					date: new Date()
				}, {
					name: 'Round 2',
					date: new Date()
				},
				{
					name: 'Round 3',
					date: new Date()

				}, {
					name: 'Round 4',
					date: new Date()
				}];
		}
	}


	// Configure draggable table
	$scope.sortableOptions = {
		containment: '#sortable-container'
	};

	// Send competitors list to the server
	// arrange in seeding order
	$scope.createTournament = function () {
		$scope.seedingCreated = true;
	}

	// Set dates for the rounds of the selected tournament
	$scope.setDate = function () {
		// Valid dates
		for (i = 0; i < $scope.rounds.length - 1; i++) {
			if ($scope.rounds[i].date > $scope.rounds[i + 1].date) {
				alert("Invalid dates");
			}
		}
	}
});

/*
 *	Controller that handles the check in of spectators and
 *  competitors.
 *	templateUrl: "organizer/registrations.html"
 *	Spectator URL (GET): http://matchup.neptunolabs.com/matchup/events/{{event}}/spectators?date={{date}}&location={{location}}
 *	Competitor URL (GET): http://matchup.neptunolabs.com/matchup/events/{{event}}/tournaments/{{tournament}}/competitors?date={{date}}&location={{location}}
 *	Check In Spectator (PUT): http://matchup.neptunolabs.com/matchup/events/{{event}}/spectators/{{username}}?date={{date}}&location={{location}}
 *	Check In Competitor (PUT): http://matchup.neptunolabs.com/matchup/events/{{event}}/tournaments/{{tournament}}/competitors/{{competitor}}?date={{date}}&location={{location}}
 */
myApp.controller("RegistrationController", function ($scope) {

	// Initiate get from server and get tournaments in the event
	$scope.tournaments = [
		{
			"name": "Tournament 1"
			}
		];
	
	// Push spectator to the array of tournaments. Used for
	// populating the navigation list
	$scope.tournaments.unshift({
		"name": "Spectator"
	});

	$scope.index = 0;

	// Get spectator signups 
	$scope.signups = [
		{
			"customer_username": "thecap1",
			"customer_first_name": "James",
			"customer_last_name": "Kirk",
			"customer_tag": "The Real Cap",
			"customer_profile_pic": "http://neptunolabs.com/images/kirk.png",
			"spec_fee_name": "2-day Pass",
			"check_in": true
    },
		{
			"customer_username": "thecap2",
			"customer_first_name": "Jean-Luc",
			"customer_last_name": "Picard",
			"customer_tag": "Dragon",
			"customer_profile_pic": "http://neptunolabs.com/images/luc.png",
			"spec_fee_name": "3-day Pass",
			"check_in": false
    },
		{
			"customer_username": "thecap",
			"customer_first_name": "Jonathan",
			"customer_last_name": "Archer",
			"customer_tag": "Rocket",
			"customer_profile_pic": "http://neptunolabs.com/images/Archer.png",
			"spec_fee_name": "Opening Day Pass",
			"check_in": true
    }
];

	// Get list of participatns
	$scope.getRegistrationInfo = function (index) {
		// Get spectators
		if (index == 0) {
			$scope.index = index;
			
			$scope.signups = [
				{
					"customer_username": "thecap1",
					"customer_first_name": "James",
					"customer_last_name": "Kirk",
					"customer_tag": "The Real Cap",
					"customer_profile_pic": "http://neptunolabs.com/images/kirk.png",
					"spec_fee_name": "2-day Pass",
					"check_in": true
    },
				{
					"customer_username": "thecap2",
					"customer_first_name": "Jean-Luc",
					"customer_last_name": "Picard",
					"customer_tag": "Dragon",
					"customer_profile_pic": "http://neptunolabs.com/images/luc.png",
					"spec_fee_name": "3-day Pass",
					"check_in": false
    },
				{
					"customer_username": "thecap",
					"customer_first_name": "Jonathan",
					"customer_last_name": "Archer",
					"customer_tag": "Rocket",
					"customer_profile_pic": "http://neptunolabs.com/images/Archer.png",
					"spec_fee_name": "Opening Day Pass",
					"check_in": true
    }
];
		} 
		// Get competitors
		else {
			$scope.index = index;
			$scope.signups = [
				{
					"customer_username": "thecap1",
					"customer_first_name": "James",
					"customer_last_name": "Smith",
					"customer_tag": "Duck",
					"customer_profile_pic": "http://neptunolabs.com/images/kirk.png",
					"spec_fee_name": "2-day Pass",
					"check_in": true
    },
				{
					"customer_username": "thecap2",
					"customer_first_name": "John",
					"customer_last_name": "117",
					"customer_tag": "Rodgers",
					"customer_profile_pic": "http://neptunolabs.com/images/luc.png",
					"spec_fee_name": "3-day Pass",
					"check_in": false
    },
				{
					"customer_username": "thecap",
					"customer_first_name": "Fitz",
					"customer_last_name": "Miranda",
					"customer_tag": "Donut",
					"customer_profile_pic": "http://neptunolabs.com/images/Archer.png",
					"spec_fee_name": "Opening Day Pass",
					"check_in": false
    }
];
		}
	}

	// Check in a spectator or tournament
	$scope.checkIn = function (item) {
		if (item.check_in) {
			alert(item.customer_username + " (" + item.customer_tag + ") was unchecked");
			item.check_in = false;
		} else {
			alert(item.customer_username + " (" + item.customer_tag + ") was checked");
			item.check_in = true;
		}
	};

});

/*
 *	Controller that shows a list of reports. It will let users
 *	mark unresolved reports as resolve.
 *	templateUrl: "organizer/report_list.html"
 *	
 */
myApp.controller("ReportsController", function ($scope) {

	// Get reports from all the events
	$scope.reports = [
		{
			"type": "Score Dispute",
			"tournamentName": "Tournamet 1",
			"station": "Station 1",
			"round": "Round 1 Match 3 Set 2",
			"status": true,
			"img": "image",
			"date": "8:00PM 8 June",
			"content": "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
			},
		{
			"type": "Faulty Equipment",
			"tournamentName": "Tournamet 3",
			"station": "Station 12",
			"round": "Round 10 Match 4 Set 2",
			"status": true,
			"img": "image",
			"date": "8:13PM 8 June",
			"content": "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
			},
		{
			"type": "Score Dispute",
			"tournamentName": "Tournamet 1",
			"station": "Station 1",
			"round": "Round 3 Match 1 Set 2",
			"status": false,
			"img": "image",
			"date": "7:00PM 8 June",
			"content": "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
			},
		{
			"type": "No Show",
			"tournamentName": "Tournamet 3",
			"station": "Station 3",
			"round": "Round 1 Match 3 Set 2",
			"status": true,
			"img": "",
			"date": "8:32PM 8 June",
			"content": "booth Pinterest four dollar toast occupy deep v, freegan polaroid. Fashion axe vinyl street art."
			},
		];
	$scope.index;

	// Function to activate modal
	$scope.reportModal = function (index) {
		$scope.index = index;
		$('#reportModal').modal('show');
	}

	// Mark report as resolve
	$scope.resolve = function () {
		$scope.reports[$scope.index].status = true;
		$('#reportModal').modal('hide');
	}
});

/*
 *	Handle station management for all the tournaments
 *	templateUrl: "organizer/station_assignment.html"
 *	Station URL (GET): http://matchup.neptunolabs.com/matchup/events/{{event}}/tournaments/{{tournament}}/stations?date={{date}}&location={{location}}
 *  Add Station (POST): http://matchup.neptunolabs.com/matchup/events/{{event}}/stations?date={{date}}&location={{location}}
 *	Attach Station (POST): http://matchup.neptunolabs.com/matchup/events/{{event}}/tournaments/{{{tournament}}}?date={{date}}&location={{location}}&station={{number}}
 *	Delete Station (DELETE): http://matchup.neptunolabs.com/matchup/events/{{event}}/tournaments/{{tournament}}?date={{date}}&location={{location}}&station={{number}}
 *	
 */
myApp.controller("StationController", function ($scope) {
	// Get tournaments
	$scope.tournaments = [
		{
			"name": "Tournament 1"
			},
		{
			"name": "Tournament 2"
			}
		];
	// Get Stations for that tournament
	$scope.stations = [
		{
			"station_number": 1,
			"station_in_use": false,
			"stream_link": "http://www.streamserviceofchoice.tv/your_channel"
  },
		{
			"station_number": 3,
			"station_in_use": false,
			"stream_link": null
  },
		{
			"station_number": 5,
			"station_in_use": false,
			"stream_link": null
  }
];
	// Index to show active item in list of tournament
	$scope.index = 0;
	// Index to save the current station selected
	$scope.stationIndex = 0;

	$scope.allStations = [
		{
			"station_number": 1,
			"station_in_use": false,
			"stream_link": "http://www.streamserviceofchoice.tv/your_channel"
  },
		{
			"station_number": 2,
			"station_in_use": false,
			"stream_link": null
  },
		{
			"station_number": 3,
			"station_in_use": false,
			"stream_link": null
  },
		{
			"station_number": 4,
			"station_in_use": false,
			"stream_link": null
  },
		{
			"station_number": 5,
			"station_in_use": false,
			"stream_link": null
  }
];

	// Get selected tournament stations
	$scope.getTournamnetStation = function (index) {
		if (index == 0) {
			$scope.index = index;
			$scope.stations = [
				{
					"station_number": 1,
					"station_in_use": false,
					"stream_link": "http://www.streamserviceofchoice.tv/your_channel"
  },
				{
					"station_number": 3,
					"station_in_use": false,
					"stream_link": null
  },
				{
					"station_number": 5,
					"station_in_use": false,
					"stream_link": null
  }
];
		} else {
			$scope.index = index;
			$scope.stations = [
				{
					"station_number": 2,
					"station_in_use": false,
					"stream_link": null
  },
				{
					"station_number": 4,
					"station_in_use": false,
					"stream_link": null
  },
				{
					"station_number": 5,
					"station_in_use": false,
					"stream_link": "http://www.streamserviceofchoice.tv/your_channel"
  }
];
		}
	};

	// Edit a single station
	$scope.editStationModal = function (index) {
		$scope.stationIndex = index;
		// Get specific station information
		$scope.stationInUse = [
			{

				"name": "Tournament 2",
			},
			{

				"name": "Tournament 1",
			}
    	];

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
		station: null
	};
	// Attatch station to a tournament
	$scope.attatch = function () {
		if ($scope.selected.station) {
			$scope.stations.push(angular.fromJson($scope.selected.station));
			$('#linkStation').modal("hide");
			$scope.selected.station = null;
		}
	};

	// Add a new station to the event attatch to the selected tournament
	$scope.addStation = function () {
		var newStation = {
			"station_number": $scope.allStations.length + 1,
			"station_in_use": false,
			"stream_link": "http://www.streamserviceofchoice.tv/your_channel"
		};
		$scope.stations.push(newStation);
		$scope.allStations.push(newStation);
	};

	$scope.editStream = function () {
		// Get input value and overwrite station stream link
		$scope.stations[$scope.stationIndex].stream_link = $scope.newStream;
		$scope.newStream = "";
		$('#editStationModal').modal('hide');
	};

	// Remove station from tournament
	$scope.removeStation = function () {
		$scope.stations.splice($scope.stationIndex, 1);
		$('#editStationModal').modal('hide');
	};

	// Delete station from tournament
	$scope.deleteStation = function () {
		$scope.stations.splice($scope.stationIndex, 1);
		$('#editStationModal').modal('hide');
	};
});