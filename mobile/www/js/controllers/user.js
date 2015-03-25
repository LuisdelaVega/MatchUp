var myApp = angular.module('user',[]);

myApp.controller('ProfileController', function ($scope, $ionicPopover, $state) {
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
    $scope.goToEditProfile = function () {
        $scope.popover.hide();
        $state.go("app.editprofile");
    }
});

myApp.controller('myMatchupViewController', ['$scope', '$http', function ($scope, $http) {

    $scope.competitors = ['img/ron.jpg', 'img/ronpaul.gif'];

}]);

myApp.controller('subscriptionsController', ['$scope', '$http', function ($scope, $http) {

    $scope.isSubscribed = '-positive';

    $scope.toggleSubscribe = function () {
        if ($scope.isSubscribed == '-positive')
            $scope.isSubscribed = '';
        else
            $scope.isSubscribed = '-positive';
    };

}]);