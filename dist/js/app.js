var myApp = angular.module('MatchUp', ['ui.router', 'ngResource', 'as.sortable', 'ui.bootstrap.datetimepicker', 'panhandler', 'Authentication', 'InputDirectives', 'bracketDirective', 'acute.select', 'home', 'premium-events', 'tournaments', 'user', 'organizer', 'organization', 'forms', 'ordinal']);

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
	
	// For any unmatched url, redirect to /login
	$urlRouterProvider.otherwise(function($injector, $location) {
		// this fixes a bug in onstatechangestart where a infinite loop arises in the digest
		var $state = $injector.get("$state");
		$state.go("login");
	});

	//
	// Now set up the states
	$stateProvider.state('login', {
		url : "/login",
		templateUrl : "login.html",
		controller : "loginController"
	}).state('app', {
		url : "/app",
		abstract : true,
		templateUrl : "app.html",
		controller : "sidebarController"
	}).state('app.home', {
		url : "/home",
		templateUrl : "home.html",
		controller : "homeViewController"
	})
	/**
	 * Client Error Handling
	 *
	 */.state('401', {
		url : "/401",
		templateUrl : "401.html"
	}).state('404', {
		url : "/404",
		templateUrl : "404.html"
	}).state('400', {
		url : "/404",
		templateUrl : "404.html"
	})

	/**
	 *	Events
	 *
	 */.state('app.premiumEvent', {
		url : "/summary/:eventname/:date/:location",
		templateUrl : "event/premium_event.html",
		controller : "eventPremiumSummaryController"

	}).state('app.generalEvents', {
		url : "/general-events",
		templateUrl : "event/general_events.html",
		controller : "generalViewController"
	}).state('app.myEvents', {
		url : "/user/:username/my-events",
		templateUrl : "event/my_events.html",
		controller : "myEventsController"
	}).state('app.createEvent', {
		url : "/create/event",
		templateUrl : "event/create_event.html",
		controller : "CreateEventController"
	}).state('app.registeredEvents', {
		url : "/user/:username/registered-events/",
		templateUrl : "event/registered_events.html",
		controller : "registeredEventsController"
	}).state('app.meetupList', {
		url : "/meetups/:eventname/:date/:location",
		templateUrl : "event/meetupList.html",
		controller : "meetupListController"
	}).state('app.meetup', {
		url : "/meetup/:eventName/:eventDate/:eventLocation/:meetupDate/:meetupLocation/:customerUsername",
		templateUrl : "event/meetup.html",
		controller : "meetupController"
	}).state('app.create_meetup', {
		url : "/meetup/:eventName/:eventDate/:eventLocation/create",
		templateUrl : "event/create_meetup.html",
		controller : "createMeetUpController"
	}).state('app.edit_meetup', {
		url : "/meetup/:eventName/:eventDate/:eventLocation/:meetupDate/:meetupLocation/:customerUsername/edit",
		templateUrl : "event/edit_meetup.html",
		controller : "editMeetUpController"
	}).state('app.competitorSignup', {
		url : "/competitorSignup",
		templateUrl : "event/competitor_signup.html"
	})
	/**
	 *	Event organizer views
	 *
	 */.state('app.eventOverview', {
		url : "/event/:eventName/:eventDate/:eventLocation/overview",
		templateUrl : "organizer/event_overview.html",
		controller : "eventOverviewController"

	}).state('app.eventSettings', {
		url : "/settings/event/:eventName/:eventDate/:eventLocation",
		templateUrl : "organizer/event_settings.html",
		controller : "eventSettingsController"

	}).state('app.editEvent', {
		url : "/event/:eventName/:eventDate/:eventLocation/edit",
		templateUrl : "organizer/edit_event.html",
		controller : "editEventController"
	}).state('app.editTournament', {
		url : "/event/:eventName/:eventDate/:eventLocation/tournament/:tournamentName/edit",
		templateUrl : "organizer/edit_tournament.html",
		controller : "editTournamentController"
	}).state('app.tournamentList', {
		url : "/settings/event/:eventName/:eventDate/:eventLocation/tournaments/:manage",
		templateUrl : "organizer/tournament_list.html",
		controller : "editHostedTournamentListController"
	}).state('app.tournamentDetails', {
		url : "/settings/event/:eventName/:eventDate/:eventLocation/tournaments/:tournamentName",
		templateUrl : "organizer/tournament_details.html",
		controller : "tournamentDetailsController"
	}).state('app.registrations', {
		url : "/event/:eventName/:eventDate/:eventLocation/registrations",
		templateUrl : "organizer/registrations.html",
		controller : "RegistrationController"
	}).state('app.registrationsRegular', {
		url : "/event/:eventName/:eventDate/:eventLocation/:tournamentName/regular/registrations",
		templateUrl : "organizer/registrations_regular.html",
		controller : "RegistrationRegularController"
	}).state('app.stationAssignment', {
		url : "/event/:eventName/:eventDate/:eventLocation/stations/edit",
		templateUrl : "organizer/station_assignment.html",
		controller : "StationController"
	}).state('app.seeding', {
		url : "/event/:eventName/:eventDate/:eventLocation/seeding",
		templateUrl : "organizer/seeding.html",
		controller : "SeedingController"
	}).state('app.reportList', {
		url : "/event/:eventName/:eventDate/:eventLocation/reports",
		templateUrl : "organizer/report_list.html",
		controller : "ReportsController"
	})
	/**
	 *	Tournaments
	 *
	 */.state('app.tournament', {
		url : "/:eventname/tournament/:tournament/:date/:location",
		templateUrl : "tournament/tournament.html",
		controller : "tournamentController"
	}).state('app.tournamentLive', {
		url : "/tournamentLive",
		templateUrl : "tournament/tournamentLive.html"
	})
	/**
	 *	User Profiles
	 *
	 */.state('app.userProfile', {
		url : "/user/:username",
		templateUrl : "user/user_profile.html",
		controller : "profileSummaryController"
	}).state('app.userStandings', {
		url : "/user/:username/standings",
		templateUrl : "user/user_standings.html",
		controller : "userStandingsController"
	}).state('app.userTeams', {
		url : "/user/:username/teams",
		templateUrl : "user/user_teams.html",
		controller : "userTeamsController"
	}).state('app.userEvents', {
		url : "/user/:username/events",
		templateUrl : "user/user_events.html",
		controller : "userEventsController"
	}).state('app.userOrganizations', {
		url : "/user/:username/organizations",
		templateUrl : "user/user_organizations.html",
		controller : "userOrganizationsController"
	}).state('app.userMatchups', {
		url : "/user/:username/matchups",
		templateUrl : "user/user_matchups.html",
		controller : "matchupsController"
	}).state('app.editProfile', {
		url : "/user/:username/edit",
		templateUrl : "user/edit_profile.html",
		controller : "editProfileController"
	}).state('app.subcriptions', {
		url : "/subcriptions",
		templateUrl : "user/subscribed.html",
		controller : "mySubcriptionsController"
	})
	/**
	 *	Game Profiles
	 *
	 */.state('app.gameProfile', {
		url : "/game/:game/events",
		templateUrl : "game/game_profile.html",
		controller : "gameProfileController"
	}).state('app.popularGames', {
		url : "/games/popular",
		templateUrl : "game/popular_games.html",
		controller : "gameViewController"
	})
	/**
	 *	Genre Profiles
	 *
	 */.state('app.genreProfile', {
		url : "/genreProfile/:genre",
		templateUrl : "genre/genre_profile.html",
		controller : "genreProfileController"
	}).state('app.genres', {
		url : "/genres",
		templateUrl : "genre/genres.html",
		controller : "genreViewController"
	})
	/**
	 *	Team Stuff
	 *
	 */.state('app.teamProfile', {
		url : "/team/:teamName",
		templateUrl : "team/team_profile.html",
		controller : "teamProfileController"
	}).state('app.teamStandings', {
		url : "/team/:teamName/standings",
		templateUrl : "team/team_standings.html",
		controller : "teamStandingsController"
	}).state('app.editTeam', {
		url : "/team/:teamName/edit",
		templateUrl : "team/edit_team.html",
		controller : "editTeamController"
	}).state('app.createTeam', {
		url : "/create/team",
		templateUrl : "team/create_team.html",
		controller : "CreateTeamController"
	})
	/**
	 *	Organization Stuff
	 *
	 */.state('app.organizationProfile', {
		url : "/organization/:organizationName",
		templateUrl : "organization/organization_profile.html",
		controller : "organizationProfileController"
	}).state('app.editOrganization', {
		url : "/organization/:organizationName/edit",
		templateUrl : "organization/edit_organization.html",
		controller : "editOrganizationController"
	}).state('app.organizationEvents', {
		url : "/organization/:organizationName/events",
		templateUrl : "organization/organization_events.html",
		controller : "organizationEventsController"
	}).state('app.sponsorRequests', {
		url : "/organization/:organizationName/requests",
		templateUrl : "organization/sponsor_requests.html",
		controller : "organizationSponsorRequestsController"
	}).state('app.myOrganizations', {
		url : "/myOrganizations",
		templateUrl : "organization/my_organizations.html"
	}).state('app.requestOrganization', {
		url : "/:user/request/organization",
		templateUrl : "organization/request_organization.html",
		controller : "RequestOrganizationController"
	})
	//No lo borren...
	.state('app.requestOrganizationStatus', {
		url : "/:user/request/organization/status",
		templateUrl : "user/organization_requests.html",
		controller : "organizationRequestsController"
	}).state('app.search', {
		url : "/search/:query",
		templateUrl : "search.html",
		controller : "searchController"
	}).state('app.searchResults', {
		url : "/search/:type/:query",
		templateUrl : "searchResults.html",
		controller : "searchResultsController"
	}).state('app.paySuccessful', {
		url : "/paySuccessful",
		templateUrl : "user/paySuccessful.html",
		controller : "paySuccessfulController"
	});

	$httpProvider.interceptors.push(function($q, $timeout, $injector) {
		var AuthenticationService,
		    $state;
		// Belive me this is needed
		// For some reason adding dependency to this function gives circular dependency error
		// you must inject modules in runtime
		$timeout(function() {
			AuthenticationService = $injector.get('AuthenticationService');
			$state = $injector.get('$state');
		});

		return {
			request : function(config) {
				// AutheticationService is not initiated if the browser is refreshed
				// Hack it with sessionStorage
				if (localStorage.getItem("token") && localStorage.getItem("username"))
					config.headers['Authorization'] = "Bearer " + localStorage.getItem("token");
				return config;
			},
			responseError : function(rejection) {
				// Go to login if user is not authenticated or a 401 status is received
				if (!AuthenticationService.isAuthenticated() || rejection.status == 401) {
					$state.go("login");
					AuthenticationService.clearCredentials();
				}
				// Handle other routes
				else if (rejection.status == 404)
					$state.go("404");
				else if (rejection.status == 403) {
					alert("HTTP error: 403")
					$state.go("app.home");
				} else {
					console.log("HTTP error: " + rejection.status);
					$state.go("app.home");
				}
				return rejection;
			}
		};
	});
});

myApp.run(function($rootScope, $state, AuthenticationService, $window, acuteSelectService, $timeout) {

	$rootScope.baseURL = "https://matchup.neptunolabs.com";
	$rootScope.imgurKey = "6528448c258cff474ca9701c5bab6927";

	// Set the template path for all instances for acute template
	acuteSelectService.updateSetting("templatePath", "event");

//	document.domain = "matchup.neptunolabs.com";

	$rootScope.$on('$stateChangeStart',
		function (event, toState, toParams, fromState, fromParams) {
		// Redirect to pay successful
		if ((toState.name == "login") && localStorage.getItem('payKey')) {
			console.log("in pay key");
			event.preventDefault();
			$state.go('app.paySuccessful');
		}
		// Do not let user access login if the user is authenticated
		else if ((toState.name == "login") && AuthenticationService.isAuthenticated()) {
			console.log("in home");
			event.preventDefault();
			$state.go("app.home");
			// Remove paykey if user navigates away from paySuccessful
			} else if (fromState.name == 'app.paySuccessful' && toState.name != 'app.paySuccessful') {
				localStorage.removeItem('payKey');
			// Do not let user go to paySuccessful if theres no paykey
			} else if (toState.name == 'app.paySuccessful' && !localStorage.getItem('payKey'))
				event.preventDefault();
		}
	);
});

myApp.factory("MatchUpCache", function($cacheFactory) {
	return $cacheFactory("cache");
});

myApp.factory('sharedDataService', function() {
	var savedData = {}

	function set(data) {
		savedData = data;
	}

	function get() {
		return savedData;
	}

	return {
		set : set,
		get : get
	}
})