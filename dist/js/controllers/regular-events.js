var myApp = angular.module('regular-events', []);

/* This controller will interact in two ways.
 * The controller can managae data of a regular event or of a tournament
 * Using angular we can choose what displays can be used through boolean variables and can use the same view for regular events and tournaments
 * This is because regular events lack alot of added features that are present in premium events and are in essence a single tournament
 *
 * This controller will determine if the data sent is either a tournament from a premium event or a regular event and act accordingly
 */
myApp.controller('tournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$window', '$state',
function($scope, $http, $stateParams, sharedDataService, $window, $state) {

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
		if ($scope.eventInfo.host == null)
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

					}).error(function(data, status) {

						if (status == 404 || status == 401 ||status == 400)
							$state.go("" + status);
						console.log("error in eventPremiumSummaryController");
					});
				}).error(function(data, status) {

					if (status == 404 || status == 401 ||status == 400)
						$state.go("" + status);
					console.log("error in eventPremiumSummaryController");
				});

			}).error(function(data, status) {

				if (status == 404 || status == 401 ||status == 400)
					$state.go("" + status);
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

					}).error(function(data, status) {

						if (status == 404 || status == 401 ||status == 400)
							$state.go("" + status);
						console.log("error in eventPremiumSummaryController");
					});
				}).error(function(data, status) {

					if (status == 404 || status == 401 ||status == 400)
						$state.go("" + status);
					console.log("error in eventPremiumSummaryController");
				});
			}).error(function(data, status) {

				if (status == 404 || status == 401 ||status == 400)
					$state.go("" + status);
				console.log("error in eventPremiumSummaryController");
			});
		}
	}).error(function(data, status) {

		if (status == 404 || status == 401 ||status == 400)
			$state.go("" + status);
		console.log("error in eventPremiumSummaryController");
	});

}]);
