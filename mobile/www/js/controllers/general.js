var myApp = angular.module('home',[]);

myApp.controller('homeViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Synchronously make server calls to reduce load on server.
    //Obtain hosted and upcoming events
    $http.get('http://matchup.neptunolabs.com/matchup/events?type=hosted&state=upcoming', config).
    success(function(data, status, headers, config) {

        $scope.hostedEvents = angular.fromJson(data);

        //Obtain live and upcoming events
        $http.get('http://matchup.neptunolabs.com/matchup/events?state=live', config).
        success(function(data, status, headers, config) {

            $scope.liveEvents = angular.fromJson(data);

            //Obtain regular and upcoming events
            $http.get('http://matchup.neptunolabs.com/matchup/events?type=regular&state=upcoming', config).
            success(function(data, status, headers, config) {

                $scope.regularEvents = angular.fromJson(data);

                //Obtain popular games
                $http.get('http://matchup.neptunolabs.com/matchup/popular/games', config).
                success(function(data, status, headers, config) {

                    $scope.popularGames = angular.fromJson(data);

                }).
                error(function(data, status, headers, config) {
                    console.log("error in popular games home view");
                });
            }).
            error(function(data, status, headers, config) {
                console.log("error in home controller. obtaining hosted upcoming events");
            });

        }).
        error(function(data, status, headers, config) {
            console.log("error in home controller. obtaining hosted upcoming events");
        });
    }).
    error(function(data, status, headers, config) {
        console.log("error in home controller. obtaining hosted upcoming events");
    });

    //goToEvent requires the event name, date and location to access the specific event that is to be transitioned to.
    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };


        //Get event information
        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.host; //Server returns organization that is hosting the event. If the event does not have a host than the value returned is null.

            sharedDataService.set(params);

            //If isHosted is null, than the user is requesting to go to a regular event. Otherwise the user is going to a premium event. 
            if(isHosted != null){
                $state.go('app.eventpremium', {"eventname": eventName, "date": date, "location": location});
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
        var params = [gameImage, gameName]; //Stored in array to send both values at the same time through sharedDataService
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };

}]);

myApp.controller('searchController', ['$scope', '$http', 'sharedDataService', '$state', '$window', function ($scope, $http, sharedDataService, $state, $window) {

    //Funtion that is called everytime the value in the search box is changed.
    $scope.search = function (query) {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Search only if there is content in the search box
        if(query.length > 0){
            //Server call to obtain information on events, users, teams, organizations, games and genres based on user search input
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

        //Failsafe to make sure that if search parameters is 0 than there should be nothing displaying
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

    //goToEvent requires the event name, date and location to access the specific event that is to be transitioned to.
    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20"); //Replace spaces with %20
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };


        //Server call to obtain event informtion
        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.host; //Server returns organization that is hosting the event. If the event does not have a host than the value returned is null.

            sharedDataService.set(params);

            //If isHosted is null, than the user is requesting to go to a regular event. Otherwise the user is going to a premium event. 
            if(isHosted != null){
                $state.go('app.eventpremium', {"eventname": eventName, "date": date, "location": location});
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
        //Save parameters to array such that both can be sent through sharedDataServices
        var params = [gameImage, gameName];
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };

    $scope.goToUserProfile = function (userName) {
        //Save parameters to array such that both can be sent through sharedDataServices
        sharedDataService.set(userName);
        $state.go('app.profile.summary', {"username": userName});
    };

    $scope.goToTeamProfile = function (teamName) {
        $state.go('app.teamprofile', {"teamname": teamName});
    };

    $scope.goToOrganizationProfile = function (organizationName) {
        $state.go('app.organizationprofile', {"organizationname": organizationName});
    };

}]);

myApp.controller('searchResultController', ['$scope', '$stateParams', 'sharedDataService', '$state', '$http', '$window', function ($scope, $stateParams, sharedDataService, $state, $http, $window) {

    //Finds what type of parameter the user is searching for.
    $scope.resultType = $stateParams.type;

    //Obtain the searchData from previous view. Avoids unnecessary server call.
    var searchData = sharedDataService.get();

    //Used to toggle ng-if appropriately and display the corresponfing information.
    $scope.live = false;
    $scope.past = false;
    $scope.hosted = false;
    $scope.regular = false;
    $scope.users = false;
    $scope.teams = false;
    $scope.organizations = false;
    $scope.games = false;
    $scope.genres = false;

    //Sets to true the value that is determined by the $stateParams and display the appropriate information through the use of ng-if
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


    //goToEvent requires the event name, date and location to access the specific event that is to be transitioned to.
    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Server call to obtain event information
        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.host; //Server returns organization that is hosting the event. If the event does not have a host than the value returned is null.

            sharedDataService.set(params);


            //If isHosted is null, than the user is requesting to go to a regular event. Otherwise the user is going to a premium event. 
            if(isHosted != null){
                $state.go('app.eventpremium', {"eventname": eventName, "date": date, "location": location});
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
        //Save parameters to array such that both can be sent through sharedDataServices
        var params = [gameImage, gameName];
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };

    $scope.goToUserProfile = function (userName) {
        //Save parameters to array such that both can be sent through sharedDataServices
        sharedDataService.set(userName);
        $state.go('app.profile.summary', {"username": userName});
    };

    $scope.goToTeamProfile = function (teamName) {
        $state.go('app.teamprofile', {"teamname": teamName});
    };

    $scope.goToOrganizationProfile = function (organizationName) {
        $state.go('app.organizationprofile', {"organizationname": organizationName});
    };

}]);

myApp.controller('cameraReportController', ['$scope', '$http', '$cordovaCamera', '$ionicPlatform', function ($scope, $http, $cordovaCamera, $ionicPlatform) {

    //Used to determine whether camera is taken or not and display it if it is. 
    $scope.picturetaken = false;

    //Interacts with corresponding factory that calls on platform specific API (Android or iOS) to handle the taking of pictures
    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };

        $ionicPlatform.ready(function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.imageURL = "data:image/jpeg;base64,"+imageData;
                $scope.picturetaken = true;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        });
    }
}]);

myApp.controller('popularGameViewController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    var allGames = [ ]; //variable that is used to obtain all games as delivered by the server
    $scope.popularGames = []; //stores what is to be displayed

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Obtain popular games from the server
    $http.get('http://matchup.neptunolabs.com/matchup/popular/games', config).
    success(function(data, status, headers, config) {

        allGames = angular.fromJson(data);
        //Initial push of items to popularGames. Not all are pushed to ease load on mobile device not needing to render more than necessary
        for(var i = 0; i <= 6; i++){
            if(allGames.length > 0) //Only push if there is something to push onto popularGames
                $scope.popularGames.push(allGames.shift());
        }
    }).
    error(function(data, status, headers, config) {
        console.log("error in popular games. popular game view");
    });

    //Function called by infinite scroll
    $scope.add = function () {
        if(allGames.length > 0) //Only push if there is something to push onto popularGames
            $scope.popularGames.push(allGames.shift());
        $scope.$broadcast('scroll.infiniteScrollComplete'); //Broadcasts to infinite scroll that function has completed. 
    };

    //Used by ng-if and establishes if allGames is empty than no longer call infinite scroll function
    $scope.allGamesIsEmpty = function () {
        return allGames.length > 0;    
    };

    $scope.goToGameProfile = function (gameName, gameImage) {
        //Store parameters in array to send at the same time through sharedDataService
        var params = [gameImage, gameName];
        sharedDataService.set(params);
        $state.go('app.game.summary', {"gamename": gameName});
    };

}]);

myApp.controller('loginController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {



    $scope.credentials = { }; //Tied to ng-model and stores user crdedentials. Username is stored in $scope.credentials.userEmail and password in $scope.credentials.userPassword

    $scope.error = false; //If true display error message. True if user inputs incorrect credentials.
    $scope.login = function () {

        // Base 64 encoding
        var AuHeader = 'Basic ' + btoa($scope.credentials.userEmail + ':' + $scope.credentials.userPassword);
        var config = {
            headers: {
                'Authorization': AuHeader
            }
        }; 

        //Server verifies credential. Credentials are passed through the header. If successful, server returns token
        $http.post('http://136.145.116.232/login', {}, config).success(function (data) {
            var tokenObj = angular.fromJson(data);
            console.log(tokenObj);
            // save token in session
            $window.sessionStorage.token = tokenObj.token;
            $window.sessionStorage.username = $scope.credentials.userEmail;
            // reset error variable
            $scope.error = false;
            // change view
            $state.go('app.home');
        }).error(function (err) {
            $scope.error = true;
        });
    };
}]);

myApp.controller('createAccountController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    $scope.newAccount = { };

    $scope.createAccount = function () {

        $http.post('http://136.145.116.232/create/account', {
            "username": $scope.newAccount.username,
            "email": $scope.newAccount.email,
            "first_name": $scope.newAccount.firstName,
            "last_name": $scope.newAccount.lastName,
            "tag": $scope.newAccount.Tag,
            "password": $scope.newAccount.password
        }).success(function (data) {

            console.log("made account with username"+$scope.username);
            $state.go('login');

        }).error(function (err) {
            console.log("error in createAccountController");
        });
    };

}]);

myApp.controller('sidebarController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    //Load profile information of currently logged in user. The token is used by the server to obtain user credentials.
    $scope.$on('$ionicView.enter', function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Server call to obtain profile information of currently logged in user
        $http.get('http://136.145.116.232/matchup/profile', config).success(function (data) {

            $scope.loggedInUserProfileData = angular.fromJson(data);
            //Used in ng-style to change CSS parameters. Used to place the cover photo in the sidebar.
            $scope.coverPhotoCSS = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url("+data.customer_cover_photo+")";
            //Used in ng-style to change CSS parameters. Used to place the profile picture in the sidebar.
            $scope.profilePictureCSS =  "url("+data.customer_profile_pic+")";

        }).error(function (err) {
            console.log(err);

        });

        $http.get('http://136.145.116.232/matchup/profile/matchups?state=Upcoming', config).success(function (data) {

            $scope.notifications = angular.fromJson(data).length;

        }).error(function (err) {
            console.log(err);

        });



    });
    $scope.goToMyEvents = function (customer_username) {

        sharedDataService.set(customer_username);
        $state.go('app.myevents.melist', { "username":  customer_username});

    };

    $scope.goToRegisteredEvents = function (customer_username) {

        sharedDataService.set(customer_username);
        $state.go('app.registeredevents.relist');

    };

    $scope.goToMySubscriptions = function (customer_username) {

        sharedDataService.set(customer_username);
        $state.go('app.mysubscriptions');

    };

    $scope.goToProfile = function (customer_username) {

        sharedDataService.set(customer_username);
        $state.go('app.profile.summary', { "username":  customer_username});

    };

}]);

myApp.controller('myMatchupController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    $scope.$on('$ionicView.enter', function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/profile', config).success(function (data) {


            var tag = data.customer_tag;

            $http.get('http://matchup.neptunolabs.com/matchup/profile/matchups?state=Past', config).success(function (data) {

                $scope.matchups = angular.fromJson(data);

                $scope.loggedInUser = [ ];
                $scope.otherUser = [ ];

                angular.forEach($scope.matchups, function(matchup){

                    if(matchup.details[0].customer_tag == tag){
                        $scope.loggedInUser.push(matchup.details[0]);
                        $scope.otherUser.push(matchup.details[1]);
                    }
                    else{
                        $scope.loggedInUser.push(matchup.details[1]);
                        $scope.otherUser.push(matchup.details[0]);
                    }
                });

            }).error(function (err) {
                console.log(err);

            });

        }).error(function (err) {
            console.log(err);

        });

    });

    $scope.goToPastMatchup = function (matchup) {

        sharedDataService.set(matchup);
        $state.go('app.matchupmatch');

    };

}]);

myApp.controller('matchupMatchController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    $scope.$on('$ionicView.enter', function () {

        $scope.matchupInfo = sharedDataService.get();
        console.log($scope.matchupInfo);

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://matchup.neptunolabs.com/matchup/events/'+$scope.matchupInfo.event_name+'/tournaments/'+$scope.matchupInfo.tournament_name+'/rounds/'+$scope.matchupInfo.round_number+'/matches/'+$scope.matchupInfo.match_number+'?date='+$scope.matchupInfo.event_start_date+'&location='+$scope.matchupInfo.event_location+'&round_of='+$scope.matchupInfo.round_of+'', config).success(function (data) {

            $scope.players = data.players;
            $scope.matchInfo = data;
            var sets = data.sets;

            $scope.sets = [ ];

            var posZero = $scope.players[0].customer_username

            angular.forEach(sets, function(set){

                if(set.scores.length != 1){
                    if(posZero == set.scores[0].customer_username)
                        $scope.sets.push(set);
                    else{
                        var temp = set.scores[0];
                        set.scores[0] = set.scores[1];
                        set.scores[1] = temp;
                        $scope.sets.push(set);
                    }
                }
            });

            console.log($scope.sets);

        }).error(function (err) {
            console.log(err);

        });



    });


}]);


myApp.controller('notificationsController', ['$scope', '$http', '$state', 'sharedDataService', '$window', function ($scope, $http, $state, sharedDataService, $window) {

    //Load profile information of currently logged in user. The token is used by the server to obtain user credentials.
    $scope.$on('$ionicView.enter', function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };


        $http.get('http://136.145.116.232/matchup/profile/matchups?state=Upcoming', config).success(function (data) {

            $scope.matchups = angular.fromJson(data);

        }).error(function (err) {
            console.log(err);

        });

    });

    $scope.goToMatchupOngoing = function (matchupData) {

//        var matchupData = {
//            "event_name": "Event 01",
//            "event_start_date": "2015-03-25T09:00:00.000Z",
//            "event_location": "miradero",
//            "tournament_name": "Mortal Kombat X Qualifiers",
//            "round_number": 3,
//            "round_of": "Loser",
//            "match_number": 1,
//            "team_size": 1,
//            "station_number": null,
//            "details":
//            [
//                {
//                    "customer_tag": "samdlt",
//                    "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
//                    "score": "0"
//                },
//                {
//                    "customer_tag": "jems9102",
//                    "customer_profile_pic": "http://neptunolabs.com/images/juan.jpg",
//                    "score": "0"
//                }
//            ]
//        };

        sharedDataService.set(matchupData);
        $state.go('app.matchupoingoing');

    };

}]);

myApp.controller('matchupOngoingController', ['$scope', '$http', '$state', 'sharedDataService', '$window', '$timeout', function ($scope, $http, $state, sharedDataService, $window, $timeout) {

    $scope.$on('$ionicView.enter', function () {
        $scope.matchupInfo = sharedDataService.get();

        $scope.scoreInput = [ ];
        
        $scope.scoreInput.score = 'Win';

        $scope.matchCompleted = false;

        $scope.currentSet = 1;

        $scope.pollServer();
    });

    $scope.pollServer = function() {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };        

        $http.get('http://matchup.neptunolabs.com/matchup/events/'+$scope.matchupInfo.event_name+'/tournaments/'+$scope.matchupInfo.tournament_name+'/rounds/'+$scope.matchupInfo.round_number+'/matches/'+$scope.matchupInfo.match_number+'?date='+$scope.matchupInfo.event_start_date+'&location='+$scope.matchupInfo.event_location+'&round_of='+$scope.matchupInfo.round_of+'', config).success(function (data) {

            $scope.players = data.players;
            $scope.matchInfo = data;

            var sets = data.sets;

            $scope.sets = [ ];

            var posZero = $scope.players[0].customer_username

            angular.forEach(sets, function(set){
                if(set.scores.length != 1){
                    if(posZero == set.scores[0].customer_username)
                        $scope.sets.push(set);
                    else{
                        var temp = set.scores[0];
                        set.scores[0] = set.scores[1];
                        set.scores[1] = temp;
                        $scope.sets.push(set);
                    }
                }
            });

            angular.forEach($scope.sets, function(set){
                var foundSet = false;
                if(set.set_completed == false && !foundSet){
                    $scope.currentSet = set.set_seq;
                    foundSet = true;
                }
            });

            if($scope.sets[$scope.sets.length - 1].set_completed == true){
                $scope.matchCompleted = true;              
            }
            else{
                $timeout( function(){ $scope.pollServer(); }, 3000);
            }

        }).error(function (err) {
            console.log(err);
            $timeout( function(){ $scope.pollServer(); }, 3000);
        });
    }

    $scope.submitScore = function() {


        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        }; 

        console.log($scope.scoreInput.score);
        
        if($scope.scoreInput.score == 'Win'){        

            $http.post('http://matchup.neptunolabs.com/matchup/events/'+$scope.matchupInfo.event_name+'/tournaments/'+$scope.matchupInfo.tournament_name+'/rounds/'+$scope.matchupInfo.round_number+'/matches/'+$scope.matchupInfo.match_number+'/'+$scope.currentSet+'?date='+$scope.matchupInfo.event_start_date+'&location='+$scope.matchupInfo.event_location+'&round_of='+$scope.matchupInfo.round_of+'', {
                "score": 1

            }, config).success(function (data) {   


                console.log("submitted score");

            }).error(function (err) {
                console.log(err);
            });
        }
        
        else{
            $http.post('http://matchup.neptunolabs.com/matchup/events/'+$scope.matchupInfo.event_name+'/tournaments/'+$scope.matchupInfo.tournament_name+'/rounds/'+$scope.matchupInfo.round_number+'/matches/'+$scope.matchupInfo.match_number+'/'+$scope.currentSet+'?date='+$scope.matchupInfo.event_start_date+'&location='+$scope.matchupInfo.event_location+'&round_of='+$scope.matchupInfo.round_of+'', {
                "score": 0

            }, config).success(function (data) {   


                console.log("submitted score");

            }).error(function (err) {
                console.log(err);
            });

        }
    }

}]);