var myApp = angular.module('premium-events',[]);


myApp.controller('ratingsController', ['$scope', '$http', '$stateParams', '$window', function ($scope, $http, $stateParams, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };
    //get the reviews from all values found in the server
    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/reviews?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
    success(function(data, status, headers, config) {

        $scope.reviews = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in eventPremiumSummaryController");
    });

}]);


myApp.controller('writeReviewRatingsController', ['$scope', '$http', function ($scope, $http) {

    // Default rate and max variables. Editable by user.
    $scope.rate = 3;
    $scope.max = 5;

}]);

myApp.controller('postNewsController', function ($scope, $stateParams, $state, sharedDataService) {
    var values = sharedDataService.get();
    // Change title depending on type
    $scope.type = $stateParams.type;
    // Gets called before entering the view
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.type = $stateParams.type;
        if ($scope.type == 'Create') {

        } else {

            var result = values[0];
            $scope.content = result['content'];
            $scope.title = result['title'];
        }
    });

    $scope.eventName = values[1];

    $scope.goToEvent = function(){
        $state.go("app.eventpremium", {
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        });
    };  
});

myApp.controller('newsController', function ($scope, sharedDataService, $stateParams, $state, $http, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Obtain news of currently selected event
    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/news?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
    success(function(data, status, headers, config) {

        $scope.news = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in eventPremiumSummaryController");
    });

    // Send data to post news controller
    $scope.clickEdit = function (id) {
        var values = [$scope.news[id], $stateParams.eventname, $stateParams.date, $stateParams.location]; 
        sharedDataService.set(values);
        console.log("in click");
        $state.go("app.postnews", {
            type: "Edit",
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        })
    }
    $scope.goToEventFromNews = function () {

        $state.go("app.eventpremium", {
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        }) 

    }
});


myApp.controller('eventPremiumParentController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    //Every time a premium event is navigated to, obtain params from sharedDataService.
    $scope.$on('$ionicView.enter', function () {
        var params = sharedDataService.get();   
        $scope.eventName = params[0];
        $scope.date =  params[1];
        $scope.location =  params[2];
    });
});

myApp.controller('createMeetupController', function ($scope, $state, $http, $stateParams, sharedDataService) {


    $scope.goToMeetups = function () {

        $state.go("app.meetups", {
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        })
    };
    
});

myApp.controller('premiumSignUpController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    var params = sharedDataService.get();

    $scope.returnToPremiumEvent = function () {

        $state.go("app.eventpremium", {
            eventname: params[0],
            date: params[1],
            location: params[2]
        })

    }

});

myApp.controller('eventPremiumSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService, $window) {

    //Every time a premium event is navigated to, obtain params from sharedDataService.
    $scope.$on('$ionicView.enter', function () {
        var params = sharedDataService.get();   
        $scope.eventName = params[0];
        $scope.date =  params[1];
        $scope.location =  params[2];
    });

    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());


    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
    success(function(data, status, headers, config) {
        $scope.eventInfo = angular.fromJson(data);
        var startDate = new Date($scope.eventInfo.event_start_date);

        if(startDate > now_utc)
            $scope.isOngoing = false;
        else
            $scope.isOngoing = true;

        $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
        success(function(data, status, headers, config) {

            $scope.tournamentsInfo = angular.fromJson(data);

            $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/sponsors?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
            success(function(data, status, headers, config) {

                $scope.sponsors = angular.fromJson(data);

                console.log($http.pendingRequests);


            }).
            error(function(data, status, headers, config) {
                console.log("error in eventPremiumSummaryController");
            });

        }).
        error(function(data, status, headers, config) {
            console.log("error in eventPremiumSummaryController");
        });

    }).
    error(function(data, status, headers, config) {
        console.log("error in eventPremiumSummaryController");
    });



    $scope.goToSignUp = function (eventName, eventDate, eventLocation) {

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(params);
        $state.go("app.premiumsignup")
    }

    $scope.goToMeetup = function (eventName, eventDate, eventLocation) {

        eventName = eventName.replace(" ", "%20");
        $state.go("app.meetups", {
            eventname: eventName,
            date: eventDate,
            location: eventLocation
        })
    }

    $scope.goToReview = function (eventName, eventDate, eventLocation, selectedTournament) {

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(params);
        $state.go("app.writereview")
    }

    $scope.goToTournament = function (eventName, eventDate, eventLocation, selectedTournament) {


        eventName = eventName.replace(" ", "%20");
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(selectedTournament);
        $state.go("app.regularevent", {
            eventname: eventName,
            date: eventDate,
            location: eventLocation
        })
    }

    $scope.goToNews = function (eventName, eventDate, eventLocation, selectedTournament) {


        eventName = eventName.replace(" ", "%20");
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(selectedTournament);
        $state.go("app.news", {
            eventname: eventName,
            date: eventDate,
            location: eventLocation
        })
    }

});

myApp.controller('meetupController', function ($scope, $state, $http, $stateParams, sharedDataService, $window) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };


    //Get meetups added to the event
    $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/meetups?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
    success(function(data, status, headers, config) {

        $scope.meetups = angular.fromJson(data);


    }).
    error(function(data, status, headers, config) {
        console.log("error in eventPremiumSummaryController");
    });

    $scope.goToSummaryFromMeetup = function () {

        $state.go("app.eventpremium", {
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        })
    };

    $scope.goToCreateMeetup = function () {

        $state.go("app.createmeetup", {
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        })
    };

});

myApp.controller('writeReviewController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    var params = sharedDataService.get();

    $scope.goToSummaryFromReview = function (eventName) {

        $state.go("app.eventpremium", {
            eventname: params[0],
            date: params[1],
            location: params[2]
        })

    }
});