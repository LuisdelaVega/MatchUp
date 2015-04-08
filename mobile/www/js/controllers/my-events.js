//*********NO LONGER IN USE***********
var myApp = angular.module('my-events',[]);

myApp.controller('myEventsParentController', function ($scope, $ionicPopover, $state, sharedDataService, $window, $http) {

    //obtain my events through sharedDataService
    $scope.customerUsername = sharedDataService.get();

    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()); //obtain current time in UTC

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Server call to obtain profile of selected user
    $http.get('http://136.145.116.232/matchup/profile/'+$scope.customerUsername+'', config).success(function (data) {

        var eventData = data.events;
        $scope.pastEvents = [ ];

        for(event in eventData){ //iterate over all events in eventdata
            var currentDateObj = new Date(event.event_start_date);
            if(currentDateObj > now_utc){
                $scope.pastEvents.push(event);
                $scope.liveEvents.push(event); //push into respective scopes depending on time of objects
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