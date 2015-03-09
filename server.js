/**
 * @author PapaLuisre
 */

var express = require('express');
var cors = require('cors');
var jwt = require('jsonwebtoken');
//https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt');
//https://npmjs.org/package/express-jwt
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var session = require('express-session');

var basicAuth = require('basic-auth');

var secret = '7h1s h6Re i5 th6 p6rf6c7 plac6 t0 m4kE 4 Nyx A5s4s51n j0k6!';

var app = express();

// We are going to protect /api routes with JWT
app.use('/matchup', expressJwt({
	secret : secret
}));

// Needed to handle JSON posts
app.use(bodyParser.json());

// Cookie parsing needed for sessions
// app.use(cookieParser('notsosecretkey'));

// Session framework
// app.use(session({
// secret : 'notsosecretkey123'
// }));

app.use(function(err, req, res, next) {
	if (err.constructor.name === 'UnauthorizedError') {
		res.status(401).send('Unauthorized');
	}
});

// Allow Cross-origin resourse sharing
app.use(cors());

// Consider all URLs under /public/ as static files, and return them raw.
app.use(express.static(__dirname + '/token'));

/////////////////////////////////////////////////////////////////////////////////////////// HANDLERS
function getName(req, res) {
	if (req.session.name) {
		return res.json({
			name : req.session.name
		});
	} else {
		return res.json({
			name : ''
		});
	}
}

function setName(req, res) {
	if (!req.body.hasOwnProperty('name')) {
		res.statusCode = 400;
		return res.send(req.body.name);
	} else {
		req.session.name = req.body.name;
		return res.json({
			name : req.body.name
		});
	}
}

function logout(req, res) {
	req.session.destroy(function(err) {
		if (err) {
			res.statusCode = 500;
			return res.send(req.body.name);
		} else {
			res.redirect('/');
		}
	});
}

function createTournament(req, res) {
	var tournament = new Object();
	var tournamentFilter = new Array();

	tournament.numOfPlayers = req.params.numofplayers;
	tournament.byes = getByes(tournament.numOfPlayers);
	tournament.winnerRounds = new Array();
	//array of round objects
	tournament.loserRounds = new Array();
	//array of round objects
	tournament.numOfWinnerRounds = 0;
	tournament.numOfLoserRounds = 0;

	var players = new Array();
	var i = 0;
	for ( i = 0; i < tournament.numOfPlayers; i++) {
		players[i] = new Object();
		players[i].seed = i + 1;
	}

	generateBracket(tournament, players);

	return res.send(tournament);
}

//TODO Delete this
// function authenticate(req, res) {
// //if is invalid, return 401
// if (!(req.body.username === 'edwin' && req.body.password === 'badillo')) {
// res.send(401, 'Wrong user or password');
// return;
// }
//
// var profile = {
// first_name : 'Edwin',
// last_name : 'Badillo',
// email : 'edwin@badillo.com',
// id : 123
// };
//
// // We are sending the profile inside the token
// var token = jwt.sign(profile, secret/*
// , {
// expiresInMinutes : 60 * 5
// }*/
// );
//
// res.json({
// token : token
// });
// }

function restricted(req, res) {
	console.log('user ' + req.user.email + ' is calling /api/restricted');
	res.json({
		first_name : req.user.first_name,
		last_name : req.user.last_name,
		email : req.user.email,
		id : req.user.id
	});
}

function auth(req, res) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.send(401);
	};

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	//TODO validate user.name and user.pass with the DB
	// Query the DB to find the account
	if (user.name === 'foo' && user.pass === 'bar') {
		// Create the token
		var profile = {
			first_name : user.name,
			last_name : user.pass,
			email : 'edwin@badillo.com',
			id : 123
		};

		// We are sending the profile inside the token
		var token = jwt.sign(profile, secret);

		res.json({
			token : token
		});
	} else {
		return unauthorized(res);
	};
};

///////////////////////////////////////////////////////////////////////////////////////////// TOKEN TEST ROUTES
// app.post('/authenticate', authenticate);

///////////////////////////////////////////////////////////////////////////////////////////// SESSION TEST ROUTES
app.get('/name', getName);
app.post('/name', setName);
app.get('/logout', logout);

///////////////////////////////////////////////////////////////////////////////////////////// ROUTES
app.get('/test/:numofplayers', createTournament);
app.post('/login', auth);
app.get('/matchup/profile', restricted);

///////////////////////////////////////////////////////////////////////////////////////////// OTHER FUNCTIONS
function getNextPowerOf2(numOfPlayers) {
	return Math.ceil(Math.log(numOfPlayers) / Math.log(2));
}

function getByes(numOfPlayers) {
	return Math.pow(2, Math.ceil(Math.log(numOfPlayers) / Math.log(2))) - numOfPlayers;
}

function getWinnersRoundMatches(numOfPlayers) {
	return (numOfPlayers - getByes(numOfPlayers)) / 2;
}

function getNumOfPlayersForNextWinnersRound(numOfPlayers) {
	return (getWinnersRoundMatches(Math.pow(2, getNextPowerOf2(numOfPlayers))));
}

function getNumOfPlayersForNextLosersRound(numOfPlayers) {
	return (getLosersRound1Matches(Math.pow(2, getNextPowerOf2(numOfPlayers))));
}

function getLosersRound1Matches(numOfPlayers) {
	var result = getWinnersRoundMatches(numOfPlayers) % (getNumOfPlayersForNextWinnersRound(numOfPlayers) / 2);
	if (!result) {
		return getNumOfPlayersForNextWinnersRound(numOfPlayers) / 2;
	}
	return getWinnersRoundMatches(numOfPlayers) % (getNumOfPlayersForNextWinnersRound(numOfPlayers) / 2);
}

function generateBracket(tournament, players) {
	// calculate winner rounds matches
	var winnerRounds = new Array();
	var i = 0;
	var winners = tournament.numOfPlayers;
	for ( i = 0; winners > 1; i++) {
		winnerRounds[i] = new Object();
		winnerRounds[i].name = "Winners Round " + (i + 1);
		//console.log(winnerRounds[i].name);
		winnerRounds[i].amountOfMatches = getWinnersRoundMatches(winners);
		//console.log("Amount of matches: " + winnerRounds[i].amountOfMatches);
		tournament.numOfWinnerRounds++;

		winners = getNumOfPlayersForNextWinnersRound(winners);
	}
	winnerRounds[i] = new Object();
	winnerRounds[i].name = "Winners Round " + (i + 1);
	//console.log(winnerRounds[i].name);
	winnerRounds[i].amountOfMatches = 1;
	//console.log("Amount of matches: " + winnerRounds[i].amountOfMatches);
	tournament.numOfWinnerRounds++;

	//console.log(tournament.numOfPlayers);

	var loserRounds = new Array();
	loserRounds[0] = new Object();
	loserRounds[0].name = "Losers Round 1";
	//console.log(loserRounds[0].name);
	loserRounds[0].amountOfMatches = getLosersRound1Matches(tournament.numOfPlayers);
	//console.log("Amount of matches: "+loserRounds[0].amountOfMatches);
	tournament.numOfLoserRounds++;

	// Calculate loser rounds matches
	i = 0;
	if (winnerRounds[0].amountOfMatches > winnerRounds[1].amountOfMatches) {
		loserRounds[1] = new Object();
		loserRounds[1].name = "Losers Round 2";
		//console.log(loserRounds[1].name);
		loserRounds[1].amountOfMatches = winnerRounds[1].amountOfMatches;
		//console.log("Amount of matches: "+loserRounds[1].amountOfMatches);
		tournament.numOfLoserRounds++;
		i = 1;
	}
	var j = 1;
	var count = 0;
	do {
		i++;
		loserRounds[i] = new Object();
		loserRounds[i].name = "Losers Round " + (i + 1);
		//console.log(loserRounds[i].name);
		loserRounds[i].amountOfMatches = (winnerRounds[j].amountOfMatches) / 2;
		//console.log("Amount of matches: "+loserRounds[i].amountOfMatches);
		tournament.numOfLoserRounds++;
		count++;
		if (!(count % 2)) {
			j++;
		}
	} while(loserRounds[i].amountOfMatches > 1);
	loserRounds[i + 1] = new Object();
	loserRounds[i + 1].name = "Losers Round " + (i + 1 + 1);
	//console.log(loserRounds[i + 1].name);
	loserRounds[i + 1].amountOfMatches = 1;
	//console.log("Amount of matches: "+loserRounds[i+1].amountOfMatches);
	tournament.numOfLoserRounds++;

	//Create matches of rounds
	for ( i = 0; i < tournament.numOfWinnerRounds; i++) {
		winnerRounds[i].matches = new Array();
		for ( j = 0; j < winnerRounds[i].amountOfMatches; j++) {
			winnerRounds[i].matches[j] = new Object();
			winnerRounds[i].matches[j].name = "Winners Round " + (i + 1) + " Match " + (j + 1);
		}
	}
	for ( i = 0; i < tournament.numOfLoserRounds; i++) {
		loserRounds[i].matches = new Array();
		for ( j = 0; j < loserRounds[i].amountOfMatches; j++) {
			loserRounds[i].matches[j] = new Object();
			loserRounds[i].matches[j].name = "Losers Round " + (i + 1) + " Match " + (j + 1);
		}
	}

	// Assign players for winners Round 1 matches
	for ( i = 0; i < (tournament.numOfPlayers - tournament.byes) / 2; i++) {
		winnerRounds[0].matches[i].player1 = players[tournament.byes + i/* - 1*/];
		winnerRounds[0].matches[i].player2 = players[tournament.numOfPlayers - i - 1];
		//console.log(winnerRounds[0].name+", match: "+i+", player1: "+winnerRounds[0].matches[i].player1.seed+", player2: "+winnerRounds[0].matches[i].player2.seed);
	}
	i = 0;
	if (tournament.byes) {
		// Assign players to winners Round 2 matches
		var count = 0;
		for ( i = 0; i < tournament.byes; i++) {
			if (i < winnerRounds[1].amountOfMatches) {
				winnerRounds[1].matches[i].player1 = players[i];
				//console.log(winnerRounds[1].name+", match: "+i+", player1: "+winnerRounds[1].matches[i].player1.seed);
			} else {
				count++;
				winnerRounds[1].matches[i - count].player2 = players[i];
				//console.log(winnerRounds[1].name+", match: "+(i-count)+", player1: "+winnerRounds[1].matches[i-count].player1.seed+", player2: "+winnerRounds[1].matches[i-count].player2.seed);
				count++;
			}
		}

		// Create the Linked List
		// Winners Round 1 - Winner goes to
		for ( i = 0; i < winnerRounds[0].amountOfMatches; i++) {
			if (i < (winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches)) {
				winnerRounds[0].matches[i].winnerGoesTo = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)];
			} else {
				winnerRounds[0].matches[i].winnerGoesTo = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1];
			}
		}
		// Losers Round 1 - Winner goes to
		for ( i = 0; i < loserRounds[0].amountOfMatches; i++) {
			if (i < (loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches)) {
				loserRounds[0].matches[i].winnerGoesTo = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)];
			} else {
				loserRounds[0].matches[i].winnerGoesTo = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1];
			}
		}
		// Winners Round 1 & 2 - Loser goes to
		var temp = i;
		if (winnerRounds[0].amountOfMatches > loserRounds[0].amountOfMatches) {
			for ( i = 0; i < winnerRounds[0].amountOfMatches; i++) {
				if (i < (winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches)) {
					winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[i];
				} else if (i < ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)) {
					winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - i + 1];
				} else {
					winnerRounds[0].matches[i].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1];
					winnerRounds[1].matches[winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1];
				}
			}
			for ( i = 0; i < (winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches); i++) {
				winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i];
			}
		} else {
			for ( i = 0; i < winnerRounds[0].amountOfMatches; i++) {
				winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1];
				winnerRounds[1].matches[winnerRounds[1].amountOfMatches - i - 1].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1];
			}
			for ( i = 0; i < (winnerRounds[1].amountOfMatches - winnerRounds[0].amountOfMatches); i++) {
				winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i];
			}
		}
	}

	// Create the Linked List
	// Winner rounds - Winner goes to
	if (tournament.byes) {
		i = 1;
	} else {
		i = 0;
	}
	var count = 0;
	for (; i < (tournament.numOfWinnerRounds - 1); i++) {
		count = 0;
		for ( j = 0; j < winnerRounds[i].amountOfMatches; j++) {
			if (j < winnerRounds[i + 1].amountOfMatches) {
				winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j];
			} else {
				count++;
				winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j - count];
				count++;
			}
		}
	}

	// Winner rounds - Loser goes to
	if (tournament.byes && winnerRounds[0].amountOfMatches > loserRounds[0].amountOfMatches) {
		i = 2;
	} else {
		i = 0;
	}
	var temp = i;
	for (; i < (tournament.numOfWinnerRounds - 1); i++) {
		count = 0;
		for ( j = 0; j < winnerRounds[i].amountOfMatches; j++) {
			if (!i) {
				if (j < loserRounds[i].amountOfMatches) {
					winnerRounds[i].matches[j].loserGoesTo = loserRounds[i].matches[j];
				} else {
					count++;
					winnerRounds[i].matches[j].loserGoesTo = loserRounds[i].matches[j - count];
					count++;
				}
			} else {
				if (loserRounds[temp].amountOfMatches < loserRounds[temp - 1].amountOfMatches) {
					temp++;
				}
				winnerRounds[i].matches[j].loserGoesTo = loserRounds[temp].matches[((j + 2) % loserRounds[temp].amountOfMatches)];
			}
		}
		temp++;
	}

	// Loser rounds - Winner goes to
	if (tournament.byes) {
		i = 1;
	} else {
		i = 0;
	}
	var count = 0;
	for (; i < (tournament.numOfLoserRounds - 1); i++) {
		count = 0;
		for ( j = 0; j < loserRounds[i].amountOfMatches; j++) {
			if (loserRounds[i].amountOfMatches > loserRounds[i + 1].amountOfMatches) {
				if (j < loserRounds[i + 1].amountOfMatches) {
					loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j];
				} else {
					count++;
					loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j - count];
					count++;
				}
			} else {
				loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j];
			}
		}
	}
	loserRounds[tournament.numOfLoserRounds-1].matches[loserRounds[tournament.numOfLoserRounds - 1].amountOfMatches - 1].winnerGoesTo = winnerRounds[tournament.numOfWinnerRounds-1].matches[winnerRounds[tournament.numOfWinnerRounds - 1].amountOfMatches - 1];

	for ( i = 0; i < tournament.numOfWinnerRounds; i++) {
		tournament.winnerRounds[i] = winnerRounds[i];
	}
	for ( i = 0; i < tournament.numOfLoserRounds; i++) {
		tournament.loserRounds[i] = loserRounds[i];
	}
}

////////////////////////////////////////////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port " + port);
});
