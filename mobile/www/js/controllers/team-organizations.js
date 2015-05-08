var myApp = angular.module('team-organizations',[]);

// Popup for adding a team member, change id to index when using ng-repeat
myApp.controller("addTeamMemberController", ['$scope', '$ionicPopup', '$http', '$window', '$stateParams', '$state', function ($scope, $ionicPopup, $http, $window, $stateParams, $state) {
    //Confirm dialogue asking whether the user would like to add specified user to the team
    $scope.showConfirm = function (name, username) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Add Team Member',
            template: 'Are you sure you want to add ' + name + ''
        });
        confirmPopup.then(function (res) {
            if (res) {

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                $http.post('http://matchup.neptunolabs.com/matchup/teams/'+$stateParams.teamname+'/members?username='+username+'', {}, config).success(function(data, status, headers, config) {

                    console.log("successfully added"+name);

                }).
                error(function(data, status, headers, config) {
                    console.log("error getting team info");    
                });

            } else {
                //Do nothing
            }
        });
    };


    //Funtion that is called everytime the value in the search box is changed.
    $scope.search = function (query) {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Search only if there is content in the search box
        if(query.length > 0){
            $http.get('http://136.145.116.232/matchup/search/'+query+'', config).
            success(function(data, status, headers, config) {

                var searchData = angular.fromJson(data);
                $scope.users = searchData.users;

            }).
            error(function(data, status, headers, config) {
                console.log("error in search controller");
            });
        }

        //Failsafe to make sure that if search parameter is 0 than there should be nothing displaying
        else{

            $scope.users.length = 0

        }

    };

    $scope.returnToEditTeams = function () {
        $state.go('app.teamprofilemembers', {"teamname": $stateParams.teamname});
    };

}]);

// Popup for removing a team member, change id to index when using ng-repeat
myApp.controller("removeTeamMemberController", ['$scope', '$ionicPopup', '$http', '$window', '$stateParams', '$state', function ($scope, $ionicPopup, $http, $window, $stateParams, $state) {
    // A confirm dialog
    $scope.showConfirm = function (name, username) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Member',
            template: 'Are you sure you want to remove ' + name + ''
        });
        confirmPopup.then(function (res) {
            if (res) {

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                $http.delete('http://matchup.neptunolabs.com/matchup/teams/'+$stateParams.teamname+'/members?username='+username+'', config).success(function(data, status, headers, config) {

                    console.log("Succesfully remove"+name);

                }).
                error(function(data, status, headers, config) {
                    console.log("error getting team info");    
                });

                $http.get('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'/members', config).
                success(function(data, status, headers, config) {

                    var teamProfileData = angular.fromJson(data);
                    $scope.players = teamProfileData;

                }).
                error(function(data, status, headers, config) {
                    console.log("error getting team info");    
                });

            } else {
                //Do nothing
            }
        });
    };

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $scope.$on('$ionicView.enter', function () {
        //Server call to obtain members of the specified team
        $http.get('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'/members', config).
        success(function(data, status, headers, config) {

            var teamProfileData = angular.fromJson(data);
            $scope.players = teamProfileData;

        }).
        error(function(data, status, headers, config) {
            console.log("error getting team info");    
        });
    });

    $scope.makeCaptain = function (username) {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        var confirmPopup = $ionicPopup.confirm({
            title: 'Make Team Member',
            template: 'Assigning this player as team captain will remove you as team captain. Would you like to continue?'
        });

        confirmPopup.then(function (res) {
            if (res) {

                $http.put('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'/members?username='+username+'', { }, config).
                success(function(data, status, headers, config) {

                    $state.go('app.teamprofile', {"teamname": $stateParams.teamname});

                }).
                error(function(data, status, headers, config) {
                    console.log("error getting team info");    
                });

            }
        });


    };

    $scope.returnToTeamProfile = function () {
        $state.go('app.teamprofile', {"teamname": $stateParams.teamname});
    };

    $scope.goToAddTeamMember = function () {
        $state.go('app.addteammember', {"teamname": $stateParams.teamname});
    };

}]);

myApp.controller('teamController', function ($scope, $ionicPopover, $state, $ionicPopup, $stateParams, $http, $window) {

    //Create popover event that allows further navigation to team members
    $ionicPopover.fromTemplateUrl('templates/teamprofile/popover.html', {
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
    $scope.goToEditTeam = function () {
        $scope.popover.hide();
        $state.go("app.editteam", {"teamname": $stateParams.teamname});
    }

    // A confirm dialog for deletion of team
    $scope.deleteTeamPopup = function () {
        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Team',
            template: 'Are you sure you want to delete the team?'
        });
        confirmPopup.then(function (res) {
            if (res) {

            } else {

            }
        });
    };

    $scope.leaveTeamPopup = function () {
        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Team',
            template: 'Are you sure you want to leave the team?'
        });
        confirmPopup.then(function (res) {
            if (res) {

                $scope.popover.hide();

                if($scope.loggedInUserIsCaptain){

                    var alertPopup = $ionicPopup.alert({
                        title: 'Leave Team',
                        template: 'You can\'t leave the team captainless!'
                    });
                }

                else{

                    var config = {
                        headers: {
                            'Authorization': "Bearer "+ $window.sessionStorage.token
                        }
                    };

                    $http.delete('http://matchup.neptunolabs.com/matchup/teams/'+$stateParams.teamname+'/members?username='+$window.sessionStorage.username+'', config).success(function(data, status, headers, config) {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Leave Team',
                            template: 'You have been successfully removed from the team.'
                        });
                        alertPopup.then(function(res) {
                            $state.go('app.home');
                        });

                    }).
                    error(function(data, status, headers, config) {
                        console.log("error getting team info");    
                    });

                }

            }

        });
    };

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $scope.$on('$ionicView.enter', function () {
        //Synchronously makes server calls
        //Obtain general team information
        $scope.loggedInUserIsCaptain = false;

        $http.get('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'', config).
        success(function(data, status, headers, config) {

            var teamProfileData = angular.fromJson(data);

            $scope.info = teamProfileData;

            $scope.players = teamProfileData;

            //Get the members of the team
            $http.get('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'/members', config).
            success(function(data, status, headers, config) {

                $scope.players = angular.fromJson(data);
                $scope.loggedInUserIsMember = false;  //initialize variable. used to determine whether user can edit team info or is visiting team profile

                //Iterate over all players and checking if the username is found in the list of players
                angular.forEach($scope.players, function(player) {
                    if(player.customer_username == $window.sessionStorage.username)
                        if(player.is_captain == true)
                            $scope.loggedInUserIsCaptain = true;
                });
            }).
            error(function(data, status, headers, config) {
                console.log("error getting team info");    
            });

            //Get the members of the team
            $http.get('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'/standings', config).
            success(function(data, status, headers, config) {

                $scope.standings = angular.fromJson(data);

            }).
            error(function(data, status, headers, config) {
                console.log("error getting team info");    
            });



        }).
        error(function(data, status, headers, config) {
            console.log("error getting team info");    
        });

    });

    $scope.goToTeamProfileMembers = function () {
        $state.go('app.teamprofilemembers', {"teamname": $stateParams.teamname});
    };

});

myApp.controller("editTeamController", ['$scope', '$ionicPopup', '$stateParams', '$state', '$http', '$window', '$ionicPlatform', '$cordovaCamera', '$ionicLoading', function ($scope, $ionicPopup, $stateParams, $state, $http, $window, $ionicPlatform, $cordovaCamera, $ionicLoading) {

    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 44f5a38fc083775';

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $scope.teamProfile = [ ];

    $scope.$on('$ionicView.enter', function () {
        //Synchronously makes server calls
        //Obtain general team information
        $http.get('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'', config).
        success(function(data, status, headers, config) {

            var teamProfileData = angular.fromJson(data);

            $scope.teamProfile.bio = teamProfileData.team_bio;
            $scope.teamProfile.logo = teamProfileData.team_logo;
            $scope.teamProfile.cover = teamProfileData.team_cover_photo;
            $scope.teamProfile.team_paypal_info = teamProfileData.team_paypal_info;


        }).
        error(function(data, status, headers, config) {
            console.log("error getting team info");    
        });

    });

    $scope.changeCoverPhoto = function() {
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
                $http.post('http://api.imgur.com/3/upload', {
                    "image": imageData
                }).success(function (data) {

                    $scope.teamProfile.cover = data.data.link; //Here's the link

                }).
                error(function (err){
                    console.log("error in editProfileController");
                });
            })
        });
    }

    $scope.changeLogo = function() {
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
                $http.post('http://api.imgur.com/3/upload', {
                    "image": imageData
                }).success(function (data) {

                    $scope.teamProfile.logo = data.data.link; //Here's the link

                }).
                error(function (err){
                    console.log("error in editProfileController");
                });
            })
        });
    }

    $scope.submitChanges = function () {

        $http.put('http://matchup.neptunolabs.com/matchup/teams/'+$stateParams.teamname+'', {
            "bio": $scope.teamProfile.bio,
            "logo": $scope.teamProfile.logo,
            "cover": $scope.teamProfile.cover,
            "team_paypal_info": $scope.teamProfile.team_paypal_info
        }  , config).success(function (data) {

            $state.go('app.teamprofile', {"teamname": $stateParams.teamname});

        }).
        error(function (err){
            console.log(err);
        });
    };

    $scope.returnToTeamProfile = function () {
        $state.go('app.teamprofile', {"teamname": $stateParams.teamname});
    };

}]);


//================================================================================
// Organizations
//================================================================================

// Popup for removing an organization member, change id to index when using ng-repeat
myApp.controller("removeOrganizationMemberController", ['$scope', '$ionicPopup', '$state', '$stateParams', '$http', '$window', function ($scope, $ionicPopup, $state, $stateParams, $http, $window) {
    // A confirm dialog
    $scope.showConfirm = function (name) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Member',
            template: 'Are you sure you want to remove ' + name + ' from the organization.'
        });
        confirmPopup.then(function (res) {
            if (res) {

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                $http.delete('http://matchup.neptunolabs.com/matchup/organizations/'+$stateParams.organizationname+'/members?username='+name+'', config).success(function(data, status, headers, config) {

                    $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/members', config).
                    success(function(data, status, headers, config) {

                        $scope.members = angular.fromJson(data);

                    }).
                    error(function(data, status, headers, config) {
                        console.log("error in goToEvent");
                    });

                }).
                error(function(data, status, headers, config) {
                    console.log("error getting team info");    
                });


            }
        });
    };

    $scope.returnToOrganizationProfile = function () {
        $state.go('app.organizationprofile', {"organizationname": $stateParams.organizationname});
    };

    $scope.goToAddMemberOrganization = function () {
        $state.go('app.addorganizationmember', {"organizationname": $stateParams.organizationname});
    };

    $scope.makeOwner = function (username, tag) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Promote Member',
            template: 'Are you sure you want to promote ' + tag + '?'
        });
        confirmPopup.then(function (res) {
            if (res) {

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                $http.post('http://matchup.neptunolabs.com/matchup/organizations/'+$stateParams.organizationname+'/members?username='+username+'&owner=true', {}, config).success(function(data, status, headers, config) {

                    $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/members', config).
                    success(function(data, status, headers, config) {

                        $scope.members = angular.fromJson(data);

                    }).
                    error(function(data, status, headers, config) {
                        console.log("error in goToEvent");
                    });

                }).
                error(function(data, status, headers, config) {
                    console.log("error promoting");    
                });
            }
        });
    };

    $scope.$on('$ionicView.enter', function () {
        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };
        //Get events members of the organization
        $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/members', config).
        success(function(data, status, headers, config) {

            $scope.members = angular.fromJson(data);

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });
    });

}]);

// Popup for adding a Organization member, change id to index when using ng-repeat
myApp.controller("addOrganizationMemberController", ['$scope', '$ionicPopup', '$stateParams', '$http', '$window', '$state', function ($scope, $ionicPopup, $stateParams, $http, $window, $state) {
    // A confirm dialog for adding a member
    $scope.showConfirm = function (tag, username) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Add Member',
            template: 'Are you sure you want to add ' + tag + '?'
        });
        confirmPopup.then(function (res) {
            if (res) {

                var config = {
                    headers: {
                        'Authorization': "Bearer "+ $window.sessionStorage.token
                    }
                };

                $http.post('http://matchup.neptunolabs.com/matchup/organizations/'+$stateParams.organizationname+'/members?username='+username+'&owner='+$scope.add.owner+'', {}, config).success(function(data, status, headers, config) {

                    console.log("successfully added"+name);

                }).
                error(function(data, status, headers, config) {
                    console.log("error getting team info");    
                });

            }
        });
    };

    //Funtion that is called everytime the value in the search box is changed.
    $scope.search = function (query) {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Search only if there is content in the search box
        if(query.length > 0){
            $http.get('http://136.145.116.232/matchup/search/'+query+'', config).
            success(function(data, status, headers, config) {

                var searchData = angular.fromJson(data);
                $scope.users = searchData.users;

            }).
            error(function(data, status, headers, config) {
                console.log("error in search controller");
            });
        }

        //Failsafe to make sure that if search parameter is 0 than there should be nothing displaying
        else{

            $scope.users.length = 0

        }

    };

    $scope.returnToOrganizationMembers = function (query) {

        $state.go('app.organizationprofilemembers', {"organizationname": $stateParams.organizationname});

    };

    $scope.$on('$ionicView.enter', function () {

        $scope.add = { };
        $scope.add.owner = false;

    });

}]);

/// TODO configure popvoer for edit and deletion of organization
myApp.controller('organizationController', function ($scope, $ionicPopover, $state, $ionicPopup, $http, $window, $stateParams) {
    //Create popover event that allows further navigation to organization members
    $ionicPopover.fromTemplateUrl('templates/organizationprofile/popover.html', {
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
    $scope.goToEditOrganization = function () {
        $scope.popover.hide();
        $state.go("app.editorganization", {"organizationname": $stateParams.organizationname});
    }
    // A confirm dialog for deletion of team
    $scope.deleteOrganizationPopup = function () {
        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Organization',
            template: 'Are you sure you want to delete the organization'
        });
        confirmPopup.then(function (res) {
            if (res) {

            } else {

            }
        });
    };

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    $scope.$on('$ionicView.enter', function () {
        $scope.loggedInUserIsOwner = false;
        //Synchronously make server calls to lessen server load
        //Get organization information
        $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'', config).
        success(function(data, status, headers, config) {

            $scope.organization = angular.fromJson(data);

            //Get events hosted by the organization
            $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/events', config).
            success(function(data, status, headers, config) {

                $scope.events = angular.fromJson(data);

                //Get events members of the organization
                $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/members', config).
                success(function(data, status, headers, config) {

                    $scope.members = angular.fromJson(data);

                    angular.forEach($scope.members, function(member){

                        if($window.sessionStorage.username == member.customer_username)
                            if(member.is_owner == true)
                                $scope.loggedInUserIsOwner = true;

                    });

                }).
                error(function(data, status, headers, config) {
                    console.log("error in goToEvent");
                });

            }).
            error(function(data, status, headers, config) {
                console.log("error in goToEvent");
            });

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });
    });


    $scope.goToOrganizationEvents = function () {

        $state.go('app.organizationprofileevents', {"organizationname": $stateParams.organizationname});

    };

    $scope.goToOrganizationMembers = function () {

        $state.go('app.organizationprofilemembers', {"organizationname": $stateParams.organizationname});

    };

});

// Popup for adding a Organization member, change id to index when using ng-repeat
myApp.controller("organizationEventsController", ['$scope', '$ionicPopup', '$http', '$window', '$stateParams', '$state', function ($scope, $ionicPopup, $http, $window, $stateParams, $state) {

    var config = {
        headers: {
            'Authorization': "Bearer "+ $window.sessionStorage.token
        }
    };

    //Get events hosted by the organization
    $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/events', config).
    success(function(data, status, headers, config) {

        $scope.events = angular.fromJson(data);

    }).
    error(function(data, status, headers, config) {
        console.log("error in organizationEventsController");
    });

    //goToEvent requires the event name, date and location to access the specific event that is to be transitioned to.
    $scope.goToEvent = function(eventName, date, location){

        eventName = eventName.replace(" ", "%20");
        var params = [eventName, date, location];

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        //Get event information
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

    $scope.returnToOrganizationProfile = function () {

        $state.go('app.organizationprofile', {"organizationname": $stateParams.organizationname});

    };

}]);

myApp.controller("editOrganizationMemberController", ['$scope', '$ionicPopup', '$http', '$window', '$stateParams', '$state', '$ionicPlatform', '$cordovaCamera', '$ionicLoading', function ($scope, $ionicPopup, $http, $window, $stateParams, $state, $ionicPlatform, $cordovaCamera, $ionicLoading) {


    $scope.$on('$ionicView.enter', function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'', config).
        success(function(data, status, headers, config) {

            $scope.organization = angular.fromJson(data);

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });
    });

    $scope.changeCoverPhoto = function() {
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
                $http.post('http://api.imgur.com/3/upload', {
                    "image": imageData
                }).success(function (data) {

                    $scope.organization.organization_cover_photo = data.data.link; //Here's the link

                }).
                error(function (err){
                    console.log("error in editProfileController");
                });
            })
        });
    }
    
    $scope.changeLogo = function() {
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
                $http.post('http://api.imgur.com/3/upload', {
                    "image": imageData
                }).success(function (data) {

                    $scope.organization.organization_logo = data.data.link; //Here's the link

                }).
                error(function (err){
                    console.log("error in editProfileController");
                });
            })
        });
    }


    $scope.editOrganization = function () {

        var config = {
            headers: {
                'Authorization': "Bearer "+ $window.sessionStorage.token
            }
        };

        $http.put('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'', {

            "logo": $scope.organization.organization_logo,
            "bio": $scope.organization.organization_bio,
            "cover": $scope.organization.organization_cover_photo,
            "organization_paypal_info": $scope.organization.organization_paypal_info

        },config).
        success(function(data, status, headers, config) {

            var alertPopup = $ionicPopup.alert({
                title: 'Edit Organization',
                template: 'Successfully edited organization profile!'
            });

        }).
        error(function(data, status, headers, config) {
            console.log("error in goToEvent");
        });

    }

    $scope.goToOrganizationProfile = function () {

        $state.go('app.organizationprofile', {"organizationname": $stateParams.organizationname});

    }

}]);