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

myApp.controller('homeViewController', ['$scope', '$http', '$state', 'sharedDataService', function ($scope, $http, $state, sharedDataService) {
    $http.get('http://136.145.116.232/home').
    success(function(data, status, headers, config) {

        var eventData = angular.fromJson(data);

        $scope.liveEvents = eventData.events.live;
        $scope.premiumEvents = eventData.events.hosted;
        $scope.regularEvents = eventData.events.regular;
        $scope.popularGames = eventData.popular_games;

    }).
    error(function(data, status, headers, config) {
        console.log("error in search controller");
    });

    $scope.goToEvent = function(eventName){
        
        eventName = eventName.replace(" ", "%20");
        $state.go('app.eventpremium.summary', {"eventname": eventName});
        sharedDataService.set(eventName);
    };


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

    $scope.search = function (query) {

        $http.get('http://136.145.116.232/search/'+query+'').
        success(function(data, status, headers, config) {

            var searchData = angular.fromJson(data);

            $scope.liveEvents = searchData.events.live;
            $scope.pastEvents = searchData.events.past;
            $scope.premiumEvents = searchData.events.hosted;
            $scope.regularEvents = searchData.events.regular;
            $scope.users = searchData.users;
            $scope.teams = searchData.teams;
            $scope.organizations = searchData.organizations;
            $scope.games = searchData.games;
            $scope.genres = searchData.genres;

            sharedDataService.set(searchData);

            console.log(searchData);
            console.log(data);
            console.log($scope.query);

        }).
        error(function(data, status, headers, config) {
            console.log("error in search controller");
        });

    }



}]);

myApp.controller('searchResultController', ['$scope', '$stateParams', 'sharedDataService', function ($scope, $stateParams, sharedDataService) {

    $scope.resultType = $stateParams.type;

    var searchData = sharedDataService.get();

    $scope.live = false;
    $scope.past = false;
    $scope.hosted = false;
    $scope.regular = false;
    $scope.users = false;
    $scope.teams = false;
    $scope.organizations = false;
    $scope.games = false;
    $scope.genres = false;

    if ($scope.resultType == 'Live'){
        $scope.searchData = searchData.live;
        $scope.live = true;
    }
    else if ($scope.resultType == 'Past'){
        $scope.searchData = searchData.past;
        $scope.past = true;
    }
    else if ($scope.resultType == 'Premium'){
        $scope.searchData = searchData.hosted;
        $scope.hosted = true;
    }
    else if ($scope.resultType == 'Regular'){
        $scope.searchData = searchData.regular;
        $scope.regular = true;
    }
    else if ($scope.resultType == 'Users'){
        $scope.searchData = searchData.users;
        $scope.users = true;
    }
    else if ($scope.resultType == 'Teams'){
        $scope.searchData = searchData.teams;
        $scope.teams = true;
    }
    else if ($scope.resultType == 'Organizations'){
        $scope.searchData = searchData.organizations;
        $scope.organizations = true;
    }
    else if ($scope.resultType == 'Games'){
        $scope.searchData = searchData.games;
        $scope.games = true;
    }
    else if ($scope.resultType == 'Genres'){
        $scope.searchData = searchData.genres;
        $scope.genres = true;
    }
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