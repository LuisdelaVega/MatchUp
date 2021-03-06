/**
 * @author PapaLuisre
 */

// Node modules
var express = require('express');
var fs = require('fs');
var https = require('https');
var ipn = require('paypal-ipn');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');
var pg = require('pg');
pg.defaults.poolSize = 80;
pg.defaults.poolIdleTimeout = 1000;
var crypto = require('crypto');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
	name : 'MatchUp Server',
	serializers : {
		req : bunyan.stdSerializers.req,
		res : bunyan.stdSerializers.res
	}
});

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
// Paypal
var PAYPAL_USERID = 'neptunolabs-facilitator_api1.gmail.com';
var PAYPAL_PASSWORD = 'XWBY9MS84HGAH5QD';
var PAYPAL_SIGNATURE = 'AQU0e5vuZCvSg-XJploSa.sGUDlpADHudcLIG.989J8K1T5hwCU6BTLu';
var PAYPAL_FORMAT = 'JSON';
var PAYPAL_APPID = 'APP-80W284485P519543T';

// Most Valuable Player
var app = express();

// For paypal
//app.use(require('connect').bodyParser());

// We are going to protect /matchup/ routes with JWT
app.use('/matchup', expressJwt({
	secret : secret
}));

// Needed to handle JSON posts
app.use(bodyParser.json());

// Response sent when trying to access a protected route without a valid token
app.use(function(err, req, res, next) {
	if (err.constructor.name === 'UnauthorizedError') {
		res.set('WWW-Authenticate', 'Bearer realm=Authorization Required');
		res.status(401).send('Unauthorized');
	}
});

// Allow Cross-origin resource sharing
app.use(cors());

// Serve the Website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/DB Docs'));
app.use(express.static(__dirname + '/DB Docs/DB Report'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/dist',  express.static(__dirname + '/dist'));

/////////////////////////////////////////////////////////////////////////////////////////// HANDLERS
function authenticate(req, res) {
	log.info({
		req : req
	}, 'start request');
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		res.status(401).send('Unauthorized');
		log.info({
			res : res
		}, 'done response');
	}
	// Get the values for basic authentication in the header
	var user = basicAuth(req);
	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	}
	// Query the DB to find the account
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "SELECT customer_username, customer_password, customer_salt FROM customer WHERE customer_username = $1 AND customer_active",
			values : [user.name]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			// Create the token with just the username
			if (result.rows.length) {
				crypto.pbkdf2(user.pass, result.rows[0].customer_salt, 4096, 127, 'sha256', function(err, key) {
					if (err)
						throw err;
					if (result.rows[0].customer_password === key.toString('hex')) {
						var response = {
							username : result.rows[0].customer_username
						};
						// We are sending the username inside the token
						var token = jwt.sign(response, secret);
						done();
						res.status(200).json({
							token : token
						});
						log.info({
							res : res
						}, 'done response');
					} else {
						done();
						return unauthorized(res);
					}
				});
			} else {
				done();
				return unauthorized(res);
			}
		});
	});
}

//*\\\\\\\\\\* Paypal *//////////*/
/*
 * Callback function to initialize the paypal transaction
 */
function initPaypal(req, res, details, log, createTables) {
	//Set up the request to paypal
	var req_options = {
		host: 'svcs.sandbox.paypal.com',
		method: 'POST',
		path: '/AdaptivePayments/Pay',
		headers: {
			'X-PAYPAL-SECURITY-USERID': PAYPAL_USERID,
			'X-PAYPAL-SECURITY-PASSWORD': PAYPAL_PASSWORD,
			'X-PAYPAL-SECURITY-SIGNATURE': PAYPAL_SIGNATURE,
			'X-PAYPAL-REQUEST-DATA-FORMAT': PAYPAL_FORMAT,
			'X-PAYPAL-RESPONSE-DATA-FORMAT': PAYPAL_FORMAT,
			'X-PAYPAL-APPLICATION-ID': PAYPAL_APPID
		}
	};

	var body = {
		"actionType": "PAY",
		"currencyCode": "USD",
		"receiverList": {
			"receiver": [
				{
					"amount": details.amount,//"10.00", // Changes
					"email": details.email//"bigote@gmail.com" // Changes
				}
			]
		},
		"returnUrl": "https://matchup.neptunolabs.com/paypalSuccess",
		"cancelUrl": "http://www.example.com/failure.html",
		"ipnNotificationUrl": "https://matchup.neptunolabs.com/paypal",
		"requestEnvelope": {
			"errorLanguage": "en_US",
			"detailLevel": "ReturnAll"
		}
	};

	var paypalReq = https.request(req_options, function paypal_request(paypalRes) {
		var data = '';

		paypalRes.on('data', function paypal_response(d) {
			data += d;
		});

		paypalRes.on('end', function response_end() {
			var dataJSON = JSON.parse(data);
			console.log(dataJSON);
			console.log(dataJSON.payKey);

			// Create the tables
			createTables(req, pg, conString, dataJSON.payKey, details);

			res.status(200).send(JSON.stringify(dataJSON));
			log.info({
				res: res
			}, 'done response');
		});
	});

	//Add the post parameters to the request body
	paypalReq.write(JSON.stringify(body));

	//Request error
	paypalReq.on('error', function (err) {
		console.log('error requesting paypal');
	});

	paypalReq.end();
}

app.get('/paypalSuccess', function(req, res){
	log.info({
		req : req
	}, 'start request');

	console.log(req.headers.referer);
	var payKey = req.headers.referer.split("=")[2];

	/*
	 * Query looking for the paykey to know if competitor/spectator/payout
	 * Update query competitor/spectator/payout paid value
	 */
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		client.query({
			text: "UPDATE spectator_pays SET transaction_completed = true WHERE spectator_paykey = $1",
			values: [payKey]
		}, function (err, result) {
			if (err) {
				client.query("ROLLBACK");
				done();
				console.log(err);
			} else {
				client.query({
					text: "UPDATE competitor_pays SET competitor_paid = true WHERE competitor_paykey = $1",
					values: [payKey]
				}, function (err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						console.log(err);
					} else {
						client.query({
							text: "UPDATE payout SET transaction_completed = true WHERE payout_paykey = $1",
							values: [payKey]
						}, function (err, result) {
							if (err) {
								client.query("ROLLBACK");
								done();
								console.log(err);
							} else {
								client.query("COMMIT");
								done();
							}
						});
					}
				});
			}
		});
	});

	//res.status(200).send(payKey);
	res.status(302).redirect('https://matchup.neptunolabs.com');

	log.info({
		res : res
	}, 'done response');
});


app.post('/paypal', function(req,res){
	log.info({
		req : req
	}, 'start request');

	console.log("IN PAYPAL !! req.body : ");
	console.log(req.body);
	res.status(200).send('');
	ipn.verify(req.body, {'allow_sandbox': true}, function callback(err, msg) {
	    if (err) {
	        console.log("Error:" + err);
	    } else {
	        //Do stuff with original params here
	        console.log("req.body.payment_status :" + req.body.payment_status + " msg: " + msg);
	        //res.end();
	        if (req.body.payment_status == 'Completed') {
	            //Payment has been confirmed as completed

	        }
	    }
	});
	log.info({
		res : res
	}, 'done response');
});

app.get('/matchup/paypal/:payKey', function(req,res){
	// Set up payment details headers and body
	var req_options = {
		host: 'svcs.sandbox.paypal.com',
		method: 'POST',
		path: '/AdaptivePayments/PaymentDetails',
		headers: {
			'X-PAYPAL-SECURITY-USERID': PAYPAL_USERID,
			'X-PAYPAL-SECURITY-PASSWORD': PAYPAL_PASSWORD,
			'X-PAYPAL-SECURITY-SIGNATURE': PAYPAL_SIGNATURE,
			'X-PAYPAL-REQUEST-DATA-FORMAT': PAYPAL_FORMAT,
			'X-PAYPAL-RESPONSE-DATA-FORMAT': PAYPAL_FORMAT,
			'X-PAYPAL-APPLICATION-ID': PAYPAL_APPID
		}
	};

	var body = {
			'payKey': req.params.payKey,
			'requestEnvelope': {
				'errorLanguage': 'en_US',
				'detailLevel': 'ReturnAll'
			}
		};

	var paypalReq = https.request(req_options, function paypal_request(paypalRes) {
		var data = '';

		paypalRes.on('data', function paypal_response(d) {
			data += d;
		});

		paypalRes.on('end', function response_end() {
			var dataJSON = JSON.parse(data);
			console.log(dataJSON);

			res.status(200).send(JSON.stringify(dataJSON));
			log.info({
				res: res
			}, 'done response');
		});
	});

	//Add the post parameters to the request body
	paypalReq.write(JSON.stringify(body));

	//Request error
	paypalReq.on('error', function (err) {
		console.log('error requesting paypal');
	});

	paypalReq.end();
});

///////////////////////////////////////////////////////////////////////////////////////////// TEST ROUTES
//*\\\\\\\\\\* API *//////////*/
/* /api
 *
 * [GET] Redirects to the MatchUp API powered by Apiary
 */
app.get('/api', function(req, res) {
	log.info({
		req : req
	}, 'start request');
	res.status(302).redirect('http://docs.neptunolabsmatchup.apiary.io');
	log.info({
		res : res
	}, 'done response');
});

//*\\\\\\\\\\* ACCOUNTS *//////////*/
/* /create/account
 *
 * [POST] Create a new account
 */
app.post('/create/account', function(req, res) {
	log.info({
		req : req
	}, 'start request');
	// if (!req.body.username || !req.body.password || !req.body.firstname || !req.body.lastname || !req.body.tag || !req.body.email) {
	// res.status(400).json({
	// error : "Incomplete or invalid parameters"
	// });
	// log.info({
	// res : res
	// }, 'done response');
	// } else {
	customers.createAccount(req, res, pg, conString, jwt, secret, crypto, log);
	// }
});

/* /login
 *
 * [POST] Login to receive a token for your account
 */
app.post('/login', authenticate);

//*\\\\\\\\\\* EVENTS *//////////*/
/* /matchup/events?type=string&filter=string&value=string&state=string
 * /matchup/events?hosted=bool
 *
 * params:
 * 	type = Events can be created/organized by a single customer or can be hosted by an organization. Possible values: [regular, hosted]
 * 	filter = Filter Events by the games that are played or by a genre of games. Possible values: [game, genre]
 * 	value = The value for the filter. The game/genre (i.e, filter=game&value=Street Fighter)
 * 	state = Indicate if the list of Events will show only ongoing Events, upcoming Events, or past Events. Possible values: [live, upcoming, past]
 * 	hosted = When creating a new Event, indicate if it will be hosted by an Organization you belong to
 *
 * [GET] Get a list of all Events
 * [POST] Create an Event
 */
app.route('/matchup/events').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getEvents(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.createEvent(req, res, pg, conString, log);
});

/* /matchup/events/:event?date=date&location=string
 *
 * params:
 * 	event = Name of the event
 * 	date = Start date of the event
 * 	location = Location of the event
 *
 * [GET] Get the details for a specific Event
 * [POST] Add a Tournament to a specific Event
 * [PUT] Edit the details of a specific Event
 * [DELETE] Remove a specific Event
 */
app.route('/matchup/events/:event').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	var date = new Date(req.query.date);
	if (!(date.getTime()) || !req.params.event || !req.query.location) {
		res.status(400).json({
			error : "Incomplete or invalid parameters"
		});
		log.info({
			res : res
		}, 'done response');
	} else {
		events.getEvent(req, res, pg, conString, log);
	}
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	var eventStartDate = new Date(req.query.date);
	var startDate = new Date(req.body.start_date);
	var checkInDeadline = new Date(req.body.deadline);
	if (!(eventStartDate.getTime()) || !(startDate.getTime()) || !(checkInDeadline.getTime()) || startDate.getTime() < checkInDeadline.getTime() || startDate.getTime() < eventStartDate.getTime() || !req.body.name || !req.body.game || !req.body.rules || isNaN(req.body.fee) || req.body.fee < 0 || isNaN(req.body.capacity) || req.body.capacity < 0 || isNaN(req.body.seed_money) || req.body.seed_money < 0 || !req.body.type || !req.body.format || !req.body.scoring || isNaN(req.body.group_players) || req.body.group_players < 0 || isNaN(req.body.group_winners) || req.body.group_winners < 0) {
		res.status(400).json({
			error : "Incomplete or invalid parameters"
		});
		log.info({
			res : res
		}, 'done response');
	} else {
		events.addTournament(req, res, pg, conString, log);
	}
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	var eventStartDate = new Date(req.body.start_date);
	var eventEndDate = new Date(req.body.end_date);
	var eventRegistrationDeadline = new Date(req.body.registration_deadline);
	if (!(eventStartDate.getTime()) || !(eventStartDate.getTime()) || !(eventEndDate.getTime()) || !(eventRegistrationDeadline.getTime()) || eventRegistrationDeadline.getTime() > eventStartDate.getTime() || eventStartDate.getTime() > eventEndDate.getTime()) {
		res.status(400).json({
			error : "Incomplete or invalid parameters"
		});
		log.info({
			res : res
		}, 'done response');
	} else {
		events.editEvent(req, res, pg, conString, log);
	}
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.deleteEvent(req, res, pg, conString, log);
});

/* DEPRECIATED
 * More data of spectators and competitors is given when their respective routes are called. This route is not in the API
 * 
 * /matchup/events/:event/participants?date=date&location=string&spectators=true&competitors=true
 * params:
 * 	spectators = Filters the participants to those who payed a spectator fee
 * 	competitors = Filters the participants to those who payed a competitor fee
 *
 * [GET] Get all Customers that are registered for an event
 */
app.route('/matchup/events/:event/participants').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getParticipants(req, res, pg, conString, log);
});

/* /matchup/events/:event/spectators?date=date&location=string
 *
 *
 * [GET] Get all Spectators that are registered for an event
 */
app.route('/matchup/events/:event/spectators').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getEventSpectators(req, res, pg, conString, log);
});

/* /matchup/events/:event/spectators/:username?date=date&location=string
 *
 * [PUT] Check/Uncheck a Spectator into a Tournament
 */
app.route('/matchup/events/:event/spectators/:username').put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.checkInSpectator(req, res, pg, conString, log);
});

/* /matchup/events/:event/stations?date=date&location=string
 * /matchup/events/:event/stations?date=date&location=string&station=int
 *
 * [GET] Get all Stations in an Event
 * [POST] Add a new Station to your Event
 * [DELETE] Remove a station from your Event
 */
app.route('/matchup/events/:event/stations').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getStationsForEvent(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.addStation(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.removeStation(req, res, pg, conString, log);
});

/* /matchup/events/:event/stations/:station?date=date&location=string
 *
 * params:
 * 	station = Station number
 *
 * [GET] Get the details for a specific station
 * [POST] Add a stream link to a specific station
 * [PUT] Edit the stream link for a specific station
 * [DELETE] Remove the stream link for a specific station
 */
app.route('/matchup/events/:event/stations/:station').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getStation(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.addStream(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.editStation(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.removeStream(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments?date=date&location=string
 *TODO update API
 * [GET] Get all Tournaments from a specific Event
 */
app.route('/matchup/events/:event/tournaments').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getTournaments(req, res, pg, conString, log);
});

/* /matchup/events/:event/specfees?date=date&location=string
 *TODO update API
 * [GET] Get all Spectator fees for a specific Event
 * [POST] Add a new Spectator fee to an Event
 */
app.route('/matchup/events/:event/specfees').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getSpecFees(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.addSpecFee(req, res, pg, conString, log);
});

/* /matchup/events/:event/specfees/:spec_fee?date=date&location=string
 *TODO update API
 *
 * 	params:
 * 		spec_fee = The name of the spectator fee
 *
 * [POST] Register in an Event as a Spectator
 * [DELETE] Remove a Spectator fee for an Event
 */
app.route('/matchup/events/:event/specfees/:spec_fee').post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.registerAsSpectator(req, res, pg, conString, log, initPaypal);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.removeSpecFee(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament?date=date&location=string&station=int
 * TODO Update API
 * params:
 * 	tournament = The name of the Tournament
 *
 * [GET] Get a single Tournament from a specific Event
 * [POST] Attach a station to a Tournament
 * [PUT] Edit the details of a specific Tournament
 * [DELETE] Remove a specific Tournament from an Event
 */
app.route('/matchup/events/:event/tournaments/:tournament').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getTournament(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.attachStation(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	// var eventStartDate = new Date(req.query.date);
	// var startDate = new Date(req.body.start_date);
	// var checkInDeadline = new Date(req.body.deadline);
	// if (!(eventStartDate.getTime()) || !(startDate.getTime()) || !(checkInDeadline.getTime()) || startDate.getTime() < checkInDeadline.getTime() || startDate.getTime() < eventStartDate.getTime() || startDate.getTime() > eventEndDate.getTime() || !req.body.name || !req.body.game || !req.body.rules || !req.body.teams || isNaN(req.body.fee) || req.body.fee < 0 || isNaN(req.body.capacity) || req.body.capacity < 0 || isNaN(req.body.seed_money) || req.body.seed_money < 0 || !req.body.type || !req.body.format || !req.body.scoring || isNaN(req.body.group_players) || req.body.group_players < 0 || isNaN(req.body.group_winners) || req.body.group_winners < 0) {
	// res.status(400).json({
	// error : "Incomplete or invalid parameters"
	// });
	// log.info({
	// res : res
	// }, 'done response');
	// } else {
	events.editTournament(req, res, pg, conString, log);
	// }
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.removeTournament(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/create?date=date&location=string
 * TODO Allow only event organizers to do this
 * 
 * [POST] Create the stages of a Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/create').post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.createTournament(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.deleteStages(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/register?date=date&location=string
 * TODO Update API
 *
 * 	params:
 * 		+ Body [If the team_size > 1]
 * 			{
 * 				"team": "Name of team",
 * 				"players": ["Usernames of players"]
 * 			}
 *
 * [POST] Register to play in a Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/register').post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.registerForTournament(req, res, pg, conString, log, initPaypal);
});

/* /matchup/events/:event/tournaments/:tournament/standings?date=date&location=string
 * TODO Update API
 * [GET] Get the standings of a Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/standings').get(function(req, res) {
    log.info({
        req : req
    }, 'start request');
    tournaments.getStandings(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/rounds?date=date&location=string
 * TODO Update API
 * [GET] Get the rounds of a Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/rounds').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.getRounds(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/rounds?date=date&location=string?round_of=string
 * TODO Update API
 *
 * [POST] Edit the amount of sets for the matches in a round
 * [PUT] Un-pause a round or change the start date of a round
 *      params:
 *          + Body
 *              {
 *                  "start_date" : timestamp
 *              }
 */
app.route('/matchup/events/:event/tournaments/:tournament/rounds/:round').post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.editBestOf(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	if (req.body.start_date) {
		if ((new Date(req.body.start_date)).getTime() == -1) {
			res.status(400).json({
				invalid_date_value : true
			});
			log.info({
				res: res
			}, 'done response');
		} else {
			tournaments.changeTimeAndDateOfRound(req, res, pg, conString, log);
		}
	} else {
		tournaments.unPauseRound(req, res, pg, conString, log);
	}
});

/* /matchup/events/:event/tournaments/:tournament/rounds/:rounds/matches/:match?round_of=string
 * TODO Update API
 * [GET] Get a specific match
 * [POST] Change the station for a match
 * [PUT] Mark a match as favourite
 */
app.route('/matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.getMatch(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.changeStation(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.markAsFavourite(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match/:set?date=date&location=string&round_of=string
 * TODO Update in API
 * 	Params:
 * 		round_of = Indicates where the round was/it to be played. Posible values: [Group, Winner, Loser, Round Robin]
 *
 * [PUT] Submit the results of a Set
 * [POST] Submit a report for the match
 * TODO [PUT] Update the results of a Set TODO Do in another route
 */
app.route('/matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match/:set').post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.createReport(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.submitScore(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match/:set/change?date=date&location=string&round_of=string
 * TODO Update in API
 * 	Params:
 * 		round_of = Indicates where the round was/it to be played. Posible values: [Group, Winner, Loser, Round Robin]
 *
 * TODO [PUT] Update the results of a Set TODO Do in another route
 */
app.route('/matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match/:set/change').put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.changeScore(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match/:set?date=date&location=string&round_of=string
 * TODO Update in API
 * 	Params:
 * 		round_of = Indicates where the round was/it to be played. Posible values: [Group, Winner, Loser, Round Robin]
 *
 * [PUT] Mark a resport as Resolved
 */
app.route('/matchup/events/:event/tournaments/:tournament/rounds/:round/matches/:match/:set/:report').put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.resolveReport(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/stations?date=date&location=string&station=int
 *
 * [GET] Get all stations attached to a Tournament
 * [DELETE] Detach a station from a Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/stations').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getStationsforTournament(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.detachStation(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/competitors?date=date&location=string
 *
 * [GET] Get the details for all Competitors for a specific Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/competitors').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getCompetitors(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/payouts?date=date&location=string
 *
 * [GET] Get the Winners that will have money thrown at their faces
 * [POST] Throw your money at the faces of the Winners
 */
app.route('/matchup/events/:event/tournaments/:tournament/payouts').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.getPayouts(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.payWhatYouOwe(req, res, pg, conString, log, initPaypal);
});

/* /matchup/events/:event/tournaments/:tournament/competitors/checked?date=date&location=string
 * TODO Update API
 *
 * 	params:
 * 		+ Body
 * 			{
 * 				"players": [{"competitor_number": int, "seed": int}]
 * 			}
 *
 * [GET] Get the details for all Competitors for a specific Tournament
 * [PUT] Arrange the seeds for the competitors of a Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/competitors/checked').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.getCheckedInCompetitors(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.arrangeSeeds(req, res, pg, conString, log);
});

/* /matchup/events/:event/tournaments/:tournament/competitors/:competitor?date=date&location=string
 *
 * params:
 * 	competitor = The competitor number id
 *
 * [PUT] Check/Uncheck a Competitor into a Tournament
 */
app.route('/matchup/events/:event/tournaments/:tournament/competitors/:competitor').put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.checkInCompetitor(req, res, pg, conString, log);
});

/* /matchup/events/:event/news?date=date&location=string
 *
 * [GET] Get all News posted on a specific Event
 * [POST] Create a new News article for a specific Event
 */
app.route('/matchup/events/:event/news').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getAllNews(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.createNews(req, res, pg, conString, log);
});

/* /matchup/events/:event/news/:news?date=date&location=string
 *
 * [GET] Get the details for a specific News article
 * [PUT] Edit the details of a specific News article
 * [DELETE] Remove a specific News article
 */
app.route('/matchup/events/:event/news/:news').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getNews(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.updateNews(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.deleteNews(req, res, pg, conString, log);
});

/* /matchup/events/:event/reviews?date=date&location=string
 *
 * [GET] Get all Reviews posted on a specific Event
 * [POST] Post a new Review for a specific Event
 */
app.route('/matchup/events/:event/reviews').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getReviews(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.createReview(req, res, pg, conString, log);
});

/* /matchup/events/:event/review/:username?date=date&location=string
 *
 * [GET] Get the details for a specific Review
 * [PUT] Edit the details of a Review written by you
 * [DELETE] Remove a Review written by you
 */
app.route('/matchup/events/:event/reviews/:username').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getReview(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.updateReview(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.deleteReview(req, res, pg, conString, log);
});

/* /matchup/events/:event/meetups?date=date&location=string
 *
 * [GET] Get all Meetups posted on a specific Event
 * [POST] Create a new Meetup for a specific Event
 */
app.route('/matchup/events/:event/meetups').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getMeetups(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.createMeetup(req, res, pg, conString, log);
});

/* /matchup/events/:event/meetups/:username?date=date&location=string&meetup_date=date&meetup_location=string
 *
 * [GET] Get the details for a specific Meetup
 * [PUT] Edit the details of a specific Meetup posted by you
 * [DELETE] Remove a specific Meetup posted by you
 */
app.route('/matchup/events/:event/meetups/:username').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getMeetup(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.updateMeetup(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.deleteMeetup(req, res, pg, conString, log);
});

/* /matchup/events/:event/reports?date=date&location=string
 * TODO Update API
 * [GET] Get all Reports posted on a specific Event
 */
app.route('/matchup/events/:event/reports').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getReports(req, res, pg, conString, log);
});

/* /matchup/events/:event/sponsors?date=date&location=string&sponsor=string
 *
 * params:
 * 	sponsor = The name of the sponsor
 *
 * [GET] Get all sponsors of an Event
 * [POST] Add sponsor to your Event
 * [DELETE] Remove a sponsor from an Event
 */
app.route('/matchup/events/:event/sponsors').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.getSponsors(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.addSponsorToEvent(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	events.removeSponsor(req, res, pg, conString, log);
});

//*\\\\\\\\\\* ORGANIZATIONS *//////////*/
/* /matchup/organizations
 *
 * [GET] Get all registered Organizations
 * [POST] Send a request to create an Organization
 */
app.route('/matchup/organizations').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.getOrganizations(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	// if (!req.body.name || !req.body.description) {
	// res.status(400).json({
	// error : "Incomplete or invalid parameters"
	// });
	// log.info({
	// res : res
	// }, 'done response');
	// } else {
	customers.requestOrganization(req, res, pg, conString, log);
	// }
});

/* /matchup/organizations/:organization
 *
 * params:
 * 	organization = The name of the Organization
 *
 * [GET] Get the details of a specific Organization
 * [PUT] Edit the details of a specific Organization
 * [DELETE] Remove an Organization from the system
 */
app.route('/matchup/organizations/:organization').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.getOrganization(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.editOrganization(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.deleteOrganization(req, res, pg, conString, log);
});

/* /matchup/organizations/:organization/members
 * /matchup/organizations/:organization/members?username=string&owner=bool
 * /matchup/organizations/:organization/members?username=string
 *
 * [GET] Get all members of a specific Organization
 * [POST] Add a new member to your Organization
 * [DELETE] Remove a member from your Organization
 */
app.route('/matchup/organizations/:organization/members').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.getOrganizationMembers(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.addOrganizationMember(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.removeOrganizationMember(req, res, pg, conString, log);
});

/* /matchup/organizations/:organization/events
 *
 * [GET] Get all Events hosted by a specific Organization
 */
app.route('/matchup/organizations/:organization/events').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.getOrganizationEvents(req, res, pg, conString, log);
});

/* /matchup/organizations/:organization/requests
 * TODO Update API
 * [GET] Get all Sponsor requests by a specific Organization
 */
app.route('/matchup/organizations/:organization/requests').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.getSponsorRequests(req, res, pg, conString, log);
});

/* /matchup/organizations/:organization/sponsors?sponsor=string
 *
 * [GET] All sponsors for a specific Organization
 * [POST] Request to add a Sponsor to your organization
 * [DELETE] Remove a Sponsor from your Organization *NEEDS TEST**
 */
app.route('/matchup/organizations/:organization/sponsors').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.getSponsors(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.requestSponsor(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	organizations.removeSponsor(req, res, pg, conString, log);
});

//*\\\\\\\\\\* POPULAR *//////////*/
/* /matchup/popular/games
 *
 * [GET] Get a list of all Games ordered by their popularity (Amount of Tournaments that feature them)
 */
app.get('/matchup/popular/games', function(req, res) {
	log.info({
		req : req
	}, 'start request');
	games.getPopularGames(res, pg, conString, log);
});

/* /matchup/popular/genres
 *
 * [GET] Get a list of all Genres ordered by their popularity (Amount of Tournaments that feature Games of their genre)
 */
app.get('/matchup/popular/genres', function(req, res) {
	log.info({
		req : req
	}, 'start request');
	games.getPopularGenres(res, pg, conString, log);
});

//*\\\\\\\\\\* PROFILE *//////////*/ TODO Register as Spectator or Competitor ?? Ask if we should demo the sandbox money thing
/* /matchup/profile
 *
 * [GET] Get the details of your account
 * [PUT] Edit the details of your account
 * [DELETE] Remove your account from the system
 */
app.route('/matchup/profile').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getMyProfile(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.editAccount(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.deleteAccount(req, res, pg, conString, log);
});

/* /matchup/profile/matchups?state=string
 * 
 * 	params:
 * 		state = Indicates whether to look for past matchups or current matchups. Possible values: [Past, Upcoming]
 * 			note: Defaults to Upcoming
 *
 * [GET] Get a list of your upcoming or past matches
 */
app.route('/matchup/profile/matchups').get(function(req, res) {
	//log.info({
	//	req : req
	//}, 'start request');
	customers.getMatchups(req, res, pg, conString, log);
});

/* /matchup/profile/:username/matchups?state=string
 *
 * 	params:
 * 		state = Indicates whether to look for past matchups or current matchups. Possible values: [Past, Upcoming]
 * 			note: Defaults to Upcoming
 *
 * [GET] Get a list of your upcoming or past matches
 */
app.route('/matchup/profile/:username/matchups').get(function(req, res) {
	//log.info({
	//	req : req
	//}, 'start request');
	customers.getMatchupsForUser(req, res, pg, conString, log);
});

/* /matchup/profile/:username
 *
 * [GET] Get the details of a specific Customer
 * [POST] Subscribe to a specific Customer
 * [DELETE] Unsubscribe to a specific Customer
 */
app.route('/matchup/profile/:username').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getUserProfile(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.subscribe(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.unsubscribe(req, res, pg, conString, log);
});

/* /matchup/profile/:username/subscriptions
 *
 * [GET] Get the subscriptions of a specific Customer
 */
app.route('/matchup/profile/:username/subscriptions').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getSubscriptions(req, res, pg, conString, log);
});

/* /matchup/profile/:username/subscriptions
 * TODO Update API
 * [GET] Get the Spectator fees a specific Customer has paid
 */
app.route('/matchup/profile/:username/specfees').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getSpecFees(req, res, pg, conString, log);
});

/* /matchup/profile/:username/standings
 *
 * [GET] Get the subscriptions of a specific Customer
 */
app.route('/matchup/profile/:username/standings').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getStandings(req, res, pg, conString, log);
});

/* /matchup/profile/:username/teams
 *
 * [GET] Get the Teams for which a specific Customer competes
 */
app.route('/matchup/profile/:username/teams').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getTeams(req, res, pg, conString, log);
});

/* /matchup/profile/:username/requests
 * TODO Update API
 * [GET] Get all requests to create an organization that a specific Customer has sumbitted
 */
app.route('/matchup/profile/:username/requests').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getRequests(req, res, pg, conString, log);
});

/* /matchup/profile/:username/organizations
 *
 * [GET] Get the Organizations for which a specific Customer is a member
 */
app.route('/matchup/profile/:username/organizations').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getOrganizations(req, res, pg, conString, log);
});

/* /matchup/profile/:username/events
 *
 * [GET] Get the events a specific Customer has created
 */
app.route('/matchup/profile/:username/events').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getEvents(req, res, pg, conString, log);
});

/* /matchup/profile/:username/events/registered?type=string
 *
 * params:
 * 	type = The type of attendee you were/are at en event. Possible values: [spectator, competitor]
 *
 * [GET] Get the events where a specific Customer has registered has spectator or competitor
 */
app.route('/matchup/profile/:username/events/registered').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	customers.getRegisteredEvents(req, res, pg, conString, log);
});

//*\\\\\\\\\\* SEARCH *//////////*/
/* /matchup/search/:parameter
 *
 * [GET] Search the system
 * 		The search will give results for:
 * 			events (live, past, upcoming)
 * 			Customers
 * 			Teams
 * 			Organizations
 * 			Games
 * 			Genres
 */
app.get('/matchup/search/:parameter', function(req, res) {
	log.info({
		req : req
	}, 'start request');
	search.getSearchResults(req, res, pg, conString, log);
});

/* /matchup/search/users/:parameter
 *
 * [GET] Search the system for a specific user
 */
app.get('/matchup/search/users/:parameter', function(req, res) {
    log.info({
        req : req
    }, 'start request');
    search.searchUsers(req, res, pg, conString, log);
});

/* /matchup/search/games/:parameter
 *
 * [GET] Search the system for a specific game
 */
app.get('/matchup/search/games/:parameter', function(req, res) {
    log.info({
        req : req
    }, 'start request');
    search.searchGames(req, res, pg, conString, log);
});

//*\\\\\\\\\\* TEAMS *//////////*/
/* /matchup/teams
 *
 * [GET] Get all registered Teams
 * [POST] Create a new Team
 */
app.route('/matchup/teams').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	teams.getTeams(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	// if (!req.body.name || !req.body.logo || !req.body.bio || !req.body.cover) {
	// res.status(400).json({
	// error : "Incomplete or invalid parameters"
	// });
	// log.info({
	// res : res
	// }, 'done response');
	// } else {
	customers.createTeam(req, res, pg, conString, log);
	// }
});

/* /matchup/teams/:team
 *
 * [GET] Get the details of a specific Team
 * [PUT] Edit the details of a specific Team
 * [DELETE] Delete your Team
 */
app.route('/matchup/teams/:team').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	teams.getTeam(req, res, pg, conString, log);
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	teams.editTeam(req, res, pg, conString, log);
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	teams.deleteTeam(req, res, pg, conString, log);
});

/* /matchup/teams/:team/members?username=string
 *
 * [GET] Get the members of a specific Team
 * [POST] Add a new member to your Team
 * [PUT] Pass the title of captain to a member of your Team
 * [DELETE] Remove a member of your Team
 */
app.route('/matchup/teams/:team/members').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	teams.getTeamMembers(req, res, pg, conString, log);
}).post(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	// if (!req.query.username) {
	// res.status(400).json({
	// error : "Incomplete or invalid parameters"
	// });
	// log.info({
	// res : res
	// }, 'done response');
	// } else {
	teams.addTeamMember(req, res, pg, conString, log);
	// }
}).put(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	// if (!req.query.username) {
	// res.status(400).json({
	// error : "Incomplete or invalid parameters"
	// });
	// log.info({
	// res : res
	// }, 'done response');
	// } else {
	teams.makeCaptain(req, res, pg, conString, log);
	// }
}).delete(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	// if (!req.query.username) {
	// res.status(400).json({
	// error : "Incomplete or invalid parameters"
	// });
	// log.info({
	// res : res
	// }, 'done response');
	// } else {
	teams.removeTeamMember(req, res, pg, conString, log);
	// }
});

/* /matchup/teams/:team/standings
 *
 * [GET] Get the subscriptions of a specific Customer
 */
app.route('/matchup/teams/:team/standings').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	teams.getStandings(req, res, pg, conString, log);
});

/* /matchup/teams/:team/standings
 *
 * [GET] Get the subscriptions of a specific Customer
 */
app.route('/matchup/distributions').get(function(req, res) {
	log.info({
		req : req
	}, 'start request');
	tournaments.getPrizeDistributions(req, res, pg, conString, log);
});

///////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port " + port);
});
https.createServer({
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
}, app).listen(8443);