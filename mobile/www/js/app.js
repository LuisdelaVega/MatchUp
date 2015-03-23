// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'wu.masonry', 'ionic.rating'])

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

.factory('Camera', ['$q', function ($q) {

    return {
        getPicture: function (options) {
            var q = $q.defer();

            navigator.camera.getPicture(function (result) {
                // Do any magic you need
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    }
    }])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    //================================================================================
    // Parent Home View
    //================================================================================
        .state('app', {
            url: "/app",
            /*An abstract state can have child states but can not get activated itself. An 'abstract' state is simply a state 
                                that can't be transitioned to. It is activated implicitly when one of its descendants are activated*/
            abstract: true,
            templateUrl: "templates/home/sidebar.html",
        })
        .state('app.home', {
            url: "/home",
            templateUrl: "templates/home/home.html",
            controller: "homeViewController"
        })
        //================================================================================
        // Events
        //================================================================================
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
        //================================================================================
        // Profile
        //================================================================================
        .state('app.profile', {
            url: "/profile",
            abstract: true,
            templateUrl: "templates/profile/profile.html",
            controller: "ProfileController"
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
        .state('app.editprofile', {
            url: "/editprofile",
            templateUrl: "templates/profile/edit-profile.html",
        })
        //================================================================================
        // Genres and Popular Games
        //================================================================================
        .state('app.genres', {
            url: "/genres",
            templateUrl: "templates/genre.html"
        })
        .state('app.populargames', {
            url: "/populargames",
            templateUrl: "templates/popular-games.html"
        })
        //================================================================================
        // Search
        //================================================================================
        .state('app.search', {
            url: "/search",
            templateUrl: "templates/search/search.html"
        })
        .state('app.searchgeneral', {
            url: "/searchgeneral/:type",
            templateUrl: "templates/search/search-general.html",
            controller: "searchResultController"
        })
        .state('app.searchgenres', {
            url: "/searchgenres",
            templateUrl: "templates/search/search-genres.html"
        })
        //================================================================================
        // Matchups
        //================================================================================
        .state('app.mymatchups', {
            url: "/mymatchups",
            templateUrl: "templates/myStuff/my-matchups.html"
        })
        //================================================================================
        // My Stuff
        //
        // My Events
        //================================================================================
        .state('app.myevents', {
            url: "/myevents",
            abstract: true,
            templateUrl: "templates/myevents/my-events.html"
        })
        .state('app.myevents.melist', {
            url: "/melist",
            views: {
                'upcoming-tab': {
                    templateUrl: "templates/myevents/my-eventsupcoming.html"
                },
                'history-tab': {
                    templateUrl: "templates/myevents/my-eventshistory.html"
                },
                'live-tab': {
                    templateUrl: "templates/myevents/my-eventslive.html"
                }
            }
        })
        //================================================================================
        // Registered Events
        //================================================================================
        .state('app.registeredevents', {
            url: "/registeredevents",
            abstract: true,
            templateUrl: "templates/registeredevents/registered-events.html"
        })
        .state('app.registeredevents.relist', {
            url: "/relist",
            views: {
                're-upcoming-tab': {
                    templateUrl: "templates/registeredevents/registered-eventsupcoming.html"
                },
                're-history-tab': {
                    templateUrl: "templates/registeredevents/registered-eventshistory.html"
                },
                're-live-tab': {
                    templateUrl: "templates/registeredevents/registered-eventslive.html"
                }
            }
        })
        .state('app.myorganizations', {
            url: "/myorganizations",
            templateUrl: "templates/myStuff/my-organizations.html"
        })
        .state('app.myteams', {
            url: "/myteams",
            templateUrl: "templates/myStuff/my-teams.html"
        })
        .state('app.mysubscriptions', {
            url: "/mysubscriptions",
            templateUrl: "templates/myStuff/my-subscriptions.html"
        })
        //================================================================================
        // Game Profile
        //================================================================================
        .state('app.game', {
            url: "/game",
            abstract: true,
            templateUrl: "templates/gameProfile/game-profile.html"
        })
        .state('app.game.summary', {
            url: "/summary",
            views: {
                'game-summary-tab': {
                    templateUrl: "templates/gameProfile/game-summary.html",
                }
            }
        })
        .state('app.game.upcoming', {
            url: "/upcoming",
            views: {
                'game-upcoming-tab': {
                    templateUrl: "templates/gameProfile/game-upcoming.html",
                }
            }
        })
        .state('app.game.history', {
            url: "/history",
            views: {
                'game-history-tab': {
                    templateUrl: "templates/gameProfile/game-history.html",
                }
            }
        })
        //================================================================================
        // Genre Profile
        //================================================================================
        .state('app.genre', {
            url: "/genre",
            abstract: true,
            templateUrl: "templates/genreProfile/genre-profile.html"
        })
        .state('app.genre.upcoming', {
            url: "/upcoming",
            views: {
                'genre-upcoming-tab': {
                    templateUrl: "templates/genreProfile/genre-upcoming.html",
                }
            }
        })
        .state('app.genre.live', {
            url: "/live",
            views: {
                'genre-live-tab': {
                    templateUrl: "templates/genreProfile/genre-live.html",
                }
            }
        })
        .state('app.genre.history', {
            url: "/history",
            views: {
                'genre-history-tab': {
                    templateUrl: "templates/genreProfile/genre-history.html",
                }
            }
        })

    //================================================================================
    // Organization Profile
    //================================================================================
    .state('app.organizationprofile', {
            url: "/organizationprofile",
            templateUrl: "templates/organizationprofile/organization-profile.html"
        })
        .state('app.organizationprofileevents', {
            url: "/organizationprofileevents",
            templateUrl: "templates/organizationprofile/organization-profile-events.html"
        })
        .state('app.organizationprofilemembers', {
            url: "/organizationprofilemembers",
            templateUrl: "templates/organizationprofile/organization-profile-members.html"
        })

    //================================================================================
    // Team Profile
    //================================================================================

    .state('app.teamprofile', {
            url: "/teamprofile",
            templateUrl: "templates/teamprofile/team-profile.html"
        })
        .state('app.teamprofilemembers', {
            url: "/teamprofilemembers",
            templateUrl: "templates/teamprofile/team-profile-members.html"
        })
        .state('app.teamprofilestandings', {
            url: "/teamprofilestandings",
            templateUrl: "templates/teamprofile/team-profile-standings.html"
        })

    //================================================================================
    // Regular Event
    //================================================================================

    .state('app.regularevent', {
            url: "/regularevent",
            templateUrl: "templates/regularevent/regular-event.html"
        })
        .state('app.regulareventmatchups', {
            url: "/regulareventmatchups",
            templateUrl: "templates/regularevent/regular-event-matchups.html"
        })

    //================================================================================
    // Premium Events
    //================================================================================
    .state('app.eventpremium', {
            url: "/eventpremium",
            abstract: true,
            templateUrl: "templates/premiumEvent/event.html"
        })
        .state('app.eventpremium.summary', {
            url: "/summary",
            views: {
                'event-summary-tab': {
                    templateUrl: "templates/premiumEvent/summary.html",
                }
            }
        })
        .state('app.eventpremium.news', {
            url: "/news",
            views: {
                'event-news-tab': {
                    templateUrl: "templates/premiumEvent/news.html",
                }
            }
        })
        // Sigun Up Event Premium
        .state('app.premiumsignup', {
            url: "/premiumsignup",
            templateUrl: "templates/premiumEvent/signup.html",

        })

    //================================================================================
    // Meetups
    //================================================================================
    .state('app.meetups', {
            url: "/meetups",
            templateUrl: "templates/meetup/meetups.html",

        })
        .state('app.createmeetup', {
            url: "/createmeetup",
            templateUrl: "templates/meetup/create-meetup.html",

        })

    //================================================================================
    // Team Sign Up
    //================================================================================
    .state('app.teamsignup', {
            url: "/teamsignup",
            templateUrl: "templates/team-sign-up.html"
        })
        //================================================================================
        // Notifications
        //================================================================================
        .state('app.notifications', {
            url: "/notifications",
            templateUrl: "templates/notifications.html"
        })
        //================================================================================
        // Matchup
        //================================================================================

    .state('app.matchupmatch', {
            url: "/matchupmatch",
            templateUrl: "templates/matchup/matchup-match.html"
        })
        .state('app.matchuppoints', {
            url: "/matchuppoints",
            templateUrl: "templates/matchup/matchup-points.html"
        })
        .state('app.matchupoingoing', {
            url: "/matchupoingoing",
            templateUrl: "templates/matchup/matchup-ongoing.html"
        })
        .state('app.report', {
            url: "/report",
            templateUrl: "templates/matchup/report.html"
        })

    //================================================================================
    // Review
    //================================================================================

    .state('app.writereview', {
            url: "/writereview",
            templateUrl: "templates/premiumEvent/writereview.html"
        })
    //================================================================================
    // Account Stuff
    //================================================================================
        .state('createaccount', {
            url: "/createaccount",
            templateUrl: "templates/profile/create-account.html"
        })
        .state('login', {
            url: "/login",
            templateUrl: "templates/profile/login.html"
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});