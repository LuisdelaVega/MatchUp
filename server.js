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
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_password = $2",
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
	tournaments.createGroupStage(req, res);
}

function createTournament(req, res){
	tournaments.createTournament(req, res);
}

function createTeam(req, res) {
	customers.createTeam(req, res, pg, conString);
}

function getTeams(req, res) {
	teams.getTeams(req, res, pg, conString);
}

function getTeam(req, res) {
	teams.getTeam(req, res, pg, conString);
}

function editTeam(req, res) {
	teams.editTeam(req, res, pg, conString);
}

function deleteTeam(req, res){
	teams.deleteTeam(req, res, pg, conString);
}

function getOrganizations(req, res) {
	organizations.getOrganizations(req, res, pg, conString);
}

function getOrganization(req, res) {
	organizations.getOrganization(req, res, pg, conString);
}

function editOrganization(req, res) {
	organizations.editOrganization(req, res, pg, conString);
}

function deleteOrganization(req, res) {
	organizations.deleteOrganization(req, res, pg, conString);
}

///////////////////////////////////////////////////////////////////////////////////////////// TEST ROUTES
app.get('/bracket/:format/:numofplayers', tournaments.createBraket); // *Depreciated* Used for testing of the bracket generation algorithm
app.post('/groupstage', createGroupStage); // *Depreciated* Used for testing of the group stage algorithm
app.get('/home', getHome); // Sends the data to populate the Home view. TODO Limit the amount of objects to 3 of every type
app.get('/popularstuff', getPopularStuff); // Sends popular games and genres. Not sure if it still needed
app.get('/search/:parameter', getSearchResults); // Searches the DB based on the search parameter. TODO Limit the amount of objects to 3 of every type
app.get('/events', getEvents); // Sends a list of events that can be filtered by when it started, game or genre featured, and by type (regular or hosted). TODO Implement limit and offsets like in Spruce
app.get('/events/:event', getEvent); // Get the details for a specific Event

app.post('/create/account', createAccount); // Create a new account
app.post('/tournament', createTournament); // Generates a Tournament based on the information sent in the body. TODO Read the details from the DB and only expect the array of players

///////////////////////////////////////////////////////////////////////////////////////////// API ROUTES
app.get('/api/teams', getTeams); // Sends a list of every Team
app.get('/api/organizations', getOrganizations); // Sends a list of every Organization

///////////////////////////////////////////////////////////////////////////////////////////// MatchUp ROUTES
app.get('/matchup/profile', getMyProfile);
app.get('/matchup/profile/:username', getUserProfile);

app.post('/login', authenticate);
app.post('/matchup/create/team', createTeam);

app.route('/matchup/organizations/:organization')
	.get(getOrganization) // Get the details for a specific Organization
	.put(editOrganization)
	.delete(deleteOrganization);
app.route('/matchup/teams/:team')
	.get(getTeam) // Get the details for a specific Team
	.put(editTeam)
	.delete(deleteTeam);

////////////////////////////////////////////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port " + port);
});
