var myApp = angular.module('App')

myApp.controller('gameController', ['$scope', function($scope) {

    $scope.singers = ['img/csgo.jpg'];
    var moreImgs = ['img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg']
    $scope.add = function add(name) {
        if (moreImgs.length>0)
            $scope.singers.push(moreImgs.pop());
        else {
            moreImgs.push($scope.singers.splice(0,1)[0]);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    $scope.remove = function remove() {
        var num = ~~(Math.random() * $scope.singers.length);
        moreImgs.push($scope.singers[num]);
        $scope.singers.splice(num,1)[0];
    };

}]);  
