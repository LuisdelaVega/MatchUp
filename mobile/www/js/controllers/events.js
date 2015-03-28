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

myApp.controller('PremiumEventController', function ($scope) {

});

myApp.controller('RegularEventController', function ($scope) {

});