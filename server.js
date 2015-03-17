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
var test = require('./modules/test');
var events = require('./modules/events');

// Global variables
var conString = "pg://luis:portal1!@127.0.0.1:5432/matchupdb";
var secret = '7h1s h6Re i5 th6 p6rf6c7 plac6 t0 m4kE 4 Nyx A5s4s51n j0k6!';

// MVP
var app = express();

// We are going to protect /matchup routes with JWT
app.use('/matchup', expressJwt({
	secret : secret
}));

// Needed to handle JSON posts
app.use(bodyParser.json());

//TODO Find out what the hell this is used for
// Error handling, not really sure why I added this
app.use(function(err, req, res, next) {
	if (err.constructor.name === 'UnauthorizedError') {
		res.status(401).send('Unauthorized');
	}
});

// Allow Cross-origin resourse sharing
app.use(cors());

// Serve the HTML
app.use(express.static(__dirname + '/public'));

/////////////////////////////////////////////////////////////////////////////////////////// HANDLERS
function getMyProfile(req, res) {
	res.json({
		username : req.user.acc[0].customer_username,
		first_name : req.user.acc[0].customer_first_name,
		bio : req.user.acc[0].customer_bio
	});
}

function authenticate(req, res) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.send(401);
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
			text : "SELECT * FROM customer WHERE customer_username = $1 AND customer_password = $2",
			values : [user.name, user.pass]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			// Create the token
			if (result.rows.length > 0) {
				var response = {
					"success" : true,
					"acc" : result.rows
				};
				// We are sending the profile inside the token
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
	var eventList = new Object();
	events.getHome(res, eventList, pg, conString);
}

function getLiveEvents(req, res) {
	events.getLiveEvents(res, pg, conString);
}

function getLocalEvents(req, res) {
	events.getRegularEvents(res, pg, conString);
}

function getHostedEvents(req, res) {
	events.getHostedEvents(res, pg, conString);
}

function getUserProfile(req, res) {
	res.send("Hello!");
}

///////////////////////////////////////////////////////////////////////////////////////////// ROUTES
app.get('/test/bracket/:type/:numofplayers', test.createBraket);
app.post('/login', authenticate);
app.get('/matchup/profile', getMyProfile);
app.get('/matchup/profile/:username', getUserProfile);
app.get('/test/home', getHome);
app.get('/api/events/live', getLiveEvents);
app.get('/api/events/regular', getLocalEvents);
app.get('/api/events/hosted', getHostedEvents);

////////////////////////////////////////////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port " + port);
});
