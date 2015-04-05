var myApp = angular.module('organization', []);

myApp.controller('organizationProfileController', ['$scope', '$http', '$state', 'sharedDataService', '$window', '$stateParams',
function($scope, $http, $state, sharedDataService, $window, $stateParams) {
	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	$http.get('http://matchup.neptunolabs.com/matchup/organizations/' + $stateParams.organizationName + '', config).success(function(data, status, headers, config) {
		$scope.organization = angular.fromJson(data);
		$scope.cover = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(" + $scope.organization.organization_cover_photo + ")";
		$scope.profilePicture = "url(" + $scope.organization.organization_logo + ")";

		//get all users that belong to an organization
		$http.get('http://matchup.neptunolabs.com/matchup/organizations/' + $stateParams.organizationName + '/members', config).success(function(data, status, headers, config) {
			$scope.members = angular.fromJson(data);
			//get all users that belong to an organization
		$http.get('http://matchup.neptunolabs.com/matchup/organizations/' + $stateParams.organizationName + '/events', config).success(function(data, status, headers, config) {
			$scope.events = angular.fromJson(data);

		}).error(function(data, status, headers, config) {
			console.log("error in organization profile controller.");
		});

		}).error(function(data, status, headers, config) {
			console.log("error in organization profile controller.");
		});
	}).error(function(data, status, headers, config) {
		console.log("error in organization profile controller.");
	});

}]); 