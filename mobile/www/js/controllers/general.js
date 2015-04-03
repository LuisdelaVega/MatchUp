var myApp = angular.module('home',[]);

myApp.controller('homeViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {
    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://matchup.neptunolabs.com/matchup/events?type=hosted&state=upcoming', config).
    success(function(data, status, headers, config) {

        $scope.hostedEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in home controller. obtaining hosted upcoming events");
    });

    $http.get('http://matchup.neptunolabs.com/matchup/events?type=regular&state=upcoming', config).
    success(function(data, status, headers, config) {

        $scope.regularEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in home controller. obtaining hosted upcoming events");
    });

    $http.get('http://matchup.neptunolabs.com/matchup/events?state=live', config).
    success(function(data, status, headers, config) {

        $scope.liveEvents = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in home controller. obtaining hosted upcoming events");
    });

    $http.get('http://matchup.neptunolabs.com/matchup/popular/games', config).
    success(function(data, status, headers, config) {

        $scope.popularGames = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in popular games home view");
    });

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.hosted;

            sharedDataService.set(params);

            if(isHosted != 'null'){
                $state.go('app.eventpremium.summary', {"eventname": eventName, "date": date, "location": location});
            }
            else{
                $state.go('app.regularevent', {"eventname": eventName, "date": date, "location": location});
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });

    };

    $scope.goToGameProfile = function (gameName, gameImage) {
        var params = [gameName, gameImage];
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };

}]);

myApp.controller('searchController', ['$scope', '$http', 'sharedDataService', '$state', '$window', function ($scope, $http, sharedDataService, $state, $window) {

    $scope.search = function (query) {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        if(query.length > 0){
            $http.get('http://136.145.116.232/matchup/search/'+query+'', config).
            success(function(data, status, headers, config) {

                console.log('http://136.145.116.232/matchup/search/'+query+'');

                $scope.searchData = angular.fromJson(data);

                $scope.liveEvents = $scope.searchData.events.live;
                $scope.pastEvents = $scope.searchData.events.past;
                $scope.premiumEvents = $scope.searchData.events.hosted;
                $scope.regularEvents = $scope.searchData.events.regular;
                $scope.users = $scope.searchData.users;
                $scope.teams = $scope.searchData.teams;
                $scope.organizations = $scope.searchData.organizations;
                $scope.games = $scope.searchData.games;
                $scope.genres = $scope.searchData.genres;

                sharedDataService.set($scope.searchData);
            }).
            error(function(data, status, headers, config) {
                console.log("error in search controller");
            });
        }
        else{

            $scope.liveEvents.length = 0
            $scope.pastEvents.length = 0
            $scope.premiumEvents.length = 0
            $scope.regularEvents.length = 0
            $scope.users.length = 0
            $scope.teams.length = 0
            $scope.organizations.length = 0
            $scope.games.length = 0
            $scope.genres.length = 0

        }

    }

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.hosted;

            sharedDataService.set(params);

            if(isHosted != 'null'){
                $state.go('app.eventpremium.summary', {"eventname": eventName, "date": date, "location": location});
            }
            else{
                $state.go('app.regularevent', {"eventname": eventName, "date": date, "location": location});
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });

    };

    $scope.goToGameProfile = function (gameName, gameImage) {
        var params = [gameName, gameImage];
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };



}]);

myApp.controller('searchResultController', ['$scope', '$stateParams', 'sharedDataService', '$state', '$http', '$window', function ($scope, $stateParams, sharedDataService, $state, $http, $window) {

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

        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.hosted;

            sharedDataService.set(params);


            if(isHosted != 'null'){
                $state.go('app.eventpremium.summary', {"eventname": eventName, "date": date, "location": location});
            }
            else{
                $state.go('app.regularevent', {"eventname": eventName, "date": date, "location": location});
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });

    };

    $scope.goToGameProfile = function (gameName, gameImage) {
        var params = [gameImage, gameName];
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };


}]);

myApp.controller('cameraReportController', ['$scope', '$http', 'Camera', function ($scope, $http, Camera) {

    $scope.picturetaken = false;

    $scope.takePicture = function () {
        console.log('Getting camera');
        Camera.getPicture().then(function (imageURI) {
            console.log(imageURI);
            $scope.imageURL = imageURI;
        }, function (err) {
            console.err(err);
        }, {
            quality: 75,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        });
    };
}]);

myApp.controller('popularGameViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    var allGames = [ ];
    $scope.popularGames = [];

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://matchup.neptunolabs.com/matchup/popular/games', config).
    success(function(data, status, headers, config) {

        allGames = angular.fromJson(data);

        for(var i = 0; i <= 6; i++){
            if(allGames.length > 0)
                $scope.popularGames.push(allGames.pop());
        }

        console.log($scope.popularGames);
    }).
    error(function(data, status, headers, config) {
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
        var params = [gameImage, gameName];
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };

}]);

myApp.controller('loginController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    $scope.credentials = { };

    $scope.error = false;
    $scope.login = function () {

        // Base 64 encoding
        var AuHeader = 'Basic ' + btoa($scope.credentials.userEmail + ':' + $scope.credentials.userPassword);
        var config = {
            headers: {
                'Authorization': AuHeader
            }
        }; 

        $http.post('http://136.145.116.232/login', {}, config).success(function (data) {
            var tokenObj = angular.fromJson(data);
            // save token in session
            $window.sessionStorage.token = tokenObj.token;
            console.log($window.sessionStorage.token);
            // reset error variable
            $scope.error = false;
            // change view
            $state.go('app.home');
        }).error(function (err) {
            $scope.error = true;
        });
    };
}]);

myApp.controller('sidebarController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    $scope.$on('$ionicView.enter', function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };


        $scope.goToProfile = function (customer_username) {

            sharedDataService.set(customer_username);
            $state.go('app.profile.summary', { "username":  customer_username});

        };

        $http.get('http://136.145.116.232/matchup/profile', config).success(function (data) {

            $scope.loggedInUserProfileData = angular.fromJson(data);
            $scope.coverPhotoCSS = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url("+data.customer_cover_photo+")";
            $scope.profilePictureCSS =  "url("+data.customer_profile_pic+")";

        }).error(function (err) {
            console.log(err);

        });

        $scope.goToMyEvents = function (customer_username) {

            sharedDataService.set(customer_username);
            $state.go('app.myevents.melist', { "username":  customer_username});

        };
        
        $scope.goToRegisteredEvents = function (customer_username) {

            sharedDataService.set(customer_username);
            $state.go('app.registeredevents.relist');

        };

    });
}]);