var myApp = angular.module('events',[]);

myApp.controller('EventController', function ($scope, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/events/events-popover.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
});

myApp.controller('RegularEventController', function ($scope) {

});

myApp.controller('PremiumEventController', function ($scope) {

});

myApp.controller('REController', ['$scope', '$http', '$ionicPopup', function ($scope, $http, $ionicPopup) {

    $scope.isOngoing = true;
    $scope.requiresTeam = true;

    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sign Up',
            template: 'Are you sure you want to sign up?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('Yes');
            } else {
                console.log('No');
            }
        });
    };

}]);

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
    $scope.date = params[1];
    $scope.location = params[2];
});

myApp.controller('eventPremiumSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    $scope.$on('$ionicView.beforeEnter', function () {

        $http.get('http://136.145.116.232/events/'+$scope.eventName+'?date='+$scope.date+'&location='+$scope.location+'').
        success(function(data, status, headers, config) {

            var eventPremiumData = angular.fromJson(data);

            $scope.eventInfo = eventPremiumData;
            $scope.isOngoing = eventPremiumData.info.is_hosted;


        }).
        error(function(data, status, headers, config) {
            console.log("error in eventPremiumParentController");
        });
    });

    $scope.goToMeetup = function (eventName) {
        
        eventName = eventName.replace(" ", "%20");
        sharedDataService.set(eventName);
        $state.go("app.meetups")
    }
    
    $scope.goToReview = function (eventName) {
        
        eventName = eventName.replace(" ", "%20");
        sharedDataService.set(eventName);
        $state.go("app.writereview")
    }
});

myApp.controller('meetupController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    $scope.eventName = sharedDataService.get();

    $scope.goToSummaryFromMeetup = function (eventName) {
        
        eventName = eventName.replace(" ", "%20");
        sharedDataService.set(eventName);
        $state.go("app.eventpremium.summary", {
            eventname: $scope.eventName
        })
    }

});

myApp.controller('writeReviewController', function ($scope, $state, $http, $stateParams, sharedDataService) {

    $scope.eventName = sharedDataService.get();
    
    $scope.goToSummaryFromReview = function (eventName) {
        
        eventName = eventName.replace(" ", "%20");
        sharedDataService.set(eventName);
        $state.go("app.eventpremium.summary", {
            eventname: $scope.eventName
        })
        
    }
});