var myApp = angular.module('regular-events', []);

//If premium event with multiple tournaments. tournament that is to be displayed has to be passed using SharedDataService
myApp.controller('tournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$window',
function($scope, $http, $stateParams, sharedDataService, $window) {

	var now = new Date();
	var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

	var config = {
		headers : {
			'Authorization' : "Bearer " + $window.sessionStorage.token
		}
	};

	$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location + '', config).success(function(data, status, headers, config) {

		$scope.eventInfo = angular.fromJson(data);
		console.log($scope.eventInfo);
		if($scope.eventInfo.host == null)
			$scope.isHosted = false;
		else
			$scope.isHosted = true;
	console.log($scope.isHosted);

		var startDate = new Date($scope.eventInfo.event_start_date);
		$scope.cover = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(" + $scope.eventInfo.event_banner + ")";

		if (startDate > now_utc)
			$scope.isOngoing = false;
		else
			$scope.isOngoing = true;

		if ($scope.isHosted) {
			console.log("this event is hosted");

			$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '?date=' + $stateParams.date + '&location=' + $stateParams.location + '', config).success(function(data, status, headers, config) {

				$scope.currentTournament = angular.fromJson(data);
				$scope.requiresTeam = $scope.currentTournament.is_team_based;
				//get host info
				$http.get('http://136.145.116.232/matchup/organizations/' + $scope.eventInfo.host + '', config).success(function(data, status, headers, config) {

					$scope.host = angular.fromJson(data);
					console.log($scope.host);
					$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location + '', config).success(function(data, status, headers, config) {
						$scope.competitors = angular.fromJson(data);
						$scope.numComp = $scope.competitors.length;
						console.log($scope.competitors);

					}).error(function(data, status, headers, config) {
						console.log("error in eventPremiumSummaryController");
					});
				}).error(function(data, status, headers, config) {
					console.log("error in eventPremiumSummaryController");
				});

			}).error(function(data, status, headers, config) {
				console.log("error in eventPremiumSummaryController");
			});

		} else {
			$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '/tournaments?date=' + $stateParams.date + '&location=' + $stateParams.location + '', config).success(function(data, status, headers, config) {

				var tournamentJSON = angular.fromJson(data);
				$scope.currentTournament = tournamentJSON[0];
				$scope.requiresTeam = $scope.currentTournament.is_team_based;
				//console.log($scope.currentTournament);
				if ($scope.currentTournament.tournament_format == 'Two Stage')
					$scope.groupStage = true;
				else
					$scope.groupStage = false;
				//Getting Competitors
				///matchup/profile/
				$http.get('http://136.145.116.232/matchup/profile/' + $scope.eventInfo.creator + '', config).success(function(data, status, headers, config) {
					///matchup/events/:event/tournaments/:tournament/competitors?date=date&location=string

					$scope.creator = angular.fromJson(data);

					$http.get('http://136.145.116.232/matchup/events/' + $stateParams.eventname + '/tournaments/' + $scope.currentTournament.tournament_name + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location + '', config).success(function(data, status, headers, config) {
						///matchup/events/:event/tournaments/:tournament/competitors?date=date&location=string

						$scope.competitors = angular.fromJson(data);
						$scope.numComp = $scope.competitors.length;
						console.log($scope.competitors);

					}).error(function(data, status, headers, config) {
						console.log("error in eventPremiumSummaryController");
					});
				}).error(function(data, status, headers, config) {
					console.log("error in eventPremiumSummaryController");
				});
			}).error(function(data, status, headers, config) {
				console.log("error in eventPremiumSummaryController");
			});
		}
	}).error(function(data, status, headers, config) {
		console.log("error in eventPremiumSummaryController");
	});

}]);
