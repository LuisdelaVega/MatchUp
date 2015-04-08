var myApp = angular.module('team-organizations',[]);

// Popup for adding a team member, change id to index when using ng-repeat
myApp.controller("addTeamMemberController", ['$scope', '$ionicPopup', '$http', '$window', '$stateParams', function ($scope, $ionicPopup, $http, $window, $stateParams) {
    //Confirm dialogue asking whether the user would like to add specified user to the team
    $scope.showConfirm = function (name) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Member',
            template: 'Are you sure you want to add ' + name + ''
        });
        confirmPopup.then(function (res) {
            if (res) {
                //HTTP call to remove member. Will be implemented in integration
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

}]);

// Popup for removing a team member, change id to index when using ng-repeat
myApp.controller("removeTeamMemberController", ['$scope', '$ionicPopup', '$http', '$window', '$stateParams', function ($scope, $ionicPopup, $http, $window, $stateParams) {
    // A confirm dialog
    $scope.showConfirm = function (name) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Member',
            template: 'Are you sure you want to remove ' + name + ''
        });
        confirmPopup.then(function (res) {
            if (res) {
                //HTTP call to remove member. Will be implemented in integration
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

    //Server call to obtain members of the specified team
    $http.get('http://136.145.116.232/matchup/teams/'+$stateParams.teamname+'/members', config).
    success(function(data, status, headers, config) {

        var teamProfileData = angular.fromJson(data);
        $scope.players = teamProfileData;

    }).
    error(function(data, status, headers, config) {
        console.log("error getting team info");    
    });

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
        $state.go("app.editteam");
    }

    // A confirm dialog for deletion of team
    $scope.deleteTeamPopup = function () {
        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Team',
            template: 'Are you sure you want to delete the team'
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

    //Synchronously makes server calls
    //Obtain general team information
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
                    $scope.loggedInUserIsMember = true;
            });
        }).
        error(function(data, status, headers, config) {
            console.log("error getting team info");    
        });

    }).
    error(function(data, status, headers, config) {
        console.log("error getting team info");    
    });

    $scope.goToTeamProfileMembers = function () {
        $state.go('app.teamprofilemembers', {"teamname": $stateParams.teamname});
    };

});


//================================================================================
// Organizations
//================================================================================

// Popup for removing an organization member, change id to index when using ng-repeat
myApp.controller("removeOrganizationMemberController", ['$scope', '$ionicPopup', function ($scope, $ionicPopup) {
    // A confirm dialog
    $scope.showConfirm = function (name, id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Member',
            template: 'Are you sure you want to remove ' + name + ' with id ' + id
        });
        confirmPopup.then(function (res) {
            if (res) {

            } else {

            }
        });
    };
}]);

// Popup for adding a Organization member, change id to index when using ng-repeat
myApp.controller("addOrganizationMemberController", ['$scope', '$ionicPopup', function ($scope, $ionicPopup) {
    // A confirm dialog for adding a member
    $scope.showConfirm = function (name, id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Add Member',
            template: 'Are you sure you want to add ' + name + ' with id ' + id
        });
        confirmPopup.then(function (res) {
            if (res) {

            } else {

            }
        });
    };
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
        $state.go("app.editorganization");
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

    //Synchronously make server calls to lessen server load
    //Get organization information
    $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'', config).
    success(function(data, status, headers, config) {

        $scope.organization = angular.fromJson(data);

        //Get events hosted by the organization
        $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/events', config).
        success(function(data, status, headers, config) {

            $scope.events = angular.fromJson(data);
            
            //Get events hosted by the organization
            $http.get('http://136.145.116.232/matchup/organizations/'+$stateParams.organizationname+'/members', config).
            success(function(data, status, headers, config) {

                $scope.members = angular.fromJson(data);

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