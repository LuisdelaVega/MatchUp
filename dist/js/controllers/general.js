var myApp = angular.module('home', []);

myApp.controller('generalViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window', '$rootScope',
function($scope, $http, $state, sharedDataService, $window, $rootScope) {

	$http.get($rootScope.baseURL + '/matchup/events?type=hosted&state=upcoming').success(function(data, status, headers) {
		$scope.hostedEvents = data;
		console.log($scope.hostedEvents);

		$http.get($rootScope.baseURL + '/matchup/events?type=hosted&state=live').success(function(data, status, headers) {

			$scope.hostedLiveEvents = data;
			console.log($scope.hostedEvents);

			$http.get($rootScope.baseURL + '/matchup/events?type=regular&state=upcoming').success(function(data, status, headers) {

				$scope.regularEvents = data;

				$http.get($rootScope.baseURL + '/matchup/events?type=regular&state=live').success(function(data, status, headers) {
					$scope.regularLiveEvents = data;

				}).error(function(data, status) {

					if (status == 404 || status == 401 || status == 400)
						$state.go("" + status);
					console.log("error in home controller. obtaining hosted upcoming events");
				});

			}).error(function(data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in home controller. obtaining hosted upcoming events");
			});

		}).error(function(data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in home controller. obtaining hosted upcoming events");
		});
	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in home controller. obtaining hosted upcoming events");
	});

}]);

myApp.controller('homeViewController', ['$scope', '$http', '$state', 'sharedDataService', '$q', '$rootScope',
function($scope, $http, $state, sharedDataService, $q, $rootScope) {

	$q.all([$http.get($rootScope.baseURL + '/matchup/events?type=hosted&state=upcoming'), $http.get($rootScope.baseURL + '/matchup/events?type=regular&state=upcoming'), $http.get($rootScope.baseURL + '/matchup/events?state=live'), $http.get($rootScope.baseURL + '/matchup/popular/games')]).then(function(results) {
		$scope.hostedEvents = results[0].data;
		$scope.regularEvents = results[1].data;
		$scope.liveEvents = results[2].data;
		$scope.popularGames = results[3].data;

	});

	$scope.goToGameProfile = function(gameName, gameImage) {
		var params = [gameName, gameImage];
		sharedDataService.set(params);
		$state.go('app.gameProfile', {
			"gamename" : gameName
		});
	};

}]);

myApp.controller('searchController', ['$scope', '$http', '$state', '$window', '$stateParams', 'MatchUpCache', '$rootScope',
function($scope, $http, $state, $window, $stateParams, MatchUpCache, $rootScope) {

	MatchUpCache.remove($rootScope.baseURL + '/matchup/search/' + $stateParams.query + '');
	$http.get($rootScope.baseURL + '/matchup/search/' + $stateParams.query + '', {
		cache : MatchUpCache
	}).success(function(data, status, headers) {

		$scope.searchData = data;
		$scope.searchQuery = $stateParams.query;

		$scope.liveEvents = $scope.searchData.events.live;
		$scope.pastEvents = $scope.searchData.events.past;
		$scope.premiumEvents = $scope.searchData.events.hosted;
		$scope.regularEvents = $scope.searchData.events.regular;
		$scope.users = $scope.searchData.users;
		$scope.teams = $scope.searchData.teams;
		$scope.organizations = $scope.searchData.organizations;
		$scope.games = $scope.searchData.games;
		$scope.genres = $scope.searchData.genres;
	}).error(function(data, status, headers) {
		console.log("error in search controller");
	});

}]);

myApp.controller('searchResultsController', ['$scope', '$http', '$state', '$window', '$stateParams', 'MatchUpCache', '$rootScope',
function($scope, $http, $state, $window, $stateParams, MatchUpCache, $rootScope) {
	console.log("resultscontroller");

	$scope.type = $stateParams.type;
	console.log($scope.type);
	$http.get($rootScope.baseURL + '/matchup/search/' + $stateParams.query + '', {
		cache : MatchUpCache
	}).success(function(data, status, headers) {

		//console.log('http://136.145.116.232/matchup/search/' + $stateParams.query + '');

		$scope.searchData = data;
		if ($scope.type == "live-events")
			$scope.liveEvents = $scope.searchData.events.live;
		if ($scope.type == "past-events")
			$scope.pastEvents = $scope.searchData.events.past;
		if ($scope.type == "premium-events")
			$scope.premiumEvents = $scope.searchData.events.hosted;
		if ($scope.type == "regular-events")
			$scope.regularEvents = $scope.searchData.events.regular;
		if ($scope.type == "users")
			$scope.users = $scope.searchData.users;
		if ($scope.type == "teams")
			$scope.teams = $scope.searchData.teams;
		if ($scope.type == "organizations")
			$scope.organizations = $scope.searchData.organizations;
		if ($scope.type == "games")
			$scope.games = $scope.searchData.games;
		if ($scope.type == "genres")
			$scope.genres = $scope.searchData.genres;

	}).error(function(data, status, headers) {
		console.log("error in search controller");
	});

}]);

myApp.controller('loginController', ['$scope', '$http', '$state', '$window', 'AuthenticationService', '$rootScope',
function($scope, $http, $state, $window, AuthenticationService, $rootScope) {

	$scope.incorrectPassword = false;
	$scope.badCredentials = false;

	$scope.login = function(valid) {
		if (valid) {
			AuthenticationService.Login($scope.credentials.username, $scope.credentials.userPassword, function(response, status) {
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

	$scope.createAccount = function(valid) {
		if (valid) {
			if ($scope.account.password != $scope.account.confirmPassword) {
				$scope.incorrectPassword = true;
				return;
			}
			$scope.incorrectPassword = false;
			$http.post($rootScope.baseURL + '/create/account', $scope.account).success(function(response, status) {
				AuthenticationService.SetCredentials($scope.account.username, response.token);
				$state.go("app.home");
			}).error(function(err, status) {
				console.log(err);
			});
		}
	};
}]);

myApp.controller('sidebarController', ['$scope', '$window', '$http', '$state', 'AuthenticationService', '$rootScope', 'MatchUpCache',
function($scope, $window, $http, $state, AuthenticationService, $rootScope, MatchUpCache) {
	$scope.me = $window.sessionStorage.username;

	$scope.userSearch = function(query) {
		$http.get($rootScope.baseURL + '/matchup/search/users/' + query).success(function(data, status, headers) {

			$scope.users = data;
			console.log("error in search controller");

		}).error(function(data, status, headers) {
		});

	};
	
	$scope.getMatch = function (event,tournament,round,match,round_of,date,location,station){
		$http.get($rootScope.baseURL + '/matchup/events/' + event + '/tournaments/' + tournament + '/rounds/' + round + '/matches/' + match + '?round_of=' + round_of + '&date=' + date + '&location=' + location).success(function (data, status) {
			$scope.matchInfo = data;
			$scope.matchInfo.tournament = tournament;
			$scope.matchInfo.round = round;
			$scope.matchInfo.round_of = round_of;
			$scope.matchInfo.date = date;
			$scope.matchInfo.match = match;
			$scope.matchInfo.station_number = station;
			if($scope.matchInfo.score_type == 'Points'){
				$scope.matchInfo.players[0].score = 0;
				$scope.matchInfo.players[1].score = 0;
				for(var i = 0; i < $scope.matchInfo.sets.length ;i++){
					if($scope.matchInfo.sets[i].scores[0].competitor_number){
						if($scope.matchInfo.sets[i].scores[0].score > $scope.matchInfo.sets[i].scores[1].score)
							$scope.matchInfo.players[0].score++;
						else
							$scope.matchInfo.players[1].score++;
					}
					else
						break;
				}
			}
			$('#matchupModal').modal('show');
			console.log(data);
		});
	};

	//function for going into a page that will display all the teams the customer belongs to
	$scope.goToTeams = function(username) {
		$state.go("app.userTeams", {
			"username" : username
		});

	};

	$scope.goToTeamsProfile = function(teamName) {
		$state.go("app.teamProfile", {
			"teamName" : teamName
		});
	};

	$scope.goToSearch = function(query) {
		//need undefined in case somebody pushes the button and they havent entered any text
		if (query !== undefined) {
			if (query.length > 0) {
				$state.go("app.search", {
					"query" : query
				});
			}
		}
	};

	$scope.goToSearchResults = function(type, query) {
		//need undefined in case somebody pushes the button and they havent entered any text
		if (query !== undefined) {
			if (query.length > 0) {
				$state.go("app.searchResults", {
					"type" : type,
					"query" : query
				});
			}
		}
	};

	$scope.logout = function() {
		AuthenticationService.clearCredentials();
		$state.go("login");
		//
	};

	$scope.goToOrganizationProfile = function(organization) {
		$state.go("app.organizationProfile", {
			"organizationName" : organization
		});
	};
	//go to a specific users in an event
	$scope.goToUser = function(customer_username) {
		$state.go("app.userProfile", {
			"username" : customer_username
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

	$scope.goToTournament = function(eventName, date, location, tournament) {
		$state.go('app.tournament', {
			"eventname" : eventName,
			"tournament" : tournament,
			"date" : date,
			"location" : location
		});
	};

	$scope.goToEvent = function(eventName, date, location) {
		var params = [eventName, date, location];
		MatchUpCache.remove($rootScope.baseURL + '/matchup/events/' + eventName + '?date=' + date + '&location=' + location);
		$http.get($rootScope.baseURL + '/matchup/events/' + eventName + '?date=' + date + '&location=' + location, {
			cache : MatchUpCache
		}).success(function(event, status) {

			// Go to event page if the event is premium
			if (event.host) {
				$state.go('app.premiumEvent', {
					"eventname" : eventName,
					"date" : date,
					"location" : location
				});
			}
			// Host is null, not a premium
			else {
				// Get the tournament of the regular event
				$http.get($rootScope.baseURL + '/matchup/events/' + eventName + '/tournaments?date=' + date + '&location=' + location).success(function(tournaments) {
					$state.go('app.tournament', {
						"eventname" : eventName,
						"tournament" : tournaments[0].tournament_name,
						"date" : date,
						"location" : location
					});
				});
			}
		}).error(function(data, status) {
			console.log(data);
		});

	};

}]);

myApp.controller('gameViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window', '$rootScope',
function($scope, $http, $state, sharedDataService, $window, $rootScope) {

	$http.get($rootScope.baseURL + '/matchup/popular/games').success(function(data, status, headers) {
		$scope.games = data;

	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in game view controller.");
	});

}]);

myApp.controller('genreViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window', '$rootScope',
function($scope, $http, $state, sharedDataService, $window, $rootScope) {

	$http.get($rootScope.baseURL + '/matchup/popular/genres').success(function(data, status, headers) {
		$scope.genres = data;

	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in game view controller.");
	});

}]);

myApp.controller('gameProfileController', ['$scope', '$http', '$state', 'sharedDataService', '$stateParams', '$window', '$rootScope',
function($scope, $http, $state, sharedDataService, $stateParams, $window, $rootScope) {

	$scope.gameName = $stateParams.game;

	$http.get($rootScope.baseURL + '/matchup/events?filter=game&value=' + $stateParams.game + '&state=upcoming&hosted=true').success(function(data, status, headers) {
		$scope.gamesUpcomingHosted = angular.fromJson(data);

		$http.get($rootScope.baseURL + '/matchup/events?filter=game&value=' + $stateParams.game + '&state=live&hosted=true').success(function(data, status, headers) {
			$scope.gamesLiveHosted = angular.fromJson(data);

			$http.get($rootScope.baseURL + '/matchup/events?filter=game&value=' + $stateParams.game + '&state=upcoming').success(function(data, status, headers) {
				$scope.gamesUpcoming = angular.fromJson(data);

				$http.get($rootScope.baseURL + '/matchup/events?filter=game&value=' + $stateParams.game + '&state=live').success(function(data, status, headers) {
					$scope.gamesLive = angular.fromJson(data);

					$http.get($rootScope.baseURL + '/matchup/events?filter=game&value=' + $stateParams.game + '&state=past').success(function(data, status, headers) {
						$scope.gamesPast = angular.fromJson(data);

					}).error(function(data, status) {

						if (status == 404 || status == 401 || status == 400)
							$state.go("" + status);
						console.log("error in game profile controller.");
					});

				}).error(function(data, status) {

					if (status == 404 || status == 401 || status == 400)
						$state.go("" + status);
					console.log("error in game profile controller.");
				});

			}).error(function(data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in game profile controller.");
			});
		}).error(function(data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in game profile controller.");
		});

	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in game profile controller.");
	});

}]);

myApp.controller('genreProfileController', ['$scope', '$http', '$state', 'sharedDataService', '$stateParams', '$window', '$rootScope',
function($scope, $http, $state, sharedDataService, $stateParams, $window, $rootScope) {
	
	$scope.genreName = $stateParams.genre;

	$http.get($rootScope.baseURL + '/matchup/events?filter=genre&value=' + $stateParams.genre + '&state=upcoming').success(function(data, status, headers) {
		$scope.genresUpcoming = angular.fromJson(data);

		$http.get($rootScope.baseURL + '/matchup/events?filter=genre&value=' + $stateParams.genre + '&state=live').success(function(data, status, headers) {
			$scope.genresLive = angular.fromJson(data);

			$http.get($rootScope.baseURL + '/matchup/events?filter=genre&value=' + $stateParams.genre + '&state=past').success(function(data, status, headers) {
				$scope.genresPast = angular.fromJson(data);

			}).error(function(data, status) {

				if (status == 404 || status == 401 || status == 400)
					$state.go("" + status);
				console.log("error in genres profile controller.");
			});

		}).error(function(data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in genres profile controller.");
		});

	}).error(function(data, status) {

		if (status == 404 || status == 401 || status == 400)
			$state.go("" + status);
		console.log("error in genres profile controller.");
	});

}]);

myApp.controller('myEventsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function($scope, $http, $state, $stateParams, $rootScope) {
	$http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/events').success(function(data) {
		$scope.upcoming = [];
		$scope.live = [];
		$scope.history = [];
		for (var i = 0; i < data.length; i++) {
			var start = new Date(data[i].event_start_date).getTime();
			var end = new Date(data[i].event_end_date).getTime();
			var now = new Date().getTime();
			if (now < start)
				$scope.upcoming.push(data[i]);
			else if (now > start && now < end)
				$scope.live.push(data[i]);
			else
				$scope.history.push(data[i]);
		}
	});
}]);

myApp.controller('registeredEventsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope',
function($scope, $http, $state, $stateParams, $rootScope) {
	// TODO: There's nothing visually that says if his a spectator or competitor
	// Get events where user is a competitor
	$http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/events/registered?type=competitor').success(function(data) {
		$scope.upcoming = [];
		$scope.live = [];
		$scope.history = [];
		for (var i = 0; i < data.length; i++) {
			var start = new Date(data[i].event_start_date).getTime();
			var end = new Date(data[i].event_end_date).getTime();
			var now = new Date().getTime();
			if (now < start)
				$scope.upcoming.push(data[i]);
			else if (now > start && now < end)
				$scope.live.push(data[i]);
			else
				$scope.history.push(data[i]);
		}
	}).then(function() {
		// Get events where user is a spectator
		$http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/events/registered?type=spectator').success(function(data) {
			for (var i = 0; i < data.length; i++) {
				var start = new Date(data[i].event_start_date).getTime();
				var end = new Date(data[i].event_end_date).getTime();
				var now = new Date().getTime();
				if (now < start)
					$scope.upcoming.push(data[i]);
				else if (now > start && now < end)
					$scope.live.push(data[i]);
				else
					$scope.history.push(data[i]);
			}
		});
	});
}]);
