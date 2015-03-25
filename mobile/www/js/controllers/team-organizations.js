var myApp = angular.module('teams-organization',[]);

// Popup for adding a team member, change id to index when using ng-repeat
myApp.controller("addTeamMemberController", ['$scope', '$ionicPopup', function ($scope, $ionicPopup) {
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

// Popup for removing a team member, change id to index when using ng-repeat
myApp.controller("removeTeamMemberController", ['$scope', '$ionicPopup', function ($scope, $ionicPopup) {
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

myApp.controller('teamController', function ($scope, $ionicPopover, $state, $ionicPopup) {
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
myApp.controller('organizationController', function ($scope, $ionicPopover, $state, $ionicPopup) {
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
});