var myApp = angular.module('genres',[]);

myApp.controller('genreController', function ($scope, $ionicPopover, sharedDataService, $state) {

    $scope.goToGenreProfile = function(genreName){

        sharedDataService.set(genreName);
        $state.go('app.genre.upcoming');
        console.log(genreName); 
    };

});

myApp.controller('genreProfileController', function ($scope, $ionicPopover, sharedDataService) {

    $scope.selectedGenre = sharedDataService.get();

});

myApp.controller('genreUpcomingProfileController', function ($scope, $ionicPopover, sharedDataService) {

    $scope.selectedGenre = sharedDataService.get();

});

myApp.controller('genreLiveProfileController', function ($scope, $ionicPopover, sharedDataService) {

    $scope.selectedGenre = sharedDataService.get();

});

myApp.controller('genreHistoryProfileController', function ($scope, $ionicPopover, sharedDataService) {

    $scope.selectedGenre = sharedDataService.get();

});