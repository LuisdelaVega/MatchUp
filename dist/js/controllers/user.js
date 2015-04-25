var myApp = angular.module('user', []);

//Controller used to display the Users profile, manages certain user data such as basic information, profile pic, cover photo, the users teams, organizations and events.
myApp.controller('profileSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {

	var customer = $stateParams.username;

	//Get basic Customer Information, cover photo and profile picture
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '').success(function (data) {
		$scope.profileData = data;
	});



	//Get the teams this customer belongs to (PARA QUE SE USA ESTO??)
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '/teams').success(function (data) {
		var promiseArray = [];
		// Team the user belongs
		$scope.teams = data;
		// Get members for each team
		for (var i = 0; i < data.length; i++) {
			promiseArray.push($http.get($rootScope.baseURL + '/matchup/teams/' + data[i].team_name + '/members'));
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

	// MATCHUPS
	$http.get($rootScope.baseURL + '/matchup/profile/matchups?state=Past').success(function (data) {
		$scope.matchups = data;
		console.log(data);
	});

	//Get the organization the customer belongs to
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '/organizations').success(function (data) {
		$scope.organizations = data;
	}).error(function (data, status) {
		console.log(status);
	});

	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '/events').success(function (data) {
		$scope.userEvents = data;
	});


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


	$scope.gotToEditProfile = function () {
		sharedDataService.set($scope.profileData);
		$state.go("app.editProfile", {
			"username": $scope.me
		});
	};

	$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.me + '/subscriptions').success(function (data) {

		$scope.subscriptions = data;
		angular.forEach($scope.subscriptions, function (sub) {
			if ($scope.profileData.customer_username == sub.customer_username) {
				$scope.subStatus = true;
				return;
			}
		});

	}).error(function (data, status) {
		console.log(status);
	});

	$scope.subscribe = function () {
		if ($scope.subStatus) {
			//unsubscribe
			$http.delete($rootScope.baseURL + '/matchup/profile/' + $scope.profileData.customer_username).success(function (data) {
				$scope.subStatus = false;

			}).error(function (data, status) {
				console.log(status);
			});

		} else {
			//subscribe
			$http.post($rootScope.baseURL + '/matchup/profile/' + $scope.profileData.customer_username).success(function (data) {
				$scope.subStatus = true;

			}).error(function (data, status) {
				console.log(status);
			});

		}

	};

});

//Controller used to display the Users Organizations page, manages data about the organizations a user belongs to.
myApp.controller('userOrganizationsController', ['$scope', '$http', '$stateParams', '$window', '$state', '$rootScope',
function ($scope, $http, $stateParams, $window, $state, $rootScope) {

		$scope.customerUsername = $stateParams.username;
		if ($scope.customerUsername == $window.sessionStorage.username)
			$scope.isUser = true;
		else
			$scope.isUser = false;

		$http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/organizations').success(function (data) {

			$scope.organizationsData = data;

		}).error(function (data, status) {
			console.log(status);
		});

		$scope.goToOrganizationProfile = function (organizationName) {
			$state.go("app.organizationProfile", {
				"organizationName": organizationName
			});
		};

}]);

//Controller used to display the teams page for a user, manages data about the teams a user belongs to.
myApp.controller('userTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state', '$rootScope',
function ($scope, $http, $stateParams, $window, $state, $rootScope) {

		$scope.customerUsername = $stateParams.username;
		if ($scope.customerUsername == $window.sessionStorage.username)
			$scope.isUser = true;
		else
			$scope.isUser = false;

		$http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/teams').success(function (data) {
			$scope.teamsData = data;

		}).error(function (data, status) {
			console.log(status);
		});

}]);

myApp.controller('userEventsController', ['$scope', '$http', '$stateParams', '$window', '$state', '$rootScope',
function ($scope, $http, $stateParams, $window, $state, $rootScope) {
		$scope.username = $stateParams.username;

		$http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/events').success(function (data) {
			$scope.userEvents = data;
		});

}]);

//Controller used to display the end users subscription and acces the profiles of thoses he is subscribed to
myApp.controller('mySubcriptionsController', ['$scope', '$http', '$stateParams', '$window', '$state', '$rootScope',
function ($scope, $http, $stateParams, $window, $state, $rootScope) {

		$scope.customerUsername = $window.sessionStorage.username;
		$scope.somebio = "I need to put some bio here, I know";

		$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.customerUsername + '/subscriptions').success(function (data) {

			$scope.subscriptions = angular.fromJson(data);

		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
		});

		$scope.unsubscribe = function (user, index) {
			//unsubscribe
			$http.delete($rootScope.baseURL + '/matchup/profile/' + user).success(function (data) {
				$scope.subscriptions.splice(index, 1);

			}).error(function (data, status) {
				console.log(status);
			});

		};

}]);

myApp.controller('editProfileController', ['$scope', '$http', '$state', 'sharedDataService', '$rootScope', '$window', function ($scope, $http, $state, sharedDataService, $rootScope, $window) {
	$scope.user = sharedDataService.get();
	// Check if data service is empty
	if (Object.keys($scope.user).length == 0) {
		$http.get($rootScope.baseURL + '/matchup/profile/' + $window.sessionStorage.username).success(function (data) {
			$scope.user = data;
		});
	}

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
					if (element.id == "cover")
						$scope.user.customer_cover_photo = link;
					else
						$scope.user.customer_profile_pic = link;
				});
			}
			xhr.send(fd);

		}
		reader.readAsDataURL(photofile);
	};

	$scope.submitEditUser = function (valid) {
		if (valid) {
			var profile = {
				"first_name": $scope.user.customer_first_name,
				"last_name": $scope.user.customer_last_name,
				"tag": $scope.user.customer_tag,
				"profile_pic": $scope.user.customer_profile_pic,
				"cover": $scope.user.customer_cover_photo,
				"email": $scope.user.customer_email,
				"country": $scope.user.customer_country,
				"bio": $scope.user.customer_bio,
			};
			$http.put($rootScope.baseURL + "/matchup/profile", profile).success(function () {
				$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				})
			});
		}
	}
}]);

// REUSANDO este controller en my matchups y el see more en el profile
myApp.controller('matchupsController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {
	
	if ($stateParams.username == $scope.me)
			$scope.isUser = true;
		else
			$scope.isUser = false;

		$scope.user = $stateParams.username;
	
	$http.get($rootScope.baseURL + '/matchup/profile/matchups?state=Past').success(function (data) {
		console.log(data);
		$scope.pastMatchups = data;
		//		data[0].details[0].score = 2;
		//		data[0].details[1].score = 1;
		//		data[0].station_number=1;
		
		//		console.log($scope.pastMatchups);
	});
});