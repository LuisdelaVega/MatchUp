var myApp = angular.module('App')

//Good night sweet prince. We will always remember the way you danced.  
//myApp.controller('gameController', ['$scope', function($scope) {
//
//    $scope.games = ['img/csgo.jpg'];
//    var moreImgs = ['img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg']
//    $scope.add = function add(name) {
//        if (moreImgs.length>0)
//            $scope.games.push(moreImgs.pop());
//        else {
//            moreImgs.push($scope.games.splice(0,1)[0]);
//        }
//        $scope.$broadcast('scroll.infiniteScrollComplete');
//    }
//}]);  

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
})

myApp.controller('ProfileController', function ($scope, $ionicPopover, $state) {
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
})

myApp.controller('RegularEventController', function ($scope) {

})

myApp.controller('PremiumEventController', function ($scope) {

});

myApp.controller('popularGameViewController', ['$scope', '$http', function ($scope, $http) {

    $scope.games = ['img/csgo.jpg', 'img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg'];
    var moreImgs = ['img/csgo.jpg', 'img/dota2.jpg', 'img/hearthstone.jpg', 'img/leagueofeppa.jpg']

    $scope.add = function add(name) {
        if (moreImgs.length > 0) {
            $scope.games.push(moreImgs.pop());
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else
            $scope.$broadcast('scroll.infiniteScrollComplete');
    }

}]);

myApp.controller('myMatchupViewController', ['$scope', '$http', function ($scope, $http) {

    $scope.competitors = ['img/ron.jpg', 'img/ronpaul.gif'];

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

myApp.factory('searchResultsService', function() {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }

});

myApp.controller('searchController', ['$scope', '$http', 'searchResultsService', function($scope, $http, searchResultsService) {

    $scope.search = function() {

        //HTTP Get pidiendo del server la lista del search filtrada por $scope.query

    }

    var searchData = 
        {
            "live": [
                {
                    "img"   : "img/evo.png",
                    "title" : "EVO 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "LCS 2015",
                    "location" : "Badillo's House, Jersey"
                }
            ],

            "past": [
                {
                    "img"   : "img/evo.png",
                    "title" : "EVO 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "LCS 2015",
                    "location" : "Badillo's House, Jersey"
                }
            ],

            "premium": [
                {
                    "img"   : "img/evo.png",
                    "title" : "EVO 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "LCS 2015",
                    "location" : "Badillo's House, Jersey"
                }              
            ],
            "regular": [
                {
                    "img"   : "img/evo.png",
                    "title" : "EVO 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "LCS 2015",
                    "location" : "Badillo's House, Jersey"
                }              
            ],
            "users": [
                {
                    "img"   : "img/ron.jpg",
                    "title" : "Roney",
                    "location" : "Ron Paul"
                }            
            ],
            "teams": [
                {
                    "img"   : "img/cloud9logo.png",
                    "title" : "Cloud 9"
                }            
            ],
            "organizations": [
                {
                    "img"   : "img/esportPR.png",
                    "title" : "EsportsPR"
                }            
            ],
            "games": [
                {
                    "img"   : "img/hearthstone.jpg",
                    "title" : "Hearthstone"
                }            
            ],
            "genres": [
                {
                    "title" : "MOBA"
                }            
            ]          
        };

    $scope.liveEvents = searchData.live;
    $scope.pastEvents = searchData.past;
    $scope.premiumEvents = searchData.premium;
    $scope.regularEvents = searchData.regular;
    $scope.users = searchData.users;
    $scope.teams = searchData.teams;
    $scope.organizations = searchData.organizations;
    $scope.games = searchData.games;
    $scope.genres = searchData.genres;

    searchResultsService.set(searchData);

}]);

myApp.controller('searchResultController', ['$scope', '$stateParams', 'searchResultsService', function($scope, $stateParams, searchResultsService) {

    $scope.resultType = $stateParams.type;

    var searchData = searchResultsService.get();

    if($scope.resultType == 'Live')
        $scope.searchData = searchData.live;
    else if($scope.resultType == 'Past')
        $scope.searchData = searchData.past;
    else if($scope.resultType == 'Premium')
        $scope.searchData = searchData.past;
    else if($scope.resultType == 'Regular')
        $scope.searchData = searchData.regular;
    else if($scope.resultType == 'Users')
        $scope.searchData = searchData.users;
    else if($scope.resultType == 'Teams')
        $scope.searchData = searchData.teams;
    else if($scope.resultType == 'Organizations')
        $scope.searchData = searchData.organizations;
    else if($scope.resultType == 'Games')
        $scope.searchData = searchData.games;
    else if($scope.resultType == 'Genres')
        $scope.searchData = searchData.genres;
}]);

myApp.controller('REController', ['$scope', '$http', '$ionicPopup', function ($scope, $http, $ionicPopup) {

    $scope.isOngoing = true;
    $scope.requiresTeam = true;

    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sign Up',
            template: 'Are you sure you want to sign up?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('You');
            } else {
                console.log('No');
            }
        });
    };

}]);

myApp.controller('ratingsController', ['$scope', '$http', function ($scope, $http) {

    // set the rate and max variables
    $scope.rate = 3;
    $scope.max = 5;

}]);

myApp.controller('promotedEventController', ['$scope', '$http', function ($scope, $http) {

    $scope.isOngoing = false; //Set to true before the event as well

}]);

myApp.controller('cameraReportController', ['$scope', '$http', 'Camera', function ($scope, $http, Camera) {

    $scope.picturetaken = false;

    $scope.takePicture = function () {
        console.log('Getting camera');
        Camera.getPicture().then(function (imageURI) {
            console.log(imageURI);
            $scope.imageURL = imageURI;
        }, function (err) {
            console.err(err);
        }, {
            quality: 75,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        });
    };
}]);

myApp.controller('writeReviewRatingsController', ['$scope', '$http', function ($scope, $http) {

    // set the rate and max variables
    $scope.rate = 3;
    $scope.max = 5;

}]);

myApp.controller('homeViewController', ['$scope', '$http', function($scope, $http) {

    var eventData = 
        {
            "live": [
                {
                    "img"   : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "LOL Championship Series",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lolbr.jpeg",
                    "title" : "LOL Championship Series Brazil",
                    "location" : "Badillo's House, Jersey"
                }
            ],

            "premium": [
                {
                    "img"   : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "LOL Championship Series",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lolbr.jpeg",
                    "title" : "LOL Championship Series Brazil",
                    "location" : "Badillo's House, Jersey"
                }
            ],

            "regular": [
                {
                    "img"   : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/apex2015.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "Apex 2015",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lol2.png",
                    "title" : "LOL Championship Series",
                    "location" : "Badillo's House, Jersey"
                },
                {
                    "img"    : "img/lolbr.jpeg",
                    "title" : "LOL Championship Series Brazil",
                    "location" : "Badillo's House, Jersey"
                }
            ]
        };

    $scope.live = eventData.live;   
    $scope.premium = eventData.premium;
    $scope.regular = eventData.regular;

}]);


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
})

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
})