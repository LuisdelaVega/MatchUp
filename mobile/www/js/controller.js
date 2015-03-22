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
    $scope.events = 'hi';
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

    $scope.isOngoing = false;
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