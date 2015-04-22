var myApp = angular.module('organization', []);

//Controller that gets the corresponding general information for a specific organization as well as all of its members and displays it in the Organization page.
myApp.controller('organizationProfileController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function ($scope, $http, $state, $stateParams, $rootScope) {

		$http.get($rootScope.baseURL +'/matchup/organizations/' + $stateParams.organizationName + '').success(function (data, status, headers) {
			$scope.organization = data;

			//get all users that belong to an organization
			$http.get($rootScope.baseURL +'/matchup/organizations/' + $stateParams.organizationName + '/members').success(function (data, status, headers) {
				$scope.members = data;
				//get all users that belong to an organization
				$http.get($rootScope.baseURL +'/matchup/organizations/' + $stateParams.organizationName + '/events').success(function (data, status, headers) {
					$scope.events = data;

				}).error(function (data, status) {

					if (status == 404 || status == 401 || status == 400)
						$state.go("" + status);
					console.log("error in organization profile controller.");
				});

			}).error(function (data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in organization profile controller.");
			});
		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in organization profile controller.");
		});

}]);


myApp.controller('organizationEventsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', function ($scope, $http, $state, $stateParams, $rootScope) {
	$scope.organizationName = $stateParams.organizationName;

	$http.get($rootScope.baseURL +'/matchup/organizations/' + $stateParams.organizationName + '/events').success(function (data) {
		$scope.organizationEvents = data;
	});

}]);

myApp.controller('teamProfileController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', function ($scope, $http, $state, $stateParams, $rootScope) {

	$http.get($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName).success(function (data) {
		$scope.teamProfile = data;
	});

	//get all users that belong to an organization
	$http.get($rootScope.baseURL + '/matchup/teams/' + $stateParams.teamName + '/members').success(function (data) {
		$scope.members = data;
	});
}]);