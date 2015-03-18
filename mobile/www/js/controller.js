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