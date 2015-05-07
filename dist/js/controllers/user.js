var myApp = angular.module('user', []);

//Controller used to display the Users profile, manages certain user data such as basic information, profile pic, cover photo, the users teams, organizations and events.
myApp.controller('profileSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {

	var customer = $stateParams.username;

	//Get basic Customer Information, cover photo and profile picture
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '').success(function (data) {
		$scope.profileData = data;
	});

	// Standings
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '/standings').success(function (data) {
		$scope.standings = data;
		console.log(data);
	});

	// MATCHUPS
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '/matchups?state=Past').success(function (data) {
		$scope.matchups = data;
		console.log(data);
	});

	//Get the teams this customer belongs to
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

	//Get the organization the customer belongs to
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '/organizations').success(function (data) {
		$scope.organizations = data;
	}).error(function (data, status) {
		console.log(status);
	});

	// Get events
	$http.get($rootScope.baseURL + '/matchup/profile/' + customer + '/events').success(function (data) {
		$scope.userEvents = data;
	});

	//function for going into a page that will display all the organizations the customer belongs to
	$scope.goToUserOrganizations = function (user) {
		$state.go("app.userOrganizations", {
			"username": user
		});
	};
	//function for going into a page that will display all the events the customer has created
	$scope.goToUserEvents = function (user) {
		$state.go("app.userOrganizations", {
			"username": user
		});
	};
	//function for going into a page that will display the customers standings in different tournaments
	$scope.goToUserStandings = function (user) {
		$state.go("app.userOrganizations", {
			"username": user
		});
	};

	$scope.gotToEditProfile = function () {
		sharedDataService.set($scope.profileData);
		$state.go("app.editProfile", {
			"username": $scope.me
		});
	};

	if ($scope.me != customer) {

		$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.me + '/subscriptions').success(function (data) {

			$scope.subscriptions = data;
			angular.forEach($scope.subscriptions, function (sub) {
				if (customer == sub.customer_username) {
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
	}

});

//Controller used to display the Users Organizations page, manages data about the organizations a user belongs to.
myApp.controller('userOrganizationsController', ['$scope', '$http', '$stateParams', '$window', '$state', '$rootScope',
function ($scope, $http, $stateParams, $window, $state, $rootScope) {

		$scope.customerUsername = $stateParams.username;
		if ($scope.customerUsername == localStorage.getItem("username"))
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

		$http.get($rootScope.baseURL + '/matchup/profile/' + localStorage.getItem("username") + '/requests').success(function (data) {
			$scope.organizationRequests = data;
		});

		$scope.organizationName = $stateParams.organizationName;
		$scope.newOrganization = {
			"request_status": "Received"
		};

		$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.me + '/requests').success(function (data) {
			$scope.organizations = data;
		});

		$scope.requestOrganization = function () {
			if (!$scope.newOrganization.request_organization_name || !$scope.newOrganization.request_description) {
				alert("Please fill out all the fields");
				return;
			}
			if ($scope.newOrganization.request_description.length > 511) {
				alert("Max character length for description is 511, nice try!");
				return;
			}
			if ($scope.newOrganization.request_organization_name.length > 127) {
				alert("Max character length for the Sponsor link is 127, nice try!");
				return;

			} else {
				for (var i = 0; $scope.organizations.length > i; i++) {
					if (!($scope.organizations[i].request_organization_name.localeCompare($scope.newOrganization.request_organization_name))) {
						alert("You have already submitted a request for this organization.");
						$('#newRequestsModal').modal('hide');
						$scope.newOrganization = {
							"request_status": "Received"
						};
						return;
					}
				}
				$http.post($rootScope.baseURL + '/matchup/organizations/', {
					"name": $scope.newOrganization.request_organization_name,
					"description": $scope.newOrganization.request_description
				}).success(function (data) {
					$scope.organizations.push($scope.newOrganization);
					$scope.newOrganization = {
						"request_status": "Received"
					};
					$('#newRequestsModal').modal('hide');
				});

			}

		};

}]);

//Controller used to display the teams page for a user, manages data about the teams a user belongs to.
myApp.controller('userTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state', '$rootScope',
function ($scope, $http, $stateParams, $window, $state, $rootScope) {

		$scope.customerUsername = $stateParams.username;
		if ($scope.customerUsername == localStorage.getItem("username"))
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
myApp.controller('mySubcriptionsController', ['$scope', '$http', '$stateParams', '$state', '$rootScope',
function ($scope, $http, $stateParams, $state, $rootScope) {

		$scope.subMatches = [];
		$scope.matches = [];
		$scope.subIndex = 0;

		$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.me + '/subscriptions').success(function (data) {
			$scope.subscriptions = data;
			$scope.getSubMatches(0);
		});

		$scope.getSubMatches = function (index) {
			$scope.subIndex = index;
			// MATCHUPS
			$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.subscriptions[index].customer_username + '/matchups?state=Past').success(function (data) {
				$scope.matches = data;
			});
		};

		$scope.unsubscribe = function (user, index) {
			//unsubscribe
			$http.delete($rootScope.baseURL + '/matchup/profile/' + user).success(function (data) {
				// Not deleting the first one
				if ($scope.subscriptions.length > 1) {
					// Deleting the last one
					if ((index + 1) == $scope.subscriptions.length) {
						$scope.subIndex = index - 1;
						$scope.getSubMatches(index - 1);
					} else {
						// deleting someone in the middle
						$scope.subIndex = index;
						$scope.getSubMatches(index);
					}
				}
				// Deleting the first one
				else {
					$scope.matches = [];
				}
				$scope.subscriptions.splice(index, 1);
			}).error(function (data, status) {
				console.log(status);
			});

		};

}]);

myApp.controller('editProfileController', ['$scope', '$http', '$state', 'sharedDataService', '$rootScope', '$window',
function ($scope, $http, $state, sharedDataService, $rootScope, $window) {
		$scope.user = sharedDataService.get();
		// Check if data service is empty
		if (Object.keys($scope.user).length == 0) {
			$http.get($rootScope.baseURL + '/matchup/profile/' + localStorage.getItem("username")).success(function (data) {
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
				};
				xhr.send(fd);

			};
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
					"customer_paypal_info": $scope.user.customer_paypal_info
				};
				$http.put($rootScope.baseURL + "/matchup/profile", profile).success(function () {
					$state.go("app.userProfile", {
						"username": localStorage.getItem("username")
					});
				});
			}
		};
}]);

// REUSANDO este controller en my matchups y el see more en el profile
myApp.controller('matchupsController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {

	if ($stateParams.username == $scope.me)
		$scope.isUser = true;
	else
		$scope.isUser = false;

	$scope.user = $stateParams.username;

	$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.user + '/matchups?state=Past').success(function (data) {
		console.log(data);
		$scope.pastMatchups = data;
		//		data[0].details[0].score = 2;
		//		data[0].details[1].score = 1;
		//		data[0].station_number=1;

		//		console.log($scope.pastMatchups);
	});
});

myApp.controller('userStandingsController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {

	$scope.user = $stateParams.username;

	// Standings
	$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.user + '/standings').success(function (data) {
		$scope.standings = data;
	});
});

myApp.controller('organizationRequestsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function ($scope, $http, $state, $stateParams, $rootScope) {
		$scope.organizationName = $stateParams.organizationName;
		$scope.newOrganization = {
			"request_status": "Received"
		};

		$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.me + '/requests').success(function (data) {
			$scope.organizations = data;
		});

		$scope.requestOrganization = function () {
			if (!$scope.newOrganization.request_organization_name || !$scope.newOrganization.request_description) {
				alert("Please fill out all the fields");
				return;
			}
			if ($scope.newOrganization.request_description.length > 511) {
				alert("Max character length for description is 511, nice try!");
				return;
			}
			if ($scope.newOrganization.request_organization_name.length > 127) {
				alert("Max character length for the Sponsor link is 127, nice try!");
				return;

			} else {
				for (var i = 0; $scope.organizations.length > i; i++) {
					if (!($scope.organizations[i].request_organization_name.localeCompare($scope.newOrganization.request_organization_name))) {
						alert("You have already submitted a request for this organization.");
						$('#newRequestsModal').modal('hide');
						$scope.newOrganization = {
							"request_status": "Received"
						};
						return;
					}
				}
				$http.post($rootScope.baseURL + '/matchup/organizations/', {
					"name": $scope.newOrganization.request_organization_name,
					"description": $scope.newOrganization.request_description
				}).success(function (data) {
					$scope.organizations.push($scope.newOrganization);
					$scope.newOrganization = {
						"request_status": "Received"
					};
					$('#newRequestsModal').modal('hide');
				});

			}

		};

}]);

//Controller used to display the teams page for a user, manages data about the teams a user belongs to.
myApp.controller('paySuccessfulController', ['$scope', '$http', '$stateParams', '$state', '$rootScope',
function ($scope, $http, $stateParams, $state, $rootScope) {

		$http.get($rootScope.baseURL + '/matchup/paypal/' + localStorage.getItem('payKey')).success(function (data) {
			$scope.payInfo = data;
			console.log(data);

		}).error(function (data, status) {
			console.log(status);
		});

}]);