var myApp = angular.module('user',[]);

myApp.controller('ProfileController', function ($scope, $ionicPopover, $state, sharedDataService, $ionicPopup) {
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

myApp.controller('profileSummaryController', ['$scope', '$http', '$window', '$stateParams', '$ionicPopup', '$timeout', '$state', function ($scope, $http, $window, $stateParams, $ionicPopup, $timeout, $state) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };
    
    //Synchronously fetch profile info from server
    //Get profile information of specified user such as: tag, profile picture and cover photo. 
    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'', config).success(function (data) {

        $scope.profileData = angular.fromJson(data);
        $scope.myProfile = $scope.profileData.my_profile;

        //Get teams the user belongs to
        $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'/teams', config).success(function (data) {

            $scope.teams = angular.fromJson(data);

            //Get organizations the user belongs to
            $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'/organizations', config).success(function (data) {

                $scope.organizations = angular.fromJson(data);

            }).error(function (err) {
                console.log(err);
            });

        }).error(function (err) {
            console.log(err);
        });

    }).error(function (err) {
        console.log(err);
    });





    $scope.subscribeToUser = function(username){

        var myPopup = $ionicPopup.show({
            title: 'Do you want to subscribe?',
            scope: $scope,
            buttons: [
                { text: 'No' },
                {
                    text: '<b>Yes</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        //Call to subscribe to the user
                        $http.post('http://136.145.116.232/matchup/profile/'+username+'', {}, config).success(function (data) {
                            console.log('http://136.145.116.232/matchup/profile/'+username+'');
                            console.log("Subscribed to"+username+"");

                        }).error(function (err) {
                            console.log(err);
                        });

                    }
                }
            ]
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);

    }

    $scope.goToTeamProfile = function (teamName) {
        $state.go('app.teamprofile', {"teamname": teamName});
    };

}]);

myApp.controller('mySubscriptionsController', ['$scope', '$http', '$window', '$stateParams', '$ionicPopup', '$timeout', 'sharedDataService', function ($scope, $http, $window, $stateParams, $ionicPopup, $timeout, sharedDataService) {

    var customerUsername = sharedDataService.get();

    //Ensuring the subscriptions list is refreshed everytime the user accesses the view. Can cause unpredictable or glitchy behaviour without.
    $scope.$on('$ionicView.enter', function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Array containing button class depending if user is subscribed or not to the user found in that index. -positive is subscribed. -stable is unsubscribed.
        $scope.isSubscribed = [];

        //Call to get all subscriptions.
        $http.get('http://136.145.116.232/matchup/profile/'+customerUsername+'/subscriptions', config).success(function (data) {

            $scope.subscriptions = angular.fromJson(data);

            for(var i = 0; i < $scope.subscriptions.length; i++)
                $scope.isSubscribed.push('-positive'); //All users are subscribed to at the time of make the call initially

        }).error(function (err) {
            console.log(err);
        });
    });


    //Visually toggle and request the server remove/create subscriptions
    $scope.toggleSubscribe = function (index, username) {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };
        //isSubcribed is -positive, user is subscribed, therefore, call on server to unsubscribe. 
        if($scope.isSubscribed[index] === '-positive'){
            //Server call to unsubscribe
            $http.delete('http://136.145.116.232/matchup/profile/'+username+'', config).success(function (data) {

                $scope.isSubscribed[index] = '-stable'; //Visually change button state 

            }).error(function (err) {
                console.log(err);
            });
        }
        //If -stable, subscribe to user. 
        else{
            //Server call to subscribe
            $http.post('http://136.145.116.232/matchup/profile/'+username+'', {}, config).success(function (data) {

                $scope.isSubscribed[index] = '-positive'; //Visually change button state

            }).error(function (err) {
                console.log(err);
            });
        }          
    };

}]);

myApp.controller('profileEventsController', ['$scope', '$http', '$stateParams', '$window', 'sharedDataService', '$state', function ($scope, $http, $stateParams, $window, sharedDataService, $state) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Event call has to be called from a seperate controller due to it being a seperate tab, therefore, this call occurs when the parent view is selected and run asynchronously from the server calls found in the summary tab. Other option is to call from a parent controller (ProfileController). This approach was used to reduce the scope of the controller to only where it is necessary.
    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'/events', config).success(function (data) {

        $scope.eventsData = angular.fromJson(data);

    }).error(function (err) {
        console.log(err);
    });

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.hosted;

            sharedDataService.set(params);

            if(isHosted){
                $state.go('app.eventpremium', {"eventname": eventName, "date": date, "location": location});
            }
            else{
                $state.go('app.regularevent', {"eventname": eventName, "date": date, "location": location});
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });

    };

}]);


myApp.controller('myMatchupViewController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

    $scope.competitors = ['img/ron.jpg', 'img/ronpaul.gif'];

}]);

myApp.controller('editProfileController', ['$scope', '$http', '$stateParams', '$window', function ($scope, $http, $stateParams, $window) {

    $scope.$on('$ionicView.enter', function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/profile/', config).success(function (data) {

            var profileData = angular.fromJson(data);

            $scope.tag = profileData.customer_tag;
            $scope.firstName = profileData.customer_first_name;
            $scope.lastName = profileData.customer_last_name;
            $scope.bio = profileData.customer_bio;
            $scope.coverPhoto = profileData.customer_cover_photo;
            $scope.profilePic = profileData.customer_profile_pic;


        }).
        error(function (err){
            console.log("error in goToEvent");
        });


    });

}]);


myApp.controller('profileTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state', function ($scope, $http, $stateParams, $window, $state) {

    $scope.customerUsername = $stateParams.username;

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'/teams', config).success(function (data) {

        $scope.teams = angular.fromJson(data);

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

    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'/organizations', config).success(function (data) {

        $scope.organizationsData = angular.fromJson(data);

    }).error(function (err) {
        console.log(err);
    });

    $scope.gotToProfile = function (customerUsername) {
        $state.go("app.profile.summary", {"username": customerUsername});
    };

}]);