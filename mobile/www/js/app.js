// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'wu.masonry'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            /*An abstract state can have child states but can not get activated itself. An 'abstract' state is simply a state 
                that can't be transitioned to. It is activated implicitly when one of its descendants are activated*/
            abstract: true,
            templateUrl: "templates/home/sidebar.html",
        })
        .state('app.home', {
            url: "/home",
            templateUrl: "templates/home/home.html"
        })
        .state('app.events', {
            url: "/events",
            abstract: true,
            templateUrl: "templates/events/events.html",
            controller: "EventController"
        })
        .state('app.events.list', {
            url: "/list",
            views: {
                'regular-tab': {
                    templateUrl: "templates/events/regular-list-events.html",
                    controller: "RegularEventController"
                },
                'premium-tab': {
                    templateUrl: "templates/events/premium-list-events.html",
                    controller: "PremiumEventController"
                }
            }
        })
        .state('app.profile', {
            url: "/profile",
            abstract: true,
            templateUrl: "templates/profile/profile.html"
        })
        .state('app.profile.summary', {
            url: "/summary",
            views: {
                'profile-summary-tab': {
                    templateUrl: "templates/profile/profile-summary.html",
                }
            }
        })
        .state('app.profile.standings', {
            url: "/standings",
            views: {
                'profile-standings-tab': {
                    templateUrl: "templates/profile/profile-standings.html",
                }
            }
        })
        .state('app.profile.teams', {
            url: "/teams",
            views: {
                'profile-summary-tab': {
                    templateUrl: "templates/team/teams-list.html"
                }
            }
        })
        .state('app.profile.organizations', {
            url: "/organizations",
            views: {
                'profile-summary-tab': {
                    templateUrl: "templates/organization/organizations-list.html"
                }
            }
        })
        .state('app.profile.events', {
            url: "/events",
            views: {
                'profile-events-tab': {
                    templateUrl: "templates/profile/profile-events.html",
                }
            }
        })
        .state('app.genres', {
            url: "/genres",
            templateUrl: "templates/genre.html"
        })
        .state('app.populargames', {
            url: "/populargames",
            templateUrl: "templates/popular-games.html"
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});