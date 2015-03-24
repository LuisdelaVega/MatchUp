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

// My modules
var brackets = require('./modules/brackets');
var events = require('./modules/events');
var games = require('./modules/games');
var customers = require('./modules/customers');
var search = require('./modules/search');

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
		var query = client.query({
			text : "SELECT customer.customer_username FROM customer WHERE customer_username = $1 AND customer_password = $2",
			values : [user.name, user.pass]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			// Create the token with just the username
			if (result.rows.length > 0) {
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
			};
		});
	});
}

function getHome(req, res) {
	events.getHome(res, pg, conString);
}

function getMyProfile(req, res) {
	customers.getMyProfile(req, res, pg, conString);
}

function getUserProfile(req, res) {
	customers.getUserProfile(req, res, pg, conString);
}

function getPopularStuff(req, res) {
	games.getPopularStuff(res, pg, conString);
}

function getSearchResults(req, res) {
	search.getSearchResults(req, res, pg, conString);
}

function getEvents(req, res) {
	events.getEvents(req, res, pg, conString);
}

function getEvent(req, res) {
	events.getEvent(req, res, pg, conString);
}

function createAccount(req, res) {
	customers.createAccount(req, res, pg, conString, jwt, secret);
}

function createGroupStage(req, res){
	brackets.createGroupStage(req, res);
}

function createTournament(req, res){
	brackets.createTournament(req, res);
}

function createTeam(req, res) {
	customers.createTeam(req, res, pg, conString);
}

///////////////////////////////////////////////////////////////////////////////////////////// TEST ROUTES
app.get('/bracket/:type/:numofplayers', brackets.createBraket);
app.get('/home', getHome);
app.get('/popularstuff', getPopularStuff);
app.get('/search/:parameter', getSearchResults);
app.get('/events', getEvents);
app.get('/events/:event', getEvent);
app.post('/create/account', createAccount);
app.post('/groupstage', createGroupStage);
app.post('/tournament', createTournament);

///////////////////////////////////////////////////////////////////////////////////////////// API ROUTES

///////////////////////////////////////////////////////////////////////////////////////////// MatchUp ROUTES
app.post('/login', authenticate); // Get token by loging in to our service
app.get('/matchup/profile', getMyProfile);
app.get('/matchup/profile/:username', getUserProfile);
app.post('/matchup/create/team', createTeam);

////////////////////////////////////////////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port " + port);
});
