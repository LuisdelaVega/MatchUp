var myApp = angular.module('user', []);

//Controller used to display the Users profile, manages certain user data such as basic information, profile pic, cover photo, the users teams, organizations and events.
myApp.controller('profileSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService, $q) {

	var customer = $stateParams.username;

	//Get basic Customer Information, cover photo and profile picture
	$http.get('http://136.145.116.232/matchup/profile/' + customer + '').success(function (data) {
		$scope.profileData = data;
	});

	//Get the teams this customer belongs to
	$http.get('http://136.145.116.232/matchup/profile/' + customer + '/teams').success(function (data) {
		var promiseArray = [];
		// Team the user belongs
		$scope.teams = data;
		// Get members for each team
		for (var i = 0; i < data.length; i++) {
			promiseArray.push($http.get('http://136.145.116.232/matchup/teams/' + data[i].team_name + '/members'));
		}

		// Resolve all promises
		$q.all(promiseArray).then(function (responseArray) {
			// Iterate through all responses
			for (var i = 0; i < responseArray.length; i++) {
				// Get team info
				var allTeams = responseArray[i].data;
				// Iterate through the members of each team
				for (var j = 0; j < allTeams.length; j++) {
					if (allTeams[j].is_captain)
					// Found captain
						$scope.teams[i].team_captain = allTeams[j].customer_tag;
				}
			}
		});
	});

	//Get the organization the customer belongs to
	$http.get('http://136.145.116.232/matchup/profile/' + customer + '/organizations').success(function (data) {
		$scope.organizations = data;
	}).error(function (data, status) {
		console.log(status);
	});

	$http.get('http://matchup.neptunolabs.com/matchup/profile/' + customer + '/events').success(function (data) {
		$scope.userEvents = data;
	});

	//function for going into a page that will display all the teams the customer belongs to
	$scope.goToTeams = function (username) {
		$state.go("app.userTeams", {
				"username": username
			}) //

	}

	//function for going into a page that will display all the organizations the customer belongs to
	$scope.goToUserOrganizations = function (user) {
		$state.go("app.userOrganizations", {
				"username": user
			}) //
	}

	//function for going into a page that will display all the events the customer has created
	$scope.goToUserEvents = function (user) {
		$state.go("app.userOrganizations", {
				"username": user
			}) //
	}

	//function for going into a page that will display the customers standings in different tournaments
	$scope.goToUserStandings = function (user) {
		$state.go("app.userOrganizations", {
				"username": user
			}) //
	}


});

//Controller used to display the Users Organizations page, manages data about the organizations a user belongs to.
myApp.controller('userOrganizationsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function ($scope, $http, $stateParams, $window, $state) {

		$scope.customerUsername = $stateParams.username;
		if ($scope.customerUsername == $window.sessionStorage.username)
			$scope.isUser = true;
		else
			$scope.isUser = false;

		$http.get('http://136.145.116.232/matchup/profile/' + $stateParams.username + '/organizations').success(function (data) {

			$scope.organizationsData = data;

		}).error(function (data, status) {
			console.log(status);
		});

		$scope.gotToOrganizationProfile = function (organizationName) {
			$state.go("app.organizationProfile", {
				"organizationName": organizationName
			});
		};

}]);

//Controller used to display the teams page for a user, manages data about the teams a user belongs to.
myApp.controller('userTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function ($scope, $http, $stateParams, $window, $state) {

		$scope.customerUsername = $stateParams.username;
		if ($scope.customerUsername == $window.sessionStorage.username)
			$scope.isUser = true;
		else
			$scope.isUser = false;

		$http.get('http://136.145.116.232/matchup/profile/' + $stateParams.username + '/teams').success(function (data) {
			$scope.teamsData = data;

		}).error(function (data, status) {
			console.log(status);
		});

		$scope.gotToTeamsProfile = function (teamName) {
			$state.go("app.teamProfile", {
				"teamName": teamName
			});
		};

}]);

myApp.controller('userEventsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function ($scope, $http, $stateParams, $window, $state) {
		$scope.username = $stateParams.username;

		$http.get('http://matchup.neptunolabs.com/matchup/profile/' + $stateParams.username + '/events').success(function (data) {
			$scope.userEvents = data;
		});

}]);

//Controller used to display the end users subscription and acces the profiles of thoses he is subscribed to
myApp.controller('mySubcriptionsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function ($scope, $http, $stateParams, $window, $state) {

		$scope.customerUsername = $window.sessionStorage.username;
		$scope.somebio = "I need to put some bio here, I know";

		$http.get('http://136.145.116.232/matchup/profile/' + $scope.customerUsername + '/subscriptions').success(function (data) {

			$scope.subscriptions = angular.fromJson(data);


		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
		});


}]);