var myApp = angular.module('premium-events',[]);


myApp.controller('ratingsController', ['$scope', '$http', function ($scope, $http) {

    // set the rate and max variables
    $scope.rate = 3;
    $scope.max = 5;

}]);


myApp.controller('writeReviewRatingsController', ['$scope', '$http', function ($scope, $http) {

    // set the rate and max variables
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

    $scope.goToEvent = function(eventName){

        eventName = eventName.replace(" ", "%20");
        $state.go('app.eventpremium.news', {"eventname": eventName});
        sharedDataService.set(eventName);
    };  
});

myApp.controller('newsController', function ($scope, sharedDataService, $stateParams, $state) {

    $scope.result = {
        "news": [
            {
                "title": "Venue Changed Again",
                "date": "November 01,2015",
                "content": "Street art pork belly stumptown farm-to-table. Disrupt chillwave tote bag occupy art party, master cleanse vegan 3 wolf moon polaroid Schlitz Austin sustainable plaid. Try-hard tattooed meditation Tumblr vinyl meh. Fanny pack freegan Schlitz Tumblr kogi. Pickled Marfa retro gastropub Blue Bottle. Drinking vinegar cray Banksy migas craft beer. Intelligentsia brunch art party flexitarian, disrupt chia normcore post-ironic leggings raw denim tote bag hella polaroid 8-bit."
            },
            {
                "title": "Venue Changed",
                "date": "November 01,2015",
                "content": "This is a test"
            }
        ]
    };

    // Send data to post news controller
    $scope.clickEdit = function (id) {
        var values = [$scope.result.news[id], $stateParams.eventname]; 
        sharedDataService.set(values);
        console.log("in click");
        $state.go("app.postnews", {
            type: "Edit"
        })
    }
});


myApp.controller('eventPremiumParentController', function ($scope, $state, $http, $stateParams, sharedDataService) {
    var params = sharedDataService.get();   
    $scope.eventName = params[0];
    $scope.date =  params[1];
    $scope.location =  params[2];

    console.log('Entered abstract controller of eventPremium');
});

myApp.controller('premiumSignUpController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    var params = sharedDataService.get();

    $scope.returnToPremiumEvent = function () {

        $state.go("app.eventpremium.summary", {
            eventname: params[0],
            date: params[1],
            location: params[2]
        })

    }

});

myApp.controller('eventPremiumSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    $http.get('http://136.145.116.232/events/'+$stateParams.eventname+'?date='+$stateParams.date+'&location='+$stateParams.location+'').
    success(function(data, status, headers, config) {

        $scope.eventInfo = angular.fromJson(data);
        var startDate = new Date($scope.eventInfo.info.event_start_date);

        if(startDate > now_utc)
            $scope.isOngoing = false;
        else
            $scope.isOngoing = true;



        console.log('Event start date:'+ startDate);
        console.log('Current date:'+ now_utc);

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
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(params);
        $state.go("app.meetups")
    }

    $scope.goToReview = function (eventName, eventDate, eventLocation) {

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, eventDate, eventLocation];
        sharedDataService.set(params);
        $state.go("app.writereview")
    }
});

myApp.controller('meetupController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    var params = sharedDataService.get();

    $scope.goToSummaryFromMeetup = function (eventName) {

        $state.go("app.eventpremium.summary", {
            eventname: params[0],
            date: params[1],
            location: params[2]
        })
    }

});

myApp.controller('writeReviewController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    var params = sharedDataService.get();

    $scope.goToSummaryFromReview = function (eventName) {

        $state.go("app.eventpremium.summary", {
            eventname: params[0],
            date: params[1],
            location: params[2]
        })

    }
});