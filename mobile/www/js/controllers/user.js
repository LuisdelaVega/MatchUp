var myApp = angular.module('user',[]);

myApp.controller('ProfileController', function ($scope, $ionicPopover, $state, sharedDataService, $ionicPopup, $stateParams) {
    //Create popover event that allows further navigation to profile owner
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

    $scope.$on('$ionicView.enter', function () {

        $scope.customerUsername = sharedDataService.get();

    });
});

myApp.controller('profileSummaryController', ['$scope', '$http', '$window', '$stateParams', '$ionicPopup', '$timeout', '$state', function ($scope, $http, $window, $stateParams, $ionicPopup, $timeout, $state) {

    //Make server calls everytime upon entering profile. ENsures changes are visual when changing back to user profile.
    $scope.$on('$ionicView.enter', function () {

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

                    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'/matchups?state=Past', config).success(function (data){

                        $scope.matchups = data;

                        $scope.win = 0;
                        $scope.lose = 0;

                        angular.forEach($scope.matchups, function(matchup){

                            if(matchup.details[0].customer_username == $stateParams.username){
                                if(matchup.details[0].score > matchup.details[1].score)
                                    $scope.win++;
                                else
                                    $scope.lose++;
                            }
                            else{
                                if(matchup.details[1].score > matchup.details[0].score)
                                    $scope.win++;
                                else
                                    $scope.lose++;
                            }
                        });

                    }).error(function (err) {
                        console.log(err);
                    });

                }).error(function (err) {
                    console.log(err);
                });

            }).error(function (err) {
                console.log(err);
            });

        }).error(function (err) {
            console.log(err);
        });
    });

    $scope.subscribeToUser = function(username){

        //Create popup asking if user want to subscribe. Is activated by pressing the subscribe button.
        var myPopup = $ionicPopup.show({
            title: 'Do you want to subscribe?',
            scope: $scope,
            buttons: [
                { text: 'No' },
                {
                    text: '<b>Yes</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        var config = {
                            headers: {
                                'Authorization': "Bearer "+ $window.sessionStorage.token
                            }
                        };
                        //Call to subscribe to the user
                        $http.post('http://136.145.116.232/matchup/profile/'+username+'', {}, config).success(function (data) {


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

    $scope.goToOrganizationProfile = function (organizationName) {
        $state.go('app.organizationprofile', {"organizationname": organizationName});
    };

}]);

myApp.controller('profileStandingsController', ['$scope', '$http', '$stateParams', '$window', 'sharedDataService', '$state', '$filter', function ($scope, $http, $stateParams, $window, sharedDataService, $state, $filter) {

    $scope.$on('$ionicView.enter', function () {

        var customerUsername = sharedDataService.get();

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/profile/'+customerUsername+'', config).success(function (data){
            $scope.customerTag = data.customer_tag;

            $http.get('http://136.145.116.232/matchup/profile/'+customerUsername+'/standings', config).success(function (data){

                $scope.standings = data;

                angular.forEach($scope.standings, function(event){

                    $http.get('http://136.145.116.232/matchup/events/'+event.event_name+'?date='+event.event_start_date+'&location='+event.event_location+'', config).success(function (data){

                        event.event_logo = data.event_logo;

                    }).error(function (err) {
                        console.log(err);
                    });

                });

                console.log($scope.standings);

            }).error(function (err) {
                console.log(err);
            });

        }).error(function (err) {
            console.log(err);
        });

    });

    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20"); //Replace spaces with %20
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };


        //Server call to obtain event informtion
        $http.get('http://136.145.116.232/matchup/events/'+eventName+'?date='+date+'&location='+location+'', config).
        success(function(data, status, headers, config) {

            var eventData = angular.fromJson(data);

            var isHosted = eventData.host; //Server returns organization that is hosting the event. If the event does not have a host than the value returned is null.

            sharedDataService.set(params);

            //If isHosted is null, than the user is requesting to go to a regular event. Otherwise the user is going to a premium event. 
            if(isHosted != null){
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

    $scope.applyOrdinal = function (value) {

        var ordinal = $filter('ordinal');

        return ordinal(value);

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

    $scope.$on('$ionicView.enter', function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        var customerUsername = sharedDataService.get();

        //Event call has to be called from a seperate controller due to it being a seperate tab, therefore, this call occurs when the parent view is selected and run asynchronously from the server calls found in the summary tab. Other option is to call from a parent controller (ProfileController). This approach was used to reduce the scope of the controller to only where it is necessary.
        $http.get('http://136.145.116.232/matchup/profile/'+customerUsername+'/events', config).success(function (data) {

            $scope.eventsData = angular.fromJson(data);

        }).error(function (err) {
            console.log(err);
        });

        $scope.goToEvent = function(eventName, date, location){

            eventName = eventName.replace(" ", "%20");
            var params = [eventName, date, location];

            //Server call to get event information
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
    });

}]);

myApp.controller('editProfileController', ['$scope', '$http', '$stateParams', '$window', '$cordovaCamera', '$ionicPlatform', '$state', '$ionicLoading', function ($scope, $http, $stateParams, $window, $cordovaCamera, $ionicPlatform, $state, $ionicLoading) {

    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 44f5a38fc083775';

    $scope.user = { };

    //Ensures that server calls happens everytime user accesses the edit profile view with updated information
    $scope.$on('$ionicView.enter', function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Server call to obtain my own profile information
        $http.get('http://136.145.116.232/matchup/profile/', config).success(function (data) {

            var profileData = angular.fromJson(data);

            $scope.user.username = profileData.customer_username;
            $scope.user.tag = profileData.customer_tag;
            $scope.user.first_name = profileData.customer_first_name;
            $scope.user.last_name = profileData.customer_last_name;
            $scope.user.bio = profileData.customer_bio;
            $scope.user.cover = profileData.customer_cover_photo;
            $scope.user.profile_pic = profileData.customer_profile_pic;
            $scope.user.country = profileData.customer_country;
            $scope.user.email = profileData.customer_email;
            $scope.user.customer_paypal_info = profileData.customer_paypal_info;

        }).
        error(function (err){
            console.log("error in goToEvent");
        });
    });

    $scope.initialProfileState=true;

    $scope.editUserProfile = function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.put('http://matchup.neptunolabs.com/matchup/profile', $scope.user, config).success(function (data) {

            $scope.editedProfile = true;
            $scope.initialProfileState=false;

        }).
        error(function (err){

            $scope.editedProfile = false;
            $scope.initialProfileState=false;

        });
    };

    $scope.editedProfilePic = false;

    $scope.changeProfilePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY, //Open photo gallery instead of camera
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $ionicPlatform.ready(function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {

                $ionicLoading.show({
                    template: 'loading'
                });

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                //Call to upload image to imgur
                $http.post('https://api.imgur.com/3/image', {
                    "image": imageData
                }).success(function (data) {

                    $ionicLoading.hide();
                    $scope.user.profile_pic = data.data.link; //Here's the link

                }).
                error(function (err){
                    $ionicLoading.hide();
                    console.log("error in editProfileController");
                });
            })
        });
    }

    $scope.editedCoverPhoto = false;

    $scope.changeCoverPhoto = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY, //Open photo gallery instead of camera
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $ionicPlatform.ready(function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                $ionicLoading.show({
                    template: 'loading'
                });

                //Call to upload image to imgur
                $http.post('https://api.imgur.com/3/upload', {
                    "image": imageData
                }).success(function (data) {

                    $scope.user.cover = data.data.link; //Here's the link

                    $http.put('http://matchup.neptunolabs.com/matchup/profile', $scope.user, config).success(function (data) {

                        $ionicLoading.hide();
                        $scope.editedCoverPhoto = true; //Displays message if succesfully updated cover photo

                    }).
                    error(function (err){


                    });

                }).
                error(function (err){
                    console.log("error in editProfileController");
                });

            })
        });
    }

}]);


myApp.controller('profileTeamsController', ['$scope', '$http', '$stateParams', '$window', '$state', function ($scope, $http, $stateParams, $window, $state) {

    $scope.customerUsername = $stateParams.username; //Store in the scope of this controller the username found in stateParams. Can also use $window.sessionStorage.token

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Server call to get the teams the specified user belongs to.
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

    $scope.customerUsername = $stateParams.username; //Store in the scope of this controller the username found in stateParams. Can also use $window.sessionStorage.token

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Server call to get the organizations the specified user belongs to.
    $http.get('http://136.145.116.232/matchup/profile/'+$stateParams.username+'/organizations', config).success(function (data) {

        $scope.organizationsData = angular.fromJson(data);

    }).error(function (err) {
        console.log(err);
    });

    $scope.gotToProfile = function (customerUsername) {
        $state.go("app.profile.summary", {"username": customerUsername});
    };

}]);

myApp.controller('profileMatchupsController', ['$scope', '$http', '$stateParams', '$window', '$state', 'sharedDataService', function ($scope, $http, $stateParams, $window, $state, sharedDataService) {

    $scope.$on('$ionicView.enter', function () {

        var customerUsername = sharedDataService.get();

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://matchup.neptunolabs.com/matchup/profile/'+$window.sessionStorage.username+'/teams', config).success(function (data) {

            var myTeams = data;

            $http.get('http://matchup.neptunolabs.com/matchup/profile/matchups?state=Past', config).success(function (data) {

                $scope.matchups = angular.fromJson(data);
                $scope.loggedInUser = [ ];
                $scope.otherUser = [ ];

                angular.forEach($scope.matchups, function(matchup){

                    if(matchup.team_size == 1){
                        if(matchup.details[0].customer_username == $window.sessionStorage.username){
                            $scope.loggedInUser.push(matchup.details[0]);
                            $scope.otherUser.push(matchup.details[1]);
                        }
                        else{
                            $scope.loggedInUser.push(matchup.details[1]);
                            $scope.otherUser.push(matchup.details[0]);
                        }
                    }
                    else{

                        var foundTeam = false;
                        angular.forEach(myTeams, function(team){

                            if(matchup.details[0].team_name == team.team_name){

                                foundTeam = true;

                                $scope.loggedInUser.push(matchup.details[0]);
                                $scope.otherUser.push(matchup.details[1]);
                            }

                        });

                        if(!foundTeam){

                            $scope.loggedInUser.push(matchup.details[1]);
                            $scope.otherUser.push(matchup.details[0]);

                        }

                    }
                });

            }).error(function (err) {
                console.log(err);

            });

        }).error(function (err) {
            console.log(err);

        });

    });

}]);