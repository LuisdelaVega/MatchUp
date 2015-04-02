var myApp = angular.module('my-events',[]);

myApp.controller('myEventsParentController', function ($scope, $ionicPopover, $state, sharedDataService, $window, $http) {

    $scope.customerUsername = sharedDataService.get();

    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/profile/'+$scope.customerUsername+'', config).success(function (data) {

        var eventData = data.events;
        $scope.pastEvents = [ ];

        for(event in eventData){
            var currentDateObj = new Date(event.event_start_date);
            if(currentDateObj > now_utc){
                $scope.pastEvents.push(event);
                $scope.liveEvents.push(event);
            }
            else{
                $scope.upcomingEvents.push(event);
            }
        }

    }).error(function (err) {
        console.log(err);
    });


});

myApp.controller('myEventsUpcomingController', function ($scope, $ionicPopover, $state, sharedDataService, $window, $http) {


});