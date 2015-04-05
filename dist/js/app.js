var myApp = angular.module('MatchUp', ['ui.router', 'ngResource', 'home', 'premium-events', 'regular-events', 'user','as.sortable','ui.bootstrap.datetimepicker','organizer']);

myApp.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /home
    $urlRouterProvider.otherwise("/404");
    //
    // Now set up the states
    $stateProvider
    
        .state('login', {
            url: "/login",
            templateUrl: "login.html",
            controller: "loginController"
        })
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "app.html",
            controller: "sidebarController"
        })
        .state('app.home', {
            url: "/home",
            templateUrl: "home.html",
            controller: "homeViewController" 
        })
        /**
         * Client Error Handling
         *  
         */
         

        .state('401', {
            url: "/login",
            templateUrl: "login.html"
        })
        .state('404', {
            url: "/404",
            templateUrl: "404.html"
        })
        
        
        /**
         *	Events
         *
         */
        .state('app.premiumEvent', {
            url: "/summary/:eventname/:date/:location",
            templateUrl: "event/premium_event.html",
            controller: "eventPremiumSummaryController"


        })
        .state('app.generalEvents', {
            url: "/generalEvents",
            templateUrl: "event/general_events.html"
        })
        .state('app.myEvents', {
            url: "/myEvents",
            templateUrl: "event/my_events.html",
            controller: "profileEventsController"
        })
        .state('app.createEvent', {
            url: "/createEvent",
            templateUrl: "event/create_event.html"
        })
        .state('app.registeredEvents', {
            url: "/registeredEvents",
            templateUrl: "event/registered_events.html"
        })
        .state('app.meetupList', {
            url: "/meetupList/:eventname/:date/:location",
            templateUrl: "event/meetupList.html",
            controller: "meetupListController"
        })
        .state('app.meetup', {
            url: "/meetup/:eventName/:eventDate/:eventLocation/:meetupDate/:meetupLocation",
            templateUrl: "event/meetup.html",
            controller: "meetupController"
        })
        .state('app.create_meetup', {
            url: "/createMeetup",
            templateUrl: "event/create_meetup.html"
        })
        .state('app.competitorSignup', {
            url: "/competitorSignup",
            templateUrl: "event/competitor_signup.html"
        })
        /**
         *	Event organizer views
         *
         */
        .state('app.eventSettings', {
            url: "/eventSettings",
            templateUrl: "organizer/event_settings.html"
        })
        .state('app.editEvent', {
            url: "/editEvent",
            templateUrl: "organizer/edit_event.html"
        })
        .state('app.tournamentList', {
            url: "/tournamentList",
            templateUrl: "organizer/tournament_list.html"
        })
        .state('app.registrations', {
			url: "/registrations",
			templateUrl: "organizer/registrations.html",
			controller: "RegistrationController"
		})
		.state('app.stationAssignment', {
			url: "/stationAssignment",
			templateUrl: "organizer/station_assignment.html",
			controller: "StationController"
		})
		.state('app.seeding', {
			url: "/seeding",
			templateUrl: "organizer/seeding.html",
			controller: "SeedingController"
		})
		.state('app.reportList', {
			url: "/reportList",
			templateUrl: "organizer/report_list.html",
			controller: "ReportsController"
		})
        /**
         *	Tournaments
         *
         */
        .state('app.tournament', {
            url: "/tournament",
            templateUrl: "tournament/tournament.html"
        })
        .state('app.tournamentLive', {
            url: "/tournamentLive",
            templateUrl: "tournament/tournamentLive.html"
        })
        /**
         *	User Profiles
         *
         */
        .state('app.userProfile', {
            url: "/user/:username",
            // using my profile for now to fix edit page
            // TODO change to user_profile and use ng-if
            templateUrl: "user/user_profile.html",
            controller: "profileSummaryController"
        })
        .state('app.userStandings', {
            url: "/userStandings",
            templateUrl: "user/user_standings.html"
        })
        .state('app.userTeams', {
            url: "/userTeams",
            templateUrl: "user/user_teams.html"
        })
        .state('app.userEvents', {
            url: "/userEvents",
            templateUrl: "user/user_events.html"
        })
        .state('app.userOrganizations', {
            url: "/userOrganizations",
            templateUrl: "user/user_organizations.html"
        })
        .state('app.editProfile', {
            url: "/editProfile",
            templateUrl: "user/edit_profile.html"
        })
        .state('app.myMatchups', {
            url: "/myMatchups",
            templateUrl: "user/my_matchups.html"
        })
        .state('app.subscribed', {
            url: "/subscribed",
            templateUrl: "user/subscribed.html"
        })
        /**
         *	Game Profiles
         *
         */
        .state('app.gameProfile', {
            url: "/gameProfile",
            templateUrl: "game/game_profile.html"
        })
        .state('app.popularGames', {
            url: "/popularGames",
            templateUrl: "game/popular_games.html"
        })
        /**
         *	Genre Profiles
         *
         */
        .state('app.genreProfile', {
            url: "/genreProfile",
            templateUrl: "genre/genre_profile.html"
        })
        .state('app.genres', {
            url: "/genres",
            templateUrl: "genre/genres.html"
        })
        /**
         *	Team Stuff
         *
         */
        .state('app.teamProfile', {
            url: "/teamProfile",
            templateUrl: "team/team_profile.html"
        })
        .state('app.teamStandings', {
            url: "/teamStandings",
            templateUrl: "team/team_standings.html"
        })
        .state('app.editTeam', {
            url: "/editTeam",
            templateUrl: "team/edit_team.html"
        })
        .state('app.teams', {
            url: "/user/:username/teams",
            templateUrl: "team/my_teams.html"
        })
        .state('app.createTeam', {
            url: "/createTeam",
            templateUrl: "team/create_team.html"
        })
        /**
         *	Organization Stuff
         *
         */
        .state('app.organizationProfile', {
            url: "/organizationProfile",
            templateUrl: "organization/organization_profile.html"
        })
        .state('app.editOrganization', {
            url: "/editOrganization",
            templateUrl: "organization/edit_organization.html"
        })
        .state('app.organizationEvents', {
            url: "/organizationEvents",
            templateUrl: "organization/organization_events.html"
        })
        .state('app.myOrganizations', {
            url: "/myOrganizations",
            templateUrl: "organization/my_organizations.html"
        })
        .state('app.requestOrganization', {
            url: "/requestOrganization",
            templateUrl: "organization/request_organization.html"
        })


    .state('app.search', {
        url: "/search",
        templateUrl: "search.html"
    });
});

myApp.controller("Seeding", function ($scope) {
    $scope.test = {
        "tabs": [
            {
                "firstName": "tournament1",
                "lastName": "Doe"
   },
            {
                "firstName": "tournament1",
                "lastName": "Smith"
   }
]
    }
    $scope.items = ["One", "Two", "Three"];
});

myApp.factory('sharedDataService', function () {
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

