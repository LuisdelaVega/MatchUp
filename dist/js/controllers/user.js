var myApp = angular.module('user', []);

//Controller used to display the Users profile, manages certain user data such as basic information, profile pic, cover photo, the users teams, organizations and events.
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

		if (status == 404 || status == 401 ||status == 400)
			$state.go("" + status);
	}).then(function() {
		customerInfo(customer);
	});

	function customerInfo(customer) {
		console.log(customer);

		//Get the teams this customer belongs to
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

					if (status == 404 || status == 401 ||status == 400)
						$state.go("" + status);
				});
			}

		}).error(function(data, status) {

			if (status == 404 || status == 401 ||status == 400)
				$state.go("" + status);
		});
		
		//Get the organization the customer belongs to
		$http.get('http://136.145.116.232/matchup/profile/' + customer + '/organizations', config).success(function(data) {

			$scope.organizations = angular.fromJson(data);

		}).error(function(data, status) {

			if (status == 404 || status == 401 ||status == 400)
				$state.go("" + status);
		});
	}

	//function for going into a page that will display all the teams the customer belongs to
	$scope.goToTeams = function(username) {
		$state.go("app.userTeams", {
			"username" : username
		}) //

	}
	
	//function for going into a page that will display all the organizations the customer belongs to
	$scope.goToUserOrganizations = function(user){
		$state.go("app.userOrganizations", {
			"username" : user
		}) //
	}
	
	//function for going into a page that will display all the events the customer has created
	$scope.goToUserEvents = function(user){
		$state.go("app.userOrganizations", {
			"username" : user
		}) //
	}
	
	//function for going into a page that will display the customers standings in different tournaments
	$scope.goToUserStandings = function(user){
		$state.go("app.userOrganizations", {
			"username" : user
		}) //
	}
	
	
});

//Controller used to display the Users Organizations page, manages data about the organizations a user belongs to.
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

		if (status == 404 || status == 401 ||status == 400)
			$state.go("" + status);
	});

	$scope.gotToOrganizationProfile = function(organizationName) {
		$state.go("app.organizationProfile", {
			"organizationName" : organizationName
		});
	};

}]);

//Controller used to display the teams page for a user, manages data about the teams a user belongs to.
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

		if (status == 404 || status == 401 ||status == 400)
			$state.go("" + status);
	});

	$scope.gotToTeamsProfile = function(teamName) {
		$state.go("app.teamProfile", {
			"teamName" : teamName
		});
	};

}]);

//Controller used to display the end users subscription and acces the profiles of thoses he is subscribed to
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

		if (status == 404 || status == 401 ||status == 400)
			$state.go("" + status);
	});


}]);

