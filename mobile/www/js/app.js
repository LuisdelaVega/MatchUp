//Declare parent module. Module defines states and has within its parameters all the other js files containing the controllers.
angular.module('App', ['ionic', 'wu.masonry', 'ionic.rating', 'home' , 'premium-events', 'user', 'team-organizations', 'genres', 'regular-events', 'events', 'game-profile', 'my-events', 'registered-events', 'ngCordova', 'ordinal'])

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

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider //All states can be found here. States are defined so that the ui-router. This is used due to the enormous amount of states (if there was a small amount of states than they would be easy to keep track of and state transitions) and allows us to use templates which ensures less duplicate code. This is can be seen in the implementation of the sidebar who's html is accesed through all views except the login and the tab views which have various views with a singular parent view.
    //================================================================================
    // Parent Home View
    //================================================================================
        .state('app', {
        url: "/app",
        /*An abstract state can have child states but can not get activated itself. An 'abstract' state is simply a state that can't be transitioned to. It is activated implicitly when one of its descendants are activated*/
        abstract: true,
        templateUrl: "templates/home/sidebar.html",
        controller: "sidebarController"
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
        url: "/summary/:username",
        views: {
            'profile-summary-tab': {
                templateUrl: "templates/profile/profile-summary.html",
                controller: "profileSummaryController"
            }
        }
    })
        .state('app.profile.standings', {
        url: "/standings",
        views: {
            'profile-standings-tab': {
                templateUrl: "templates/profile/profile-standings.html",
                controller: "profileStandingsController"
            }
        }
    })
        .state('app.profile.matchups', {
        url: "/matchups",
        views: {
            'profile-matchups-tab': {
                templateUrl: "templates/profile/matchups.html",
                controller: "profileMatchupsController"
            }
        }
    })
        .state('app.teams', {
        url: "/teams/:username",
        templateUrl: "templates/team/teams-list.html",
        controller: "profileTeamsController"


    })
        .state('app.organizations', {
        url: "/organizations/:username",
        templateUrl: "templates/organization/organizations-list.html",
        controller: "profileOrganizationsController"

    })
        .state('app.profile.events', {
        url: "/events",
        views: {
            'profile-events-tab': {
                templateUrl: "templates/profile/profile-events.html",               
                controller: "profileEventsController"
            }
        }
    })
        .state('app.editprofile', {
        url: "/editprofile/:username",
        templateUrl: "templates/profile/edit-profile.html",
        controller: "editProfileController"
    })
    //================================================================================
    // Genres and Popular Games
    //================================================================================
        .state('app.genres', {
        url: "/genres",
        templateUrl: "templates/genre.html",
        controller: "genreController"
    })
        .state('app.populargames', {
        url: "/populargames",
        templateUrl: "templates/popular-games.html",
        controller: "popularGameViewController"
    })
    //================================================================================
    // Search
    //================================================================================
        .state('app.search', {
        url: "/search",
        templateUrl: "templates/search/search.html",
        controller: "searchController"
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
        templateUrl: "templates/myStuff/my-matchups.html",
        controller: "myMatchupController"

    })
    //================================================================================
    // My Events
    //================================================================================
        .state('app.myevents', {
        url: "/myevents",
        abstract: true,
        templateUrl: "templates/myevents/my-events.html",
        controller: "myEventsParentController"

    })
        .state('app.myevents.melist', {
        url: "/melist/:username",
        views: {
            'upcoming-tab': {
                templateUrl: "templates/myevents/my-eventsupcoming.html",
                controller: "myEventsUpcomingController"
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
        templateUrl: "templates/registeredevents/registered-events.html",
        controller: "registeredEventsParentController"
    })
        .state('app.registeredevents.relist', {
        url: "/relist",
        views: {
            're-competitor-tab': {
                templateUrl: "templates/registeredevents/registered-events-competitor.html",
                controller: "registeredEventsCompetitorController"
            },
            're-spectator-tab': {
                templateUrl: "templates/registeredevents/registered-events-spectator.html",
                controller: "registeredEventsSpectatorController"
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
        templateUrl: "templates/myStuff/my-subscriptions.html",
        controller: "mySubscriptionsController"
    })
    //================================================================================
    // Game Profile
    //================================================================================
        .state('app.game', {
        url: "/game",
        abstract: true,
        templateUrl: "templates/gameProfile/game-profile.html",
        controller: "gameProfileParentController"
    })
        .state('app.game.summary', {
        url: "/summary/:gamename",
        views: {
            'game-summary-tab': {
                templateUrl: "templates/gameProfile/game-summary.html",
                controller: "gameProfileSummaryController"
            },
            'game-upcoming-tab': {
                templateUrl: "templates/gameProfile/game-upcoming.html",
                controller: "gameProfileUpcomingController"
            },
            'game-live-tab': {
                templateUrl: "templates/gameProfile/game-live.html",
                controller: "gameProfileLiveController"
            },
            'game-history-tab': {
                templateUrl: "templates/gameProfile/game-history.html",
                controller: "gameProfileHistoryController"

            }
        }
    })
    //================================================================================
    // Genre Profile
    //================================================================================
        .state('app.genreevents', {
        url: "/genreprofile",
        templateUrl: "templates/genreProfile/genre-history.html",
        controller: "genreProfileController"
    })

    //================================================================================
    // Organization Profile
    //================================================================================
        .state('app.organizationprofile', {
        url: "/organizationprofile/:organizationname",
        templateUrl: "templates/organizationprofile/organization-profile.html",
        controller: "organizationController"
    })
        .state('app.organizationprofileevents', {
        url: "/organizationprofileevents/:organizationname",
        templateUrl: "templates/organizationprofile/organization-profile-events.html",
        controller: "organizationEventsController"
    })
        .state('app.organizationprofilemembers', {
        url: "/organizationprofilemembers/:organizationname",
        templateUrl: "templates/organizationprofile/organization-profile-members.html",
        controller: "removeOrganizationMemberController"
    })

        .state('app.requestorganization', {
        url: "/requestorganization",
        templateUrl: "templates/organizationprofile/request.html"
    })
        .state('app.addorganizationmember', {
        url: "/addorganizationmember/:organizationname",
        templateUrl: "templates/organizationprofile/add-member.html",
        controller: "addOrganizationMemberController"
    })
        .state('app.editorganization', {
        url: "/editorganization/:organizationname",
        templateUrl: "templates/organizationprofile/edit.html",
        controller: "editOrganizationMemberController"
    })

    //================================================================================
    // Team Profile
    //================================================================================

        .state('app.teamprofile', {
        url: "/teamprofile/:teamname",
        templateUrl: "templates/teamprofile/team-profile.html",
        controller: "teamController"
    })
        .state('app.teamprofilemembers', {
        url: "/teamprofilemembers/:teamname",
        templateUrl: "templates/teamprofile/team-profile-members.html",
        controller: "removeTeamMemberController"
    })
        .state('app.teamprofilestandings', {
        url: "/teamprofilestandings/:teamname",
        templateUrl: "templates/teamprofile/team-profile-standings.html"
    })
        .state('app.createteam', {
        url: "/createteam",
        templateUrl: "templates/teamprofile/create.html"
    })
        .state('app.addteammember', {
        url: "/addteammember/:teamname",
        templateUrl: "templates/teamprofile/add-member.html",
        controller: "addTeamMemberController"
    })
        .state('app.editteam', {
        url: "/editteam/:teamname",
        templateUrl: "templates/teamprofile/edit.html",
        controller: "editTeamController"
    })

    //================================================================================
    // Regular Event
    //================================================================================

        .state('app.regularevent', {
        url: "/regularevent/:eventname/:date/:location",
        templateUrl: "templates/regularevent/regular-event.html",
        controller: "regularEventController"
    })
        .state('app.regulareventmatchups', {
        url: "/regulareventmatchups",
        templateUrl: "templates/regularevent/regular-event-matchups.html"
    })

    //================================================================================
    // Premium Events
    //================================================================================
        .state('app.eventpremium', {
        url: "/summary/:eventname/:date/:location",
        templateUrl: "templates/premiumEvent/summary.html",
        controller: "eventPremiumSummaryController"
    })

        .state('app.news', {
        url: "/news/:eventname/:date/:location",
        templateUrl: "templates/premiumEvent/news.html",
        controller: "newsController"
    })
    // Sigun Up Event Premium
        .state('app.premiumsignup', {
        url: "/premiumsignup/:eventname/:date/:location",
        templateUrl: "templates/premiumEvent/signup.html",
        controller: "premiumSignUpController"

    })
    // Edit and post news
        .state('app.postnews', {
        url: "/postnews/:type/:eventname/:date/:location",
        templateUrl: "templates/premiumEvent/post-news.html",
        controller: "postNewsController"
    })
        .state('app.review', {
        url: "/review/:eventname/:date/:location",
        templateUrl: "templates/premiumEvent/review.html",
        controller: "ratingsController"
    })

    //================================================================================
    // Meetups
    //================================================================================
        .state('app.meetups', {
        url: "/meetups/:eventname/:date/:location",
        templateUrl: "templates/meetup/meetups.html",
        controller: "meetupController"

    })
        .state('app.createmeetup', {
        url: "/createmeetup/:eventname/:date/:location",
        templateUrl: "templates/meetup/create-meetup.html",
        controller: "createMeetupController"

    })

    //================================================================================
    // Team Sign Up
    //================================================================================
        .state('app.teamsignup', {
        url: "/teamsignup/:eventname/:date/:location/:tournament",
        templateUrl: "templates/regularevent/team-sign-up.html",
        controller: "teamSignUpController"
    })
    //================================================================================
    // Notifications
    //================================================================================
        .state('app.notifications', {
        url: "/notifications",
        templateUrl: "templates/notifications.html",
        controller: "notificationsController"
    })
    //================================================================================
    // Matchup
    //================================================================================

        .state('app.matchupmatch', {
        url: "/matchupmatch",
        templateUrl: "templates/matchup/matchup-match.html",
        controller: "matchupMatchController"
    })
        .state('app.matchuppoints', {
        url: "/matchuppoints",
        templateUrl: "templates/matchup/matchup-points.html"
    })
        .state('app.matchupoingoing', {
        url: "/matchupoingoing",
        templateUrl: "templates/matchup/matchup-ongoing.html",
        controller: "matchupOngoingController"
    })
        .state('app.report', {
        url: "/report",
        templateUrl: "templates/matchup/report.html",
        controller: "reportController"
    })

    //================================================================================
    // Review
    //================================================================================

        .state('app.writereview', {
        url: "/writereview/:eventname/:date/:location",
        templateUrl: "templates/premiumEvent/writereview.html",
        controller: "writeReviewController"
    })
    //================================================================================
    // Account Stuff
    //================================================================================
        .state('createaccount', {
        url: "/createaccount",
        templateUrl: "templates/profile/create-account.html",
        controller: "createAccountController"
    })
        .state('login', {
        url: "/login",
        templateUrl: "templates/profile/login.html",
        controller: "loginController"     
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    //Used for authentication and complying with CORS
    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common["X-Requested-With"];

})

//    .config(function($cordovaInAppBrowserProvider) {
//
//    var defaultOptions = {
//        location: 'no',
//        clearcache: 'no',
//        toolbar: 'no'
//    };
//
//    document.addEventListener(function () {
//
//        $cordovaInAppBrowserProvider.setDefaultOptions(options)
//
//    }, false);
//})
//Allows controllers to pass data between each other. Should be used only when values set will immediately used by another controller in a get.
    .factory('sharedDataService', function () {
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

})
//Factory that interacts with the camera API of the targeted platform and allows us to use the camera.
//    .factory('Camera', ['$q', function ($q) {
//
//        return {
//            getPicture: function (options) {
//                var q = $q.defer();
//
//                navigator.camera.getPicture(function (result) {
//                    // Do any magic you need
//                    q.resolve(result);
//                }, function (err) {
//                    q.reject(err);
//                }, options);
//
//                return q.promise;
//            }
//        }
//    }]);