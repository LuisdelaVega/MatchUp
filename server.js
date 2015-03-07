/**
 * @author PapaLuisre hello
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// Needed to handle JSON posts
app.use(bodyParser.json());

// Cookie parsing needed for sessions
app.use(cookieParser('notsosecretkey'));

// Session framework
app.use(session({secret: 'notsosecretkey123'}));

// Consider all URLs under /public/ as static files, and return them raw.
app.use(express.static(__dirname + '/public'));

/////////////////////////////////////////////////////////////////////////////////////////// HANDLERS 
function getName(req, res) {
  if (req.session.name) {
    return res.json({ name: req.session.name });
  }
  else {
    return res.json({ name: '' });
  }
}

function setName(req, res) {
  if(!req.body.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send(req.body.name);
  }
  else {
    req.session.name = req.body.name;
    return res.json({ name: req.body.name });
  }
}

function logout(req, res) {
  req.session.destroy(function(err){
	if(err){
		res.statusCode = 500;
    	return res.send(req.body.name);
	}
	else
	{
		res.redirect('/');
	}
	});
}

function createTournament(req, res){
	var tournament = new Object();
	var tournamentFilter = new Array();
	
	tournament.numOfPlayers = req.params.numofplayers;
	tournament.byes = getByes(tournament.numOfPlayers);
	tournament.winnerRounds = new Array();	//array of round objects
	tournament.loserRounds = new Array();	//array of round objects
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

///////////////////////////////////////////////////////////////////////////////////////////// SESSION TEST ROUTES 

app.get('/name', getName);
app.post('/name', setName);
app.get('/logout', logout);

///////////////////////////////////////////////////////////////////////////////////////////// ROUTES
app.get('/test/:numofplayers', createTournament);

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
	winnerRounds[i].name = "Winners Round " + (i+1);
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
		loserRounds[i].name = "Losers Round " + (i+1);
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
	for(i = 0; i < tournament.numOfWinnerRounds; i++){
		winnerRounds[i].matches = new Array();
		for(j = 0; j < winnerRounds[i].amountOfMatches; j++){
			winnerRounds[i].matches[j] = new Object();
			winnerRounds[i].matches[j].name = "Winners Round "+(i+1)+" Match " + (j+1);
		}
	}
	for(i = 0; i < tournament.numOfLoserRounds; i++){
		loserRounds[i].matches = new Array();
		for(j = 0; j < loserRounds[i].amountOfMatches; j++){
			loserRounds[i].matches[j] = new Object();
			loserRounds[i].matches[j].name = "Losers Round "+(i+1)+" Match " + (j+1);
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
		var count =  0;
		for ( i = 0; i < tournament.byes; i++) {
			if (i < winnerRounds[1].amountOfMatches) {
				winnerRounds[1].matches[i].player1 = players[i];
				//console.log(winnerRounds[1].name+", match: "+i+", player1: "+winnerRounds[1].matches[i].player1.seed);
			} else {
				count++;
				winnerRounds[1].matches[i-count].player2 = players[i];
				//console.log(winnerRounds[1].name+", match: "+(i-count)+", player1: "+winnerRounds[1].matches[i-count].player1.seed+", player2: "+winnerRounds[1].matches[i-count].player2.seed);
				count++;
			}
		}
		
		// Create the Linked List
		for(i = 0; i < winnerRounds[0].amountOfMatches; i++){
			winnerRounds[0].matches[i].winnerGoesTo = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1];
		}
		i = 1;
	}
	
	// Create the Linked List
	var count =  0;
	for(; i < (tournament.numOfWinnerRounds - 1); i++){
		count = 0;
		for(j = 0; j < winnerRounds[i].amountOfMatches; j++){
			if (j < winnerRounds[i+1].amountOfMatches) {
				winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j];
			} else {
				count++;
				winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j-count];
				count++;
			}
		}
	}
	
	for(i = 0; i < tournament.numOfWinnerRounds; i++) {
		tournament.winnerRounds[i] = winnerRounds[i];
	}
	for(i = 0; i < tournament.numOfLoserRounds; i++){
		tournament.loserRounds[i] = loserRounds[i];
	}
}

////////////////////////////////////////////////////////////////////////////////////// SERVER LISTEN
var port = process.env.PORT || 5000;
app.listen(port, function () { console.log("Listening on port " + port); });

