var myApp = angular.module('regular-events', []);

/* This controller will interact in two ways.
 * The controller can managae data of a regular event or of a tournament
 * Using angular we can choose what displays can be used through boolean variables and can use the same view for regular events and tournaments
 * This is because regular events lack alot of added features that are present in premium events and are in essence a single tournament
 *
 * This controller will determine if the data sent is either a tournament from a premium event or a regular event and act accordingly
 */
myApp.controller('tournamentController', ['$scope', '$http', '$stateParams', 'sharedDataService', '$q', '$state', '$rootScope',
function ($scope, $http, $stateParams, sharedDataService, $q, $state, $rootScope) {

		var now_utc = new Date();

		// Vairables that control what is shown in the tournament page
		$scope.competitorsTab = false;
		$scope.standingsTab = false;
		$scope.groupStageTab = false;
		$scope.roundsTab = false;
		$scope.bracketTab = false;
		$scope.canRegister = false;

		// Get event Info
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location)
			.success(function (data, status) {
			$scope.eventInfo = data;

			// Check if event is premium
			if ($scope.eventInfo.host)
				getPremiumTournament();
			else
				getRegularTournament();
		});

		var getPremiumTournament = function () {
			// Get Tournament Information
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function (data) {
				$scope.tournamentInfo = data;
				$q.all(
						[
							// Get Organization
							$http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.eventInfo.host),
							// Competitors
							$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $stateParams.tournament + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location),

							// Get Sponsors
							$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/sponsors?date=' + $stateParams.date + '&location=' + $stateParams.location),
						])
					.then(function (results) {
						// Get Organization
						$scope.hostInfo = results[0].data;
						// Get Competitors
						$scope.competitors = results[1].data;
						// Get sponsors
						$scope.sponsors = results[2].data;
						initStuff();
					}, function (err) {
						console.log(err);
						console.log("Oh oh");
					});
			});

		}


		var getRegularTournament = function () {
			// get tournaments
			$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments?date=' + $stateParams.date + '&location=' + $stateParams.location)
				.then(function (data) {
					$scope.tournamentInfo = data.data[0];
					$scope.requiresTeam = $scope.tournamentInfo.is_team_based;
					if ($scope.tournamentInfo.tournament_format == 'Two Stage')
						$scope.groupStage = true;
					else
						$scope.groupStage = false;
					$q.all(
						[
							// Get Creator
							$http.get($rootScope.baseURL + '/matchup/profile/' + $scope.eventInfo.creator),
							// Competitors
							$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments/' + $scope.tournamentInfo.tournament_name + '/competitors?date=' + $stateParams.date + '&location=' + $stateParams.location),

							// Get Sponsors
							$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/sponsors?date=' + $stateParams.date + '&location=' + $stateParams.location),
						])
						.then(function (results) {
							// Get Organization
							$scope.hostInfo = results[0].data;
							// Get Competitors
							$scope.competitors = results[1].data;
							initStuff();
						}, function (err) {
							console.log(err);
							console.log("Oh oh");
						});
				});
		}


		var initStuff = function () {
			
			var start_date = new Date($scope.tournamentInfo.tournament_start_date);
			// Check if ongoing
			if (now_utc.getTime() > start_date.getTime()) {
				// Tournament Started
				$scope.standingsTab = true;

			} else
				// Tournament not started
				$scope.competitorsTab = true;

			// Check registration deadline with current time
			$scope.canRegister = (new Date($scope.eventInfo.event_registration_deadline)).getTime() > now_utc.getTime();
		}

}]);