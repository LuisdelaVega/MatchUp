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

// wtf is recontroller
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
                console.log('You');
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

myApp.controller('promotedEventController', ['$scope', '$http', function ($scope, $http) {

    $scope.isOngoing = false; //Set to true before the event as well

}]);

myApp.controller('writeReviewRatingsController', ['$scope', '$http', function ($scope, $http) {

    // set the rate and max variables
    $scope.rate = 3;
    $scope.max = 5;

}]);

myApp.controller('postNewsController', function ($scope, $stateParams, sharedDataService) {
    // Change title depending on type
    $scope.type = $stateParams.type;
    // Gets called before entering the view
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.type = $stateParams.type;
        if ($scope.type == 'Create') {

        } else {
            var result = sharedDataService.get();
            $scope.content = result['content'];
            $scope.title = result['title'];
        }
    });
});

myApp.controller('newsController', function ($scope, sharedDataService, $state, sharedDataService) {

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
        sharedDataService.set($scope.result.news[id]);
        console.log("in click");
        $state.go("app.postnews", {
            type: "Edit"
        })
    }
});