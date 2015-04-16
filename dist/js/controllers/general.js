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


myApp.controller('searchController', ['$scope', '$http', '$state', '$window', '$stateParams', 'MatchUpCache', function ($scope, $http, $state, $window, $stateParams, MatchUpCache) {

    MatchUpCache.remove('http://136.145.116.232/matchup/search/' + $stateParams.query + '');
    $http.get('http://136.145.116.232/matchup/search/' + $stateParams.query + '', {
        cache: MatchUpCache
    }).
    success(function (data, status, headers) {

        console.log('http://136.145.116.232/matchup/search/' + $stateParams.query + '');

        $scope.searchData = angular.fromJson(data);
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
        //console.log(searchCache.get('http://136.145.116.232/matchup/search/' + $stateParams.query + ''));

    }).
    error(function (data, status, headers) {
        console.log("error in search controller");
    });







 }]);


myApp.controller('searchResultsController', ['$scope', '$http', '$state', '$window', '$stateParams', 'MatchUpCache',
function ($scope, $http, $state, $window, $stateParams, MatchUpCache) {
        console.log("resultscontroller");

        $scope.type = $stateParams.type;
        console.log($scope.type);
        $http.get('http://136.145.116.232/matchup/search/' + $stateParams.query + '', {
            cache: MatchUpCache
        }).success(function (data, status, headers) {

            //console.log('http://136.145.116.232/matchup/search/' + $stateParams.query + '');


            $scope.searchData = angular.fromJson(data);
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



        }).error(function (data, status, headers) {
            console.log("error in search controller");
        });

}]);


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
        };
}]);

myApp.controller('sidebarController', ['$scope', '$window', '$http', '$state', 'AuthenticationService',
function ($scope, $window, $http, $state, AuthenticationService) {
	$scope.me = $window.sessionStorage.username;
	
	$scope.userSearch = function(query) {
 		$http.get('http://136.145.116.232/matchup/search/users/' + query + '').success(function(data, status, headers) {
			$scope.users = angular.fromJson(data);
			console.log($scope.users);
		}).error(function(data, status, headers) {
			console.log("error in search controller");
		});

	};
	

        //function for going into a page that will display all the teams the customer belongs to
        $scope.goToTeams = function (username) {
            $state.go("app.userTeams", {
                    "username": username
                }) ;

        };
      
        $scope.goToTeamsProfile = function (teamName) {
            $state.go("app.teamProfile", {
                "teamName": teamName
            });
        };



        $scope.goToSearch = function (query) {
            //need undefined in case somebody pushes the button and they havent entered any text
            if (query !== undefined) {
                if (query.length > 0) {
                    $state.go("app.search", {
                            "query": query
                        }) ;
                }
            }
        };
        
        $scope.goToSearchResults = function (type, query) {
            //need undefined in case somebody pushes the button and they havent entered any text
            if (query !== undefined) {  
                if (query.length > 0) {  
                    $state.go("app.searchResults", {
                            "type": type,
                            "query": query
                        }) ;
                } 
            }
        };
 

        $scope.logout = function () {
            AuthenticationService.clearCredentials();
            $state.go("login"); //
        };

        $scope.goToOrganizationProfile = function (organization) {
                $state.go("app.organizationProfile", {
                        "organizationName": organization
                    }) ;
           };
            //go to a specific users in an event
        $scope.goToUser = function (customer_username) {

            $state.go("app.userProfile", {
                    "username": customer_username
                }) ;
        };


        $scope.goToGameProfile = function (gameName) {
            $state.go('app.gameProfile', {
                "game": gameName
            });
        };

        $scope.goToGenreProfile = function (genre) {
            $state.go('app.genreProfile', {
                "genre": genre
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

        $scope.goToEvent = function (eventName, date, location) {

            eventName = eventName.replace(" ", "%20");
            location = location.replace(" ", "%20");
            var params = [eventName, date, location];

            $http.get('http://136.145.116.232/matchup/events/' + eventName + '?date=' + date + '&location=' + location + '').success(function (data, status) {

                if (data.host != null) {
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

myApp.controller('myEventsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', function ($scope, $http, $state, $stateParams, $rootScope) {
    $http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/events').success(function (data) {
        $scope.upcoming = [];
        $scope.live = [];
        $scope.history = [];
        for (var i = 0; i < data.length; i++) {
            // Categorize events by date
            var start = new Date(data[i].event_start_date).getTime();
            var end = new Date(data[i].event_end_date).getTime();
            var now = new Date().getTime();
            if (now < start)
                $scope.upcoming.push(data[i]);
            if (now > start && now < end)
                $scope.live.push(data[i]);
            else
                $scope.history.push(data[i]);
        }
    });
}]);

myApp.controller('registeredEventsController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', function ($scope, $http, $state, $stateParams, $rootScope) {
    // TODO: There's nothing visually that says if his a spectator or competitor
    // Get events where user is a competitor
    $http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/events/registered?type=competitor').success(function (data) {
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
    }).then(function () {
        // Get events where user is a spectator
        $http.get($rootScope.baseURL + '/matchup/profile/' + $stateParams.username + '/events/registered?type=spectator')
        .success(function (data) {
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