var myApp = angular.module('App')

//Good night sweet prince. We will always remember the way you danced.  
//myApp.controller('gameController', ['$scope', function($scope) {
//
//    $scope.games = ['img/csgo.jpg'];
//    var moreImgs = ['img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg']
//    $scope.add = function add(name) {
//        if (moreImgs.length>0)
//            $scope.games.push(moreImgs.pop());
//        else {
//            moreImgs.push($scope.games.splice(0,1)[0]);
//        }
//        $scope.$broadcast('scroll.infiniteScrollComplete');
//    }
//}]);  

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
})

myApp.controller('ProfileController', function ($scope, $ionicPopover,$state) {
    $ionicPopover.fromTemplateUrl('templates/profile/profile-popover.html', {
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
    
    // Close popover when clicking the popover item: Edit Profile
    $scope.goToEditProfile = function(){
        $scope.popover.hide();
        $state.go("app.editprofile");
    }
})

myApp.controller('RegularEventController', function ($scope) {

})

myApp.controller('PremiumEventController', function ($scope) {

});

myApp.controller('popularGameViewController', ['$scope', '$http', function($scope, $http) {

    $scope.games = ['img/csgo.jpg', 'img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg'];
    var moreImgs = ['img/csgo.jpg', 'img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg']

    $scope.add = function add(name) {
        if (moreImgs.length>0){
            $scope.games.push(moreImgs.pop());
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        else
            $scope.$broadcast('scroll.infiniteScrollComplete');
    }

}]);

myApp.controller('myMatchupViewController', ['$scope', '$http', function($scope, $http) {

    $scope.competitors = ['img/ron.jpg', 'img/ronpaul.gif'];

}]);  

myApp.controller('subscriptionsController', ['$scope', '$http', function($scope, $http) {

    $scope.isSubscribed = '-positive';

    $scope.toggleSubscribe = function() {
        if($scope.isSubscribed == '-positive')
            $scope.isSubscribed = '';
        else
            $scope.isSubscribed = '-positive';
    };

}]);

myApp.controller('searchResultController', ['$scope', '$stateParams', function($scope, $stateParams) {

    $scope.resultType = $stateParams.type;

}]); 

myApp.controller('REController', ['$scope', '$http', '$ionicPopup', function($scope, $http, $ionicPopup) {

    $scope.isOngoing = true;
    $scope.requiresTeam = true;

    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sign Up',
            template: 'Are you sure you want to sign up?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You');
            } else {
                console.log('No');
            }
        });
    };

}]);

myApp.controller('ratingsController', ['$scope', '$http', function($scope, $http) {

    // set the rate and max variables
    $scope.rate = 3;
    $scope.max = 5;

}]);

myApp.controller('promotedEventController', ['$scope', '$http', function($scope, $http) {

    $scope.isOngoing = false; //Set to true before the event as well

}]);

myApp.controller('cameraReportController', ['$scope', '$http', 'Camera', function($scope, $http, Camera) {

    $scope.picturetaken = false;

    $scope.takePicture = function() {
        console.log('Getting camera');
        Camera.getPicture().then(function(imageURI) {
            console.log(imageURI);
            $scope.imageURL = imageURI;
        }, function(err) {
            console.err(err);
        }, {
            quality: 75,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        });
    };
}]);

myApp.controller('writeReviewRatingsController', ['$scope', '$http', function($scope, $http) {

    // set the rate and max variables
    $scope.rate = 3;
    $scope.max = 5;

}]);