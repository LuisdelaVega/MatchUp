var myApp = angular.module('App')

myApp.controller('gameController', ['$scope', function ($scope) {

    $scope.singers = ['img/csgo.jpg'];
    var moreImgs = ['img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg']
    $scope.add = function add(name) {
        if (moreImgs.length > 0)
            $scope.singers.push(moreImgs.pop());
        else {
            moreImgs.push($scope.singers.splice(0, 1)[0]);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    $scope.remove = function remove() {
        var num = ~~(Math.random() * $scope.singers.length);
        moreImgs.push($scope.singers[num]);
        $scope.singers.splice(num, 1)[0];
    };

}]);

myApp.controller('EventController', function ($scope, $ionicPopover) {
    $scope.events = 'hi';
    $ionicPopover.fromTemplateUrl('templates/events-popover.html', {
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