var myApp = angular.module('home',[]);

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

myApp.controller('homeViewController', ['$scope', '$http', function ($scope, $http) {
    console.log("homeview controlelr");
    var eventData = {
        "live": [
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "LOL Championship Series",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lolbr.jpeg",
                "title": "LOL Championship Series Brazil",
                "location": "Badillo's House, Jersey"
                }
            ],

        "premium": [
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "LOL Championship Series",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lolbr.jpeg",
                "title": "LOL Championship Series Brazil",
                "location": "Badillo's House, Jersey"
                }
            ],

        "regular": [
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "LOL Championship Series",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lolbr.jpeg",
                "title": "LOL Championship Series Brazil",
                "location": "Badillo's House, Jersey"
                }
            ]
    };

    $scope.live = eventData.live;
    $scope.premium = eventData.premium;
    $scope.regular = eventData.regular;

}]);

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

myApp.controller('searchController', ['$scope', '$http', 'sharedDataService', function ($scope, $http, sharedDataService) {

    $scope.search = function () {

        //HTTP Get pidiendo del server la lista del search filtrada por $scope.query

    }

    var searchData = {
        "live": [
            {
                "img": "img/evo.png",
                "title": "EVO 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "LCS 2015",
                "location": "Badillo's House, Jersey"
                }
            ],

        "past": [
            {
                "img": "img/evo.png",
                "title": "EVO 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "LCS 2015",
                "location": "Badillo's House, Jersey"
                }
            ],

        "premium": [
            {
                "img": "img/evo.png",
                "title": "EVO 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "LCS 2015",
                "location": "Badillo's House, Jersey"
                }
            ],
        "regular": [
            {
                "img": "img/evo.png",
                "title": "EVO 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/apex2015.png",
                "title": "Apex 2015",
                "location": "Badillo's House, Jersey"
                },
            {
                "img": "img/lol2.png",
                "title": "LCS 2015",
                "location": "Badillo's House, Jersey"
                }
            ],
        "users": [
            {
                "img": "img/ron.jpg",
                "title": "Roney",
                "location": "Ron Paul"
                }
            ],
        "teams": [
            {
                "img": "img/cloud9logo.png",
                "title": "Cloud 9"
                }
            ],
        "organizations": [
            {
                "img": "img/esportPR.png",
                "title": "EsportsPR"
                }
            ],
        "games": [
            {
                "img": "img/hearthstone.jpg",
                "title": "Hearthstone"
                }
            ],
        "genres": [
            {
                "title": "MOBA"
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

    sharedDataService.set(searchData);

}]);

myApp.controller('searchResultController', ['$scope', '$stateParams', 'sharedDataService', function ($scope, $stateParams, sharedDataService) {

    $scope.resultType = $stateParams.type;

    var searchData = sharedDataService.get();

    if ($scope.resultType == 'Live')
        $scope.searchData = searchData.live;
    else if ($scope.resultType == 'Past')
        $scope.searchData = searchData.past;
    else if ($scope.resultType == 'Premium')
        $scope.searchData = searchData.past;
    else if ($scope.resultType == 'Regular')
        $scope.searchData = searchData.regular;
    else if ($scope.resultType == 'Users')
        $scope.searchData = searchData.users;
    else if ($scope.resultType == 'Teams')
        $scope.searchData = searchData.teams;
    else if ($scope.resultType == 'Organizations')
        $scope.searchData = searchData.organizations;
    else if ($scope.resultType == 'Games')
        $scope.searchData = searchData.games;
    else if ($scope.resultType == 'Genres')
        $scope.searchData = searchData.genres;
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