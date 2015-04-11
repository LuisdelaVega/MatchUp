var myApp = angular.module('home', []);

myApp.controller('generalViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window',
function ($scope, $http, $state, sharedDataService, $window) {


		$http.get('http://matchup.neptunolabs.com/matchup/events?type=hosted&state=upcoming').success(function (data, status, headers) {
			$scope.hostedEvents = data;
			console.log($scope.hostedEvents);

			$http.get('http://matchup.neptunolabs.com/matchup/events?type=hosted&state=live').success(function (data, status, headers) {

				$scope.hostedLiveEvents = data;
				console.log($scope.hostedEvents);

				$http.get('http://matchup.neptunolabs.com/matchup/events?type=regular&state=upcoming').success(function (data, status, headers) {

					$scope.regularEvents = data;

					$http.get('http://matchup.neptunolabs.com/matchup/events?type=regular&state=live').success(function (data, status, headers) {
						$scope.regularLiveEvents = data;

					}).error(function (data, status) {

						if (status == 404 || status == 401 || status == 400)
							$state.go("" + status);
						console.log("error in home controller. obtaining hosted upcoming events");
					});

				}).error(function (data, status) {

					if (status == 404 || status == 401 || status == 400)
						$state.go("" + status);
					console.log("error in home controller. obtaining hosted upcoming events");
				});

			}).error(function (data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in home controller. obtaining hosted upcoming events");
			});
		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in home controller. obtaining hosted upcoming events");
		});

}]);

myApp.controller('homeViewController', ['$scope', '$http', '$state', 'sharedDataService', '$q', '$rootScope',
function ($scope, $http, $state, sharedDataService, $q, $rootScope) {

		$q.all(
			[
				$http.get($rootScope.baseURL + '/matchup/events?type=hosted&state=upcoming'),
    			$http.get($rootScope.baseURL + '/matchup/events?type=regular&state=upcoming'),
				$http.get($rootScope.baseURL + '/matchup/events?state=live'),
				$http.get($rootScope.baseURL + '/matchup/popular/games'),

  			]).then(function (results) {
			$scope.hostedEvents = results[0].data;
			$scope.regularEvents = results[1].data;
			$scope.liveEvents = results[2].data;
			$scope.popularGames = results[3].data;

		});

		$scope.goToGameProfile = function (gameName, gameImage) {
			var params = [gameName, gameImage];
			sharedDataService.set(params);
			$state.go('app.gameProfile', {
				"gamename": gameName
			});
		};

}]);


 myApp.controller('searchController', ['$scope', '$http', '$state', '$window', '$stateParams', function ($scope, $http, $state, $window, $stateParams) {

              $http.get('http://136.145.116.232/matchup/search/' +  $stateParams.query + '').
             success(function (data, status, headers) {

                 console.log('http://136.145.116.232/matchup/search/' + $stateParams.query + '');

                 $scope.searchData = angular.fromJson(data);
                 console.log($scope.searchData);

                 $scope.liveEvents = $scope.searchData.events.live;
                 $scope.pastEvents = $scope.searchData.events.past;
                 $scope.premiumEvents = $scope.searchData.events.hosted;
                 $scope.regularEvents = $scope.searchData.events.regular;
                 $scope.users = $scope.searchData.users;
                 $scope.teams = $scope.searchData.teams;
                 $scope.organizations = $scope.searchData.organizations;
                 $scope.games = $scope.searchData.games;
                 $scope.genres = $scope.searchData.genres;

                 //sharedDataService.set($scope.searchData);
             }).
             error(function (data, status, headers) {
                 console.log("error in search controller");
             });
 
       

 
      


 }]);
/*
 myApp.controller('searchResultController', ['$scope', '$stateParams', '$state', '$http', '$window', function ($scope, $stateParams, $state, $http, $window) {

 $scope.resultType = $stateParams.type;

 console.log($scope.resultType);

 var searchData = sharedDataService.get();

 $scope.live = false;
 $scope.past = false;
 $scope.hosted = false;
 $scope.regular = false;
 $scope.users = false;
 $scope.teams = false;
 $scope.organizations = false;
 $scope.games = false;
 $scope.genres = false;

 if ($scope.resultType == 'Live'){
 $scope.searchData = searchData.events.live;
 $scope.live = true;
 }
 else if ($scope.resultType == 'Past'){
 $scope.searchData = searchData.events.past;
 $scope.past = true;
 }
 else if ($scope.resultType == 'Premium'){
 $scope.searchData = searchData.events.hosted;
 $scope.hosted = true;
 }
 else if ($scope.resultType == 'Regular'){
 $scope.searchData = searchData.events.regular;
 $scope.regular = true;
 }
 else if ($scope.resultType == 'Users'){
 $scope.searchData = searchData.users;
 $scope.users = true;
 }
 else if ($scope.resultType == 'Teams'){
 $scope.searchData = searchData.teams;
 $scope.teams = true;
 }
 else if ($scope.resultType == 'Organizations'){
 $scope.searchData = searchData.organizations;
 $scope.organizations = true;
 }
 else if ($scope.resultType == 'Games'){
 $scope.searchData = searchData.games;
 $scope.games = true;
 }
 else if ($scope.resultType == 'Genres'){
 $scope.searchData = searchData.genres;
 $scope.genres = true;
 }

 $scope.goToEvent = function(eventName, date, location){

 eventName = eventName.replace(" ", "%20");
 var params = [eventName, date, location];

 var config = {
 headers: {
 'Authorization': "Bearer "+ $window.sessionStorage.token
 }
 };

 $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'').
 success(function(data, status, headers) {

 var eventData = angular.fromJson(data);

 var isHosted = eventData.is_hosted;

 sharedDataService.set(params);

 if(isHosted){
 $state.go('app.eventpremium.summary', {"eventname": eventName, "date": date, "location": location});
 }
 else{
 $state.go('app.regularevent', {"eventname": eventName, "date": date, "location": location});
 }

 }).
 error(function(data, status, headers) {
 console.log("error in goToEvent");
 });

 };

 $scope.goToGameProfile = function (gameName, gameImage) {
 var params = [gameName, gameImage];
 sharedDataService.set(params);
 $state.go('app.game.summary', {"gamename": gameName});
 };

 }]);
/*
 myApp.controller('popularGameViewController', ['$scope', '$http', '$state', '$window', function ($scope, $http, $state, $window) {

 var allGames = [ ];
 $scope.popularGames = [];

 var config = {
 headers: {
 'Authorization': "Bearer "+ $window.sessionStorage.token
 }
 };

 $http.get('http://matchup.neptunolabs.com/matchup/popular/games').
 success(function(data, status, headers) {

 allGames = angular.fromJson(data);

 for(var i = 0; i <= 6; i++){
 if(allGames.length > 0)
 $scope.popularGames.push(allGames.pop());
 }

 console.log($scope.popularGames);
 }).
 error(function(data, status, headers) {
 console.log("error in popular games. popular game view");
 });

 $scope.add = function () {
 if(allGames.length > 0)
 $scope.popularGames.push(allGames.pop());
 $scope.$broadcast('scroll.infiniteScrollComplete');
 };

 $scope.allGamesIsEmpty = function () {
 return allGames.length > 0;
 };

 $scope.goToGameProfile = function (gameName, gameImage) {
 var params = [gameName, gameImage];
 sharedDataService.set(params);
 $state.go('app.game.summary', {"gamename": gameName});
 };

 }]);
 
 */
 //de aqui pa lante no estaba commentado

myApp.controller('loginController', ['$scope', '$http', '$state', '$window', 'AuthenticationService', '$rootScope',
function ($scope, $http, $state, $window, AuthenticationService, $rootScope) {

		$scope.incorrectPassword = false;
		$scope.badCredentials = false;

		$scope.login = function (valid) {
			if (valid) {
				AuthenticationService.Login($scope.credentials.username, $scope.credentials.userPassword, function (response, status) {
					if (status == 200) {
						AuthenticationService.SetCredentials($scope.credentials.username, response.token);
						$scope.badCredentials = false;
						$state.go("app.home");
					} else {
						$scope.badCredentials = true;
					}
				});
			}
		};

		$scope.createAccount = function (valid) {
			if (valid) {
				if ($scope.account.password != $scope.account.confirmPassword) {
					$scope.incorrectPassword = true;
					return;
				}
				$scope.incorrectPassword = false;
				$http.post($rootScope.baseURL + '/create/account', $scope.account).success(function (response, status) {
					AuthenticationService.SetCredentials($scope.account.username, response.token);
					$state.go("app.home");
				}).error(function (err, status) {
					console.log(err);
				});
			}
		}
}]);

myApp.controller('sidebarController', ['$scope', '$window', '$http', '$state', 'AuthenticationService',
function ($scope, $window, $http, $state, AuthenticationService) {
	
	//$scope.goToSearch = function () {
		
	
	$scope.goToSearch = function(query) {
		//need undefined in case somebody pushes the button and they havent entered any text
		if (query !== undefined) {
			if (query.length > 0) {
				$state.go("app.search", {
					"query" : query
				}) //
			}
		}
	}


		$scope.goToMyProfile = function () {
			$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				}) //
		}
		$scope.goToRegisteredEvents = function () {
			$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.goToMyEvents = function () {
			$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.goCreateEvent = function () {
			$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.goToMyMatchUps = function () {
			$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.goToMyTeams = function () {
			$state.go("app.userTeams", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.goToMyOrganizations = function () {
			$state.go("app.userOrganizations", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.goToRegisteredEvents = function () {
			$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.goToMyEvents = function () {
			$state.go("app.userProfile", {
					"username": $window.sessionStorage.username
				}) //
		}

		$scope.logout = function () {
			AuthenticationService.clearCredentials();
			$state.go("login"); //
		}

		$scope.goToOrganizationProfile = function (organization) {
				$state.go("app.organizationProfile", {
						"organizationName": organization
					}) //
			}
			//go to a specific users in an event
		$scope.goToUser = function (customer_username) {

				$state.go("app.userProfile", {
						"username": customer_username
					}) //
			}
			//changed to work
		$scope.goToEvent = function (eventName, date, location) {

			eventName = eventName.replace(" ", "%20");
			location = location.replace(" ", "%20");
			var params = [eventName, date, location];

			$http.get('http://136.145.116.232/matchup/events/' + eventName + '?date=' + date + '&location=' + location + '').success(function (data, status, headers) {

				var eventData = angular.fromJson(data);

				var host = eventData.host;

				if (host != null) {
					$state.go('app.premiumEvent', {
						"eventname": eventName,
						"date": date,
						"location": location
					});
				} else { //go to tournament
					console.log("regular event = tournament");
					$state.go('app.tournament', {
						"eventname": eventName,
						"date": date,
						"location": location
					});
				}

			}).error(function (data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in goToEvent");
			});


		};
	
		$scope.goToGameProfile = function(gameName) {
			$state.go('app.gameProfile', {
				"game" : gameName
			});
		};
	
		$scope.goToGenreProfile = function(genre) {
			$state.go('app.genreProfile', {
				"genre" : genre
			});
		}; 

		$scope.goToTournament = function (eventName, date, location, tournament) {
			//ng-click="goToEvent(event.event_name,  event.event_start_date, event.event_location, tournament)"
			eventName = eventName.replace(" ", "%20");
			location = location.replace(" ", "%20");
			tournament = tournament.replace(" ", "%20");

			$state.go('app.tournament', {
				"eventname": eventName,
				"tournament": tournament,
				"date": date,
				"location": location
			});

		};

}]);

myApp.controller('gameViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window',
function ($scope, $http, $state, sharedDataService, $window) {

		$http.get('http://matchup.neptunolabs.com/matchup/popular/games').success(function (data, status, headers) {
			$scope.games = angular.fromJson(data);

		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in game view controller.");
		});

}]);

myApp.controller('genreViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window',
function ($scope, $http, $state, sharedDataService, $window) {

		$http.get('http://matchup.neptunolabs.com/matchup/popular/genres').success(function (data, status, headers) {
			$scope.genres = angular.fromJson(data);

		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in game view controller.");
		});



}]);

myApp.controller('gameProfileController', ['$scope', '$http', '$state', 'sharedDataService', '$stateParams', '$window',
function ($scope, $http, $state, sharedDataService, $stateParams, $window) {

		//TODO Need a route to look for info about a specific game!
		$scope.game = {
			"game_name": "Got route?",
			"game_image": "http://upload.wikimedia.org/wikipedia/en/9/92/Halo_4_box_artwork.png"
		};

		$http.get('http://136.145.116.232/matchup/events?filter=game&value=' + $stateParams.game + '&state=upcoming&hosted=true').success(function (data, status, headers) {
			$scope.gamesUpcomingHosted = angular.fromJson(data);

			$http.get('http://136.145.116.232/matchup/events?filter=game&value=' + $stateParams.game + '&state=live&hosted=true').success(function (data, status, headers) {
				$scope.gamesLiveHosted = angular.fromJson(data);

				$http.get('http://136.145.116.232/matchup/events?filter=game&value=' + $stateParams.game + '&state=upcoming').success(function (data, status, headers) {
					$scope.gamesUpcoming = angular.fromJson(data);

					$http.get('http://136.145.116.232/matchup/events?filter=game&value=' + $stateParams.game + '&state=live').success(function (data, status, headers) {
						$scope.gamesLive = angular.fromJson(data);

						$http.get('http://136.145.116.232/matchup/events?filter=game&value=' + $stateParams.game + '&state=past').success(function (data, status, headers) {
							$scope.gamesPast = angular.fromJson(data);

						}).error(function (data, status) {

							if (status == 404 || status == 401 || status == 400)
								$state.go("" + status);
							console.log("error in game profile controller.");
						});

					}).error(function (data, status) {

						if (status == 404 || status == 401 || status == 400)
							$state.go("" + status);
						console.log("error in game profile controller.");
					});

				}).error(function (data, status) {

					if (status == 404 || status == 401 || status == 400)
						$state.go("" + status);
					console.log("error in game profile controller.");
				});
			}).error(function (data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in game profile controller.");
			});

		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in game profile controller.");
		});

}]);

myApp.controller('genreProfileController', ['$scope', '$http', '$state', 'sharedDataService', '$stateParams', '$window',
function ($scope, $http, $state, sharedDataService, $stateParams, $window) {

		$http.get('http://136.145.116.232/matchup/events?filter=genre&value=' + $stateParams.genre + '&state=upcoming').success(function (data, status, headers) {
			$scope.genresUpcoming = angular.fromJson(data);

			$http.get('http://136.145.116.232/matchup/events?filter=genre&value=' + $stateParams.genre + '&state=live').success(function (data, status, headers) {
				$scope.genresLive = angular.fromJson(data);

				$http.get('http://136.145.116.232/matchup/events?filter=genre&value=' + $stateParams.genre + '&state=past').success(function (data, status, headers) {
					$scope.genresPast = angular.fromJson(data);

				}).error(function (data, status) {

					if (status == 404 || status == 401 || status == 400)
						$state.go("" + status);
					console.log("error in genres profile controller.");
				});

			}).error(function (data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in genres profile controller.");
			});

		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in genres profile controller.");
		});

}]);