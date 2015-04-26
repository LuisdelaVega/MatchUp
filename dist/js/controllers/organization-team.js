var myApp = angular.module('organization', []);

//Controller that gets the corresponding general information for a specific organization as well as all of its members and displays it in the Organization page.
myApp.controller('organizationProfileController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function($scope, $http, $state, $stateParams, $rootScope) {

	$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '').success(function(data, status, headers) {
		$scope.organization = data;

		//get all users that belong to an organization
		$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/members').success(function(data, status, headers) {
			$scope.members = data;
			//get all users that belong to an organization
			$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/events').success(function(data, status, headers) {
				$scope.events = data;
				//get all sponsors
				$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/sponsors').success(function(data, status, headers) {
					$scope.sponsors = data;

				}).error(function(data, status) {
					console.log("error in organization profile controller.");
				});

			}).error(function(data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in organization profile controller.");
			});

		}).error(function(data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in organization profile controller.");
		});
	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in organization profile controller.");
	});

}]);

myApp.controller('organizationEventsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function($scope, $http, $state, $stateParams, $rootScope) {
	$scope.organizationName = $stateParams.organizationName;

	$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/events').success(function(data) {
		$scope.organizationEvents = data;
	});

}]);

myApp.controller('organizationSponsorRequestsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function($scope, $http, $state, $stateParams, $rootScope) {
	$scope.organizationName = $stateParams.organizationName;
	$scope.newSponsor = {};

	$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '').success(function(data) {
		$scope.organization = data;
		console.log("hehnjihjikjikhujikohnjkol");
		console.log(data);

	});
	$http.get($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/requests').success(function(data) {
		$scope.sponsors = data;
	});

	$scope.requestSponsor = function() {
		if (!$scope.newSponsor.link || !$scope.newSponsor.description) {
			alert("Please fill out all the fields");
			return;
		}
		if ($scope.newSponsor.description.length > 511) {
			alert("Max character length for description is 511, nice try!");
			return;
		}
		if ($scope.newSponsor.link > 127) {
			alert("Max character length for the Sponsor link is 127, nice try!");
			return;

		} else {
			for(var i=0; $scope.sponsors.length > i; i++){
					if(!($scope.sponsors[i].request_sponsor_link.localeCompare($scope.newSponsor.link))){
					alert("You have already submitted a request to add a sponsor with this link.");
					$('#newRequestsModal').modal('hide');
					$scope.newSponsor = {};
					return;
				}
			}
			$http.post($rootScope.baseURL + '/matchup/organizations/' + $stateParams.organizationName + '/sponsors', $scope.newSponsor).success(function(data) {
				$scope.sponsors.push({
					"request_sponsor_link": $scope.newSponsor.link,
					"request_sponsor_description": $scope.newSponsor.description,
					"request_sponsor_status": 'Received'
				});
				$scope.newSponsor = {};
				$('#newRequestsModal').modal('hide');
			});

		}

	};

}]);

myApp.controller('teamProfileController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function($scope, $http, $state, $stateParams, $rootScope) {

	$http.get($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName).success(function(data) {
		$scope.teamProfile = data;
	});

	//get all users that belong to an organization
	$http.get($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName + '/members').success(function(data) {
		$scope.members = data;
	});
}]);
