var myApp = angular.module('user', []);

myApp.controller('ProfileController', function($scope, $state, sharedDataService) {

	$scope.customerUsername = sharedDataService.get();
});

myApp.controller('profileSummaryController', function($scope, $state, $http, $stateParams, sharedDataService, $window) {

	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	var customer = $stateParams.username;

	//Get basic Customer Information, cover photo and profile picture

	$http.get('http://136.145.116.232/matchup/profile/' + customer + '', config).success(function(data) {
		$scope.profileData = angular.fromJson(data);
		$scope.myProfile = $scope.profileData.my_profile;
		$scope.userCover = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(" + $scope.profileData.customer_cover_photo + ")";
		$scope.profilePicture = "url(" + $scope.profileData.customer_profile_pic + ")";
		//console.log($scope.profileData.customer_username);

	}).error(function(data, status) {

		if (status == 404 || status == 401)
			$state.go(status.toString);
	}).then(function() {
		customerInfo(customer);
	});

	function customerInfo(customer) {
		console.log(customer);

		//Get the teams the customer belongs to
		$http.get('http://136.145.116.232/matchup/profile/' + customer + '/teams', config).success(function(data) {

			$scope.getTeams = angular.fromJson(data);
			$scope.teams = [];
			for (var i = 0; i < $scope.getTeams.length; i++) {
				//Get the team information and players
				var captain;
				$http.get('http://136.145.116.232/matchup/teams/' + $scope.getTeams[i].team_name, config).success(function(data) {
					$scope.teamData = angular.fromJson(data);
					console.log($scope.teamData);
					//Look for the team captain
					for (var j = 0; j < $scope.teamData.players.length; j++) {
						if ($scope.teamData.players[j].is_captain) {
							captain = $scope.teamData.players[j].customer_tag;
						}
					}
					$scope.teamData.info.team_captain = captain;
					$scope.teams.push($scope.teamData.info);
				}).error(function(data, status) {

					if (status == 404 || status == 401)
						$state.go(status.toString);
				});
			}

		}).error(function(data, status) {

			if (status == 404 || status == 401)
				$state.go(status.toString);
		});

		$http.get('http://136.145.116.232/matchup/profile/' + customer + '/organizations', config).success(function(data) {

			$scope.organizations = angular.fromJson(data);

		}).error(function(data, status) {

			if (status == 404 || status == 401)
				$state.go(status.toString);
		});
	}


	$scope.goToTeams = function(username) {
		$state.go("app.userTeams", {
			"username" : username
		}) //

	}
	
		$scope.goToUserOrganizations = function(user){
		$state.go("app.userOrganizations", {
			"username" : user
		}) //
	}
	
	$scope.goToUserEvents = function(user){
		$state.go("app.userOrganizations", {
			"username" : user
		}) //
	}
	
	$scope.goToUserStandings = function(user){
		$state.go("app.userOrganizations", {
			"username" : user
		}) //
	}
	
	
});

myApp.controller('profileEventsController', ['$scope', '$http', '$stateParams', '$window', 'sharedDataService', '$state',
function($scope, $http, $stateParams, $window, sharedDataService, $state) {

	console.log("entered profileEventsController");

	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};
 	$http.get('http://136.145.116.232/matchup/profile/' + $stateParams.user + '', config).success(function(data, status, headers, config) {
		$scope.events = angular.fromJson(data);

		



	}).error(function(data, status, headers, config) {
		console.log("error in game profile controller.");
	});


	

}]);

myApp.controller('myMatchupViewController', ['$scope', '$http', '$stateParams',
function($scope, $http, $stateParams) {

	$scope.competitors = ['img/ron.jpg', 'img/ronpaul.gif'];

}]);

myApp.controller('profileTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function($scope, $http, $stateParams, $window, $state) {

	$scope.customerUsername = $stateParams.username;

	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	$http.get('http://136.145.116.232/matchup/profile/' + $stateParams.username + '/teams', config).success(function(data) {

		$scope.teams = angular.fromJson(data);

	}).error(function(data, status) {

		if (status == 404 || status == 401)
			$state.go(status.toString);
	});

	$scope.gotToProfile = function(customerUsername) {
		$state.go("app.profile.summary", {
			"username" : customerUsername
		});
	};

}]);

myApp.controller('userOrganizationsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function($scope, $http, $stateParams, $window, $state) {

	$scope.customerUsername = $stateParams.username;
	if($scope.customerUsername == $window.sessionStorage.user)
		$scope.isUser= true;
	else
		$scope.isUser= false;

	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	$http.get('http://136.145.116.232/matchup/profile/' + $stateParams.username + '/organizations', config).success(function(data) {

		$scope.organizationsData = angular.fromJson(data);

	}).error(function(data, status) {

		if (status == 404 || status == 401)
			$state.go(status.toString);
	});

	$scope.gotToOrganizationProfile = function(organizationName) {
		$state.go("app.organizationProfile", {
			"organizationName" : organizationName
		});
	};

}]);


myApp.controller('userTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function($scope, $http, $stateParams, $window, $state) {

	$scope.customerUsername = $stateParams.username;
	if($scope.customerUsername == $window.sessionStorage.user)
		$scope.isUser= true;
	else
		$scope.isUser= false;

	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	$http.get('http://136.145.116.232/matchup/profile/' + $stateParams.username + '/teams', config).success(function(data) {

		$scope.teamsData = angular.fromJson(data);

	}).error(function(data, status) {

		if (status == 404 || status == 401)
			$state.go(status.toString);
	});

	$scope.gotToTeamsProfile = function(teamName) {
		$state.go("app.teamProfile", {
			"teamName" : teamName
		});
	};

}]);



myApp.controller('mySubcriptionsController', ['$scope', '$http', '$stateParams', '$window', '$state',
function($scope, $http, $stateParams, $window, $state) {

	$scope.customerUsername = $window.sessionStorage.user;
	$scope.somebio = "I need to put some bio here, I know";
	
	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};
	$http.get('http://136.145.116.232/matchup/profile/' + $scope.customerUsername + '/subscriptions', config).success(function(data) {

		$scope.subscriptions = angular.fromJson(data);
		

	}).error(function(data, status) {

		if (status == 404 || status == 401)
			$state.go(status.toString);
	});


}]);



myApp.controller('subscriptionsController', ['$scope', '$http',
function($scope, $http) {

	$scope.isSubscribed = '-positive';

	$scope.toggleSubscribe = function() {
		if ($scope.isSubscribed == '-positive')
			$scope.isSubscribed = '';
		else
			$scope.isSubscribed = '-positive';
	};

}]);
