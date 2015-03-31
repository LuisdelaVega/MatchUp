var myApp = angular.module('user',[]);

myApp.controller('ProfileController', function ($scope, $ionicPopover, $state, sharedDataService) {
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

    $scope.customerUsername = sharedDataService.get();


});

myApp.controller('profileSummaryController', ['$scope', '$http', '$window', '$stateParams', function ($scope, $http, $window, $stateParams) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'', config).success(function (data) {

        $scope.profileData = data;
        $scope.myProfile = data.info.my_profile;
        
    }).error(function (err) {
        console.log(err);
    });
}]);

myApp.controller('profileEventsController', ['$scope', '$http', '$stateParams', '$window', function ($scope, $http, $stateParams, $window) {
    
    console.log("entered profileEventsController");

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'', config).success(function (data) {

        $scope.eventsData = data.events;
        console.log($scope.eventsData);

    }).error(function (err) {
        console.log(err);
    });

}]);


myApp.controller('myMatchupViewController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

    $scope.competitors = ['img/ron.jpg', 'img/ronpaul.gif'];

}]);


myApp.controller('profileTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state', function ($scope, $http, $stateParams, $window, $state) {

    $scope.customerUsername = $stateParams.username;

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'', config).success(function (data) {

        $scope.teamsData = data.teams;

    }).error(function (err) {
        console.log(err);
    });

    $scope.gotToProfile = function (customerUsername) {
        $state.go("app.profile.summary", {"username": customerUsername});
    };

}]);

myApp.controller('profileOrganizationsController', ['$scope', '$http', '$stateParams', '$window', '$state', function ($scope, $http, $stateParams, $window, $state) {

    $scope.customerUsername = $stateParams.username;

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'', config).success(function (data) {

        $scope.organizationsData = data.organizations;

    }).error(function (err) {
        console.log(err);
    });

    $scope.gotToProfile = function (customerUsername) {
        $state.go("app.profile.summary", {"username": customerUsername});
    };

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