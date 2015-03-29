/**
 * @author PapaLuisre
 */

// Node modules
var express = require('express');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');
var pg = require('pg');
var crypto = require('crypto');

// My modules
var tournaments = require('./modules/tournaments');
var events = require('./modules/events');
var games = require('./modules/games');
var customers = require('./modules/customers');
var search = require('./modules/search');
var teams = require('./modules/teams');
var organizations = require('./modules/organizations');

// Global variables
var conString = "pg://luis:portal1!@127.0.0.1:5432/matchupdb";
var secret = '7h1s h6Re i5 th6 p6rf6c7 plac6 t0 m4kE 4 Nyx A5s4s51n j0k6!';

// Most Valuable Player
var app = express();

// We are going to protect /matchup/ routes with JWT
app.use('/matchup', expressJwt({
	secret : secret
}));

// Needed to handle JSON posts
app.use(bodyParser.json());

// Response sent when trying to access a protected route without a valid token
app.use(function(err, req, res, next) {
	if (err.constructor.name === 'UnauthorizedError') {
		res.status(401).send('Unauthorized');
	}
});

// Allow Cross-origin resourse sharing
app.use(cors());

// Serve the Website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/DB Docs'));
app.use(express.static(__dirname + '/DB Docs/DB Report'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/dist',  express.static(__dirname + '/dist'));

/////////////////////////////////////////////////////////////////////////////////////////// HANDLERS
function authenticate(req, res) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.status(401).send('Unauthorized');
	};

	// Get the values for basic authentication in the header
	var user = basicAuth(req);
	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	// Query the DB to find the account
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		//TODO Query to find the salt and attach it to the password before comparing with the DB
		var query = client.query({
			text : "SELECT customer_username, customer_password, customer_salt FROM customer WHERE customer_username = $1 AND customer_active",
			values : [user.name]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			// Create the token with just the username
			if (result.rows.length > 0) {
				crypto.pbkdf2(user.pass, result.rows[0].customer_salt, 4096, 127, 'sha256', function(err, key) {
					if (err)
						throw err;
					if (result.rows[0].customer_password === key.toString('hex')) {
						var response = {
							username : result.rows[0].customer_username
						};
						// We are sending the username inside the token
						var token = jwt.sign(response, secret);

						res.json({
							token : token
						});
					} else {
						return unauthorized(res);
					}
				});
			} else {
				return unauthorized(res);
			};
		});
	});
}

///////////////////////////////////////////////////////////////////////////////////////////// TEST ROUTES
// *Depreciated* Used for testing of the bracket generation algorithm
app.get('/bracket/:format/:numofplayers', tournaments.createBraket);
// *Depreciated* Used for testing of the group stage algorithm
app.post('/groupstage', tournaments.createGroupStage);
//TODO Read the details from the DB and only expect the array of players
app.post('/tournament', tournaments.createTournament);

///////////////////////////////////////////////////////////////////////////////////////////// API
app.get('/api', function(req, res) {
	res.redirect('http://docs.neptunolabsmatchup.apiary.io');
});

///////////////////////////////////////////////////////////////////////////////////////////// ACCOUNTS
app.post('/create/account', function(req, res) {
	customers.createAccount(req, res, pg, conString, jwt, secret, crypto);
});
app.post('/login', authenticate);

///////////////////////////////////////////////////////////////////////////////////////////// EVENTS
app.get('/events', function(req, res) {
	events.getEvents(req, res, pg, conString);
});
app.get('/events/:event', function(req, res) {
	events.getEvent(req, res, pg, conString);
});
app.post('/matchup/events/:event/news', function(req, res) {
	events.createNews(req, res, pg, conString);
});
app.post('/matchup/events/:event/reviews', function(req, res) {
	events.createReview(req, res, pg, conString);
});
app.post('/matchup/events/:event/meetups', function(req, res) {
	events.createMeetup(req, res, pg, conString);
});
app.route('/matchup/events/:event/news/:news')
	.get(function(req, res) {
		events.getNews(req, res, pg, conString);
	})
	.put(function(req, res) {
		events.updateNews(req, res, pg, conString);
	})
	.delete(function(req, res){
		events.deleteNews(req, res, pg, conString);
	});
app.route('/matchup/events/:event/reviews/:username')
	.get(function(req, res) {
		events.getReview(req, res, pg, conString);
	})
	.delete(function(req, res){
		events.deleteReview(req, res, pg, conString);
	});
app.route('/matchup/events/:event/meetups/:username')
	.get(function(req, res) {
		events.getMeetup(req, res, pg, conString);
	})
	.delete(function(req, res){
		events.deleteMeetup(req, res, pg, conString);
	});


///////////////////////////////////////////////////////////////////////////////////////////// HOME
app.get('/home', function(req, res) {
	events.getHome(res, pg, conString);
});

///////////////////////////////////////////////////////////////////////////////////////////// ORGANIZATIONS
app.get('/organizations', function(req, res) {
	organizations.getOrganizations(req, res, pg, conString);
});
app.route('/matchup/organizations/:organization')
	.get(function(req, res) {
		organizations.getOrganization(req, res, pg, conString);
	})
	.put(function(req, res) {
		organizations.editOrganization(req, res, pg, conString);
	})
	.delete(function(req, res) {
		organizations.deleteOrganization(req, res, pg, conString);
	});
app.route('/matchup/organizations/:organization/user/:username')
	.put(function(req, res) {
		organizations.addOrganizationMember(req, res, pg, conString);
	})
	.delete(function(req, res) {
		organizations.removeOrganizationMember(req, res, pg, conString);
	});

///////////////////////////////////////////////////////////////////////////////////////////// POPULAR
app.get('/popular', function(req, res) {
	games.getPopularStuff(res, pg, conString);
});
app.get('/popular/games', function(req, res) {
	games.getPopularGames(res, pg, conString);
});
app.get('/popular/genres', function(req, res) {
	games.getPopularGenres(res, pg, conString);
});

///////////////////////////////////////////////////////////////////////////////////////////// PROFILE
app.route('/matchup/profile').get(function(req, res) {
	customers.getMyProfile(req, res, pg, conString);
}).delete(function(req, res) {
	customers.deleteAccount(req, res, pg, conString);
});
app.get('/matchup/profile/:username', function(req, res) {
	customers.getUserProfile(req, res, pg, conString);
});

///////////////////////////////////////////////////////////////////////////////////////////// SEARCH
app.get('/search/:parameter', function(req, res) {
	search.getSearchResults(req, res, pg, conString);
});

///////////////////////////////////////////////////////////////////////////////////////////// TEAMS
app.get('/teams', function(req, res) {
	teams.getTeams(req, res, pg, conString);
});
app.get('/teams/:team/members', function(req, res) {
	teams.getTeamMembers(req, res, pg, conString);
});
app.post('/matchup/create/team', function(req, res) {
	customers.createTeam(req, res, pg, conString);
});
app.route('/matchup/teams/:team').get(function(req, res) {
	teams.getTeam(req, res, pg, conString);
}).put(function(req, res) {
	teams.editTeam(req, res, pg, conString);
}).delete(function(req, res) {
	teams.deleteTeam(req, res, pg, conString);
});
app.route('/matchup/teams/:team/user/:username').post(function(req, res) {
	teams.addTeamMember(req, res, pg, conString);
}).put(function(req, res) {
	teams.makeCaptain(req, res, pg, conString);
}).delete(function(req, res) {
	teams.removeTeamMember(req, res, pg, conString);
});

///////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port " + port);
});
