var myApp = angular.module('premium-events', []);
/* CURRENTLY NOT DONE
myApp.controller('ratingsController', ['$scope', '$http',
function($scope, $http) {

// set the rate and max variables
$scope.rate = 3;
$scope.max = 5;

}]);

myApp.controller('writeReviewRatingsController', ['$scope', '$http',
function($scope, $http) {

// set the rate and max variables
$scope.rate = 3;
$scope.max = 5;

}]);

myApp.controller('postNewsController', function($scope, $stateParams, $state, sharedDataService) {
var values = sharedDataService.get();
// Change title depending on type
$scope.type = $stateParams.type;
// Gets called before entering the view
$scope.$on('$ionicView.beforeEnter', function() {
$scope.type = $stateParams.type;
if ($scope.type == 'Create') {

} else {

var result = values[0];
$scope.content = result['content'];
$scope.title = result['title'];
}
});

$scope.eventName = values[1];

//Might require change remember to look into
$scope.goToEvent = function(eventName) {

eventName = eventName.replace(" ", "%20");
$state.go('app.eventpremium.news', {
"eventname" : eventName
});
sharedDataService.set(eventName);
};
});

myApp.controller('premiumSignUpController', function($scope, $state, $http, $stateParams, sharedDataService) {

var params = sharedDataService.get();

$scope.returnToPremiumEvent = function() {

$state.go("app.eventpremium.summary", {
eventname : params[0],
date : params[1],
location : params[2]
})

}
});
*/

//Controller used to manage the Premium event page, includes various tasks such as retriving participants, sponsors, the organization hosting the event, the different tournaments, meetups and news
myApp.controller('eventPremiumSummaryController', function($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {

	var now_utc = new Date();

	$q.all([
	// Get Event Info
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location + ''),

	// Get Sponsors
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/sponsors?date=' + $stateParams.date + '&location=' + $stateParams.location),

	// Get News
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/news?date=' + $stateParams.date + '&location=' + $stateParams.location),

	// Participants
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/spectators?date=' + $stateParams.date + '&location=' + $stateParams.location),

	// Tournaments
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments?date=' + $stateParams.date + '&location=' + $stateParams.location)]).then(function(results) {

		// Get Events
		$scope.eventInfo = results[0].data;

		var startDate = new Date($scope.eventInfo.event_start_date);
		var endDate = new Date($scope.eventInfo.event_end_date);
		var registration = new Date($scope.eventInfo.event_registration_deadline);

		$scope.isOngoing = false;
		$scope.registrationEnded = true;
		// Check if event ended
		if (endDate.getTime() < now_utc.getTime())
			$scope.finished = true;
		else {
			$scope.finished = false;
			$scope.isOngoing = (startDate.getTime() > now_utc.getTime());
			$scope.registrationEnded = (registration.getTime() < now_utc.getTime());
		}

		// Get Host info
		$http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.eventInfo.host).success(function(data) {
			// Get host
			$scope.hostInfo = data;
		});

		// Get sponsors
		$scope.sponsors = results[1].data;
		// Get News
		$scope.news = results[2].data;
		// Get Participants
		$scope.participants = results[3].data;
		// Get Tournaments
		$scope.tournamentsInfo = results[4].data;
	}, function(err) {
		console.log(err);
		console.log("Oh oh");
	});

	//Go to a list of meetups for this event
	$scope.goToMeetupList = function(eventName, eventDate, eventLocation) {
		//heyyeah
		//eventName = eventName.replace(" ", "%20");
		// var params = [eventName, eventDate, eventLocation];
		// sharedDataService.set(params);
		$state.go("app.meetupList", {
			"eventname" : eventName,
			"date" : eventDate,
			"location" : eventLocation
		}) //
	};

	//go to posted reviews for this event
	$scope.goToReview = function(eventName, eventDate, eventLocation, selectedTournament) {

		eventName = eventName.replace(" ", "%20");
		sharedDataService.set(selectedTournament);
		$state.go("app.writereview")
	}
});

//Meetup List controller, shows all meetups for a specific event
myApp.controller('meetupListController', ['$scope', '$http', '$state', '$stateParams', '$window',
function($scope, $http, $state, $stateParams, $window) {
	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	var now = new Date();
	var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

	$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '/meetups?date=' + $stateParams.date + '&location=' + $stateParams.location + '').success(function(data, status, headers) {

		$scope.meetupsInfo = angular.fromJson(data);
		console.log($scope.meetupsInfo);
		if ($scope.meetupsInfo.length == 0) {
			$scope.noMeetup = "Currently there are no Meetups available";
			console.log("hello");
		}

	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in meetupListController");
	});

	//Get Event Info from server
	$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location + '').success(function(data, status, headers) {

		$scope.eventInfo = angular.fromJson(data);
		var endDate = new Date($scope.eventInfo.event_end_date);
		$scope.cover = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(" + $scope.eventInfo.event_banner + ")";

		if (endDate <= now_utc)
			$scope.endDate = false;
		else
			$scope.endDate = true;

	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in eventPremiumSummaryController");
	});

	//Go to a specific meetup for this event
	$scope.goToMeetup = function(eventName, eventDate, eventLocation, meetupDate, meetupLocation) {
		$state.go("app.meetup", {
			"eventName" : eventName,
			"eventDate" : eventDate,
			"eventLocation" : eventLocation,
			"meetupDate" : meetupDate,
			"meetupLocation" : meetupLocation
		}) //
	}
}]);

//Meetup  controller, shows the details of a specific meetup
myApp.controller('meetupController', ['$scope', '$http', '$state', '$stateParams', '$window',
function($scope, $http, $state, $stateParams, $window) {
	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventName + '/meetups?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '').success(function(data, status, headers) {

		$scope.meetupsInfo = angular.fromJson(data);

		//        for(var i =0; i < meetupsInfo.length; i++){
		//            if ($scope.meetupsInfo[i].meetup_start_date == $stateParams.meetupDate && $scope.meetupsInfo[i].meetup_location == $stateParams.meetupLocation){
		//
		//            }
		//        }

		console.log($scope.meetupsInfo);
		if ($scope.meetupsInfo.length == 0) {
			$scope.noMeetup = "Currently there are no Meetups available";
			console.log("hello");
		}

	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in meetupListController");
	});

	//    var now = new Date();
	//    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

	//Get Event Info from server
	//    $http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location + '').
	//    success(function (data, status, headers) {
	//
	//        $scope.eventInfo = angular.fromJson(data);
	//        var endDate = new Date($scope.eventInfo.event_end_date);
	//        $scope.cover = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(" + $scope.eventInfo.event_banner + ")";
	//
	//        if (endDate <= now_utc)
	//            $scope.endDate = false;
	//        else
	//            $scope.endDate = true;
	//
	//    }).
	//    error(function (data, status, headers) {
	//        console.log("error in eventPremiumSummaryController");
	//    });

}]);

myApp.controller('eventSettingsController', function($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {
	$q.all([
	// Get Event Info
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + ''),
	// Tournaments
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation)]).then(function(results) {

		// Get Events
		$scope.event = results[0].data;
		// Get Tournaments
		$scope.tournamentsInfo = results[1].data;
		if ($scope.event.host == null)
			$scope.isHosted = false;
		else
			$scope.isHosted = true;

		console.log($scope.event);

		if ($scope.isHosted)
			hostedEventSettings($scope.event, $scope.tournamentsInfo);
		else
			regularEventSettings($scope.event, $scope.tournamentsInfo);

	}, function(err) {
		console.log(err);
		console.log("Oh oh");
	});

	var hostedEventSettings = function(event, tournamentsInfo) {
		//stuff will go here
		$scope.eventInfo = event;
		$scope.tournaments = tournamentsInfo[0].tournament_name;

	};
	var regularEventSettings = function(event, tournamentsInfo) {
		//console.log(tournamentsInfo[0]);
		$scope.eventInfo = event;
		$scope.tournament = tournamentsInfo[0].tournament_name;

	};

});
