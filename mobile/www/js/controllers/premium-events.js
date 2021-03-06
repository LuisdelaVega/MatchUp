var myApp = angular.module('premium-events',[]);

//myApp.run(function($rootScope, $cordovaInAppBrowser, $ionicPlatform){
//    $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
//        if (event.url.match("/paypalSuccess")) {
//            $ionicPlatform.ready(function() {
//                $cordovaInAppBrowser.close();
//            });
//        }
//    });
//});


myApp.controller('ratingsController', ['$scope', '$http', '$stateParams', '$window', '$state', function ($scope, $http, $stateParams, $window, $state) {

    $scope.$on('$ionicView.enter', function () {

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

        $scope.goToEvent = function(){
            $state.go("app.eventpremium", {
                eventname: $stateParams.eventname,
                date: $stateParams.date,
                location: $stateParams.location
            });
        }; 

    });

    $scope.goToWriteReview = function(){
        $state.go("app.writereview", {
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        });
    };

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


    $scope.$on('$ionicView.enter', function () {

        $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
        success(function(data, status, headers, config) {

            $scope.isOrganizer = data.is_organizer;

            //Obtain news of currently selected event
            $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/news?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
            success(function(data, status, headers, config) {

                console.log('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/news?date='+$stateParams.date+'&location='+$stateParams.location+'');

                $scope.news = angular.fromJson(data);

            }).
            error(function(data, status, headers, config) {
                console.log("error in eventPremiumSummaryController");
            });

        }).
        error(function(data, status, headers, config) {
            console.log("error in eventPremiumSummaryController");
        });


    });

    // Send data to post news controller
    $scope.clickEdit = function (id) {
        var values = [$scope.news[id], $stateParams.eventname, $stateParams.date, $stateParams.location]; 
        sharedDataService.set(values);
        $state.go("app.postnews", {
            type: "Edit",
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        })
    }

    // Send data to post news controller
    $scope.clickAdd = function (id) {
        var values = [$scope.news[id], $stateParams.eventname, $stateParams.date, $stateParams.location]; 
        sharedDataService.set(values);
        $state.go("app.postnews", {
            type: "Add",
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

myApp.controller('createMeetupController', function ($scope, $state, $http, $stateParams, sharedDataService, $ionicPopup, $window, $filter) {


    $scope.submitMeetup = function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $scope.meetup.start_date = new Date($filter('date')(new Date($scope.meetup.start_date), 'yyyy-MM-dd HH:mm:ss'));
        $scope.meetup.end_date= new Date($filter('date')(new Date($scope.meetup.end_date), 'yyyy-MM-dd HH:mm:ss'));

        $http.post('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/meetups?date='+$stateParams.date+'&location='+$stateParams.meetup+'', $scope.meetup, config).
        success(function(data, status, headers, config) {

            var confirmPopup = $ionicPopup.alert({
                title: 'Host Meetup',
                template: 'You have successfully submitted your meetup!'
            });

            confirmPopup.then(function (res) {
                $state.go("app.meetups", {
                    eventname: $stateParams.eventname,
                    date: $stateParams.date,
                    location: $stateParams.location
                })
            });
        }).
        error(function(data, status, headers, config) {
            console.log("error in eventPremiumSummaryController");
        });
    }
    $scope.meetup = { };

});

myApp.controller('premiumSignUpController', function ($scope, $state, $http, $stateParams, sharedDataService, $window, $cordovaInAppBrowser, $rootScope, $ionicPlatform, $ionicPopup) {

    $scope.returnToPremiumEvent = function () {
        $state.go("app.eventpremium", {
            eventname: $stateParams.eventname,
            date: $stateParams.date,
            location: $stateParams.location
        })
    }

    $scope.$on('$ionicView.enter', function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $scope.spectator = [ ];

        $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/specfees?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
        success(function(data, status, headers, config) {

            $scope.spectatorFees = data;

        }).
        error(function(data, status, headers, config) {
            console.log("error in eventPremiumSummaryController");
        });

    });

    $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){

        if(event.url.match("matchup.neptunolabs.com")) {
            $ionicPlatform.ready(function() {
                $cordovaInAppBrowser.close();

                var confirmPopup = $ionicPopup.alert({
                    title: 'Successful Signup',
                    template: 'You have successfully signed up as a spectator!'
                });

                confirmPopup.then(function (res) {
                    $state.go("app.eventpremium", {
                        eventname: $stateParams.eventname,
                        date: $stateParams.date,
                        location: $stateParams.location
                    });
                });

            });
        }
    });

    $scope.signUpSpectator = function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
        };

        $http.post('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/specfees/'+$scope.spectator.Fee+'?date='+$stateParams.date+'&location='+$stateParams.location+'', { }, config).success(function(data, status, headers, config) {

            if(status == 200){
                $ionicPlatform.ready(function() {
                    $cordovaInAppBrowser.open('https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=' + data.payKey, '_blank', options).then(function () {
                    }, function (error) {
                        console.log("Error: " + error);
                    });
                });
            }

            else if (status == 201){
                $state.go("app.eventpremium", {
                    eventname: $stateParams.eventname,
                    date: $stateParams.date,
                    location: $stateParams.location
                });   
            }
        }).
        error(function(data, status, headers, config) {
            console.log("error in eventPremiumSummaryController");
        });

    }

});

myApp.controller('eventPremiumSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService, $window) {

    //Every time a premium event is navigated to, obtain params from sharedDataService.
    $scope.$on('$ionicView.enter', function () {
        var params = sharedDataService.get();   
        $scope.eventName = params[0];
        $scope.date =  params[1];
        $scope.location =  params[2];

        var now = new Date(); 
        var now_utc = new Date();


        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Server call to get event info
        $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
        success(function(data, status, headers, config) {

            $scope.eventInfo = angular.fromJson(data);
            var startDate = new Date($scope.eventInfo.event_start_date);

            $scope.isOngoing = now_utc > startDate;

            $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/tournaments?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
            success(function(data, status, headers, config) {

                $scope.tournamentsInfo = angular.fromJson(data);

                $http.get('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/sponsors?date='+$stateParams.date+'&location='+$stateParams.location+'', config).
                success(function(data, status, headers, config) {

                    $scope.sponsors = angular.fromJson(data);

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
    });

    $scope.goToReviews = function (eventName, eventDate, eventLocation) {

        eventName = eventName.replace(" ", "%20");
        $state.go("app.review", {
            eventname: eventName,
            date: eventDate,
            location: eventLocation
        })
    }

    $scope.goToSignUp = function (eventName, eventDate, eventLocation) {

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(params);
        $state.go("app.premiumsignup")
    }

    $scope.goToMeetup = function (eventName, eventDate, eventLocation) {

        eventName = eventName.replace(" ", "%20"); //Replace spaces with a %20
        $state.go("app.meetups", {
            eventname: eventName,
            date: eventDate,
            location: eventLocation
        })
    }

    $scope.goToReview = function (eventName, eventDate, eventLocation, selectedTournament) {

        eventName = eventName.replace(" ", "%20"); //Replace spaces with a %20
        var params = [eventName, eventDate, eventLocation];
        $state.go("app.writereview")
    }

    $scope.goToTournament = function (eventName, eventDate, eventLocation, selectedTournament) {

        eventName = eventName.replace(" ", "%20"); //Replace spaces with a %20
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(selectedTournament);
        $state.go("app.regularevent", {
            eventname: eventName,
            date: eventDate,
            location: eventLocation
        })
    }

    $scope.goToNews = function (eventName, eventDate, eventLocation, selectedTournament) {

        eventName = eventName.replace(" ", "%20"); //Replace spaces with a %20
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

myApp.controller('writeReviewController', function ($scope, $state, $http, $stateParams, sharedDataService, $ionicPopup, $window) {

    $scope.review = { };

    $scope.max = 5;

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $scope.submitReview = function (eventName) {

        $http.post('http://136.145.116.232/matchup/events/'+$stateParams.eventname+'/reviews?date='+$stateParams.date+'&location='+$stateParams.location+'', $scope.review, config).
        success(function(data, status, headers, config) {

            var confirmPopup = $ionicPopup.alert({
                title: 'Write Review',
                template: 'You have successfully submitted your review!'
            });

            confirmPopup.then(function (res) {
                $state.go("app.review", {
                    eventname: $stateParams.eventname,
                    date: $stateParams.date,
                    location: $stateParams.location
                });
            });
        }).
        error(function(data, status, headers, config) {
            console.log("error in eventPremiumSummaryController");
        });
    }
});