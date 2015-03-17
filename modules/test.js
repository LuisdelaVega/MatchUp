var createBraket = function(req, res) {
	var bracket = new Object();
	bracket.numOfPlayers = req.params.numofplayers;
	bracket.byes = getByes(bracket.numOfPlayers);
	bracket.numOfWinnerRounds = 0;

	var players = new Array();
	var i = 0;
	for ( i = 0; i < bracket.numOfPlayers; i++) {
		players[i] = new Object();
		players[i].seed = i + 1;
	}

	if (req.params.type == 'single') {
		bracket.winnerRounds = new Array();
		singleEliminationBracket(bracket, players);
	} else if (req.params.type == 'double') {
		bracket.winnerRounds = new Array();
		singleEliminationBracket(bracket, players);
		bracket.numOfLoserRounds = 0;
		bracket.loserRounds = new Array();
		doubleEliminationBracket(bracket);
	} else {
		return res.status(401);
	}

	res.send(bracket);
};

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

function singleEliminationBracket(bracket, players) {
	// calculate winner rounds matches
	var winnerRounds = new Array();
	var i = 0;
	var winners = bracket.numOfPlayers;
	for ( i = 0; winners > 1; i++) {
		winnerRounds[i] = new Object();
		winnerRounds[i].name = "Winners Round " + (i + 1);
		//console.log(winnerRounds[i].name);
		winnerRounds[i].amountOfMatches = getWinnersRoundMatches(winners);
		//console.log("Amount of matches: " + winnerRounds[i].amountOfMatches);
		bracket.numOfWinnerRounds++;

		winners = getNumOfPlayersForNextWinnersRound(winners);
	}

	//console.log(bracket.numOfPlayers);

	//Create the Matches for every Round
	for ( i = 0; i < bracket.numOfWinnerRounds; i++) {
		winnerRounds[i].matches = new Array();
		for ( j = 0; j < winnerRounds[i].amountOfMatches; j++) {
			winnerRounds[i].matches[j] = new Object();
			winnerRounds[i].matches[j].name = "Winners Round " + (i + 1) + " Match " + (j + 1);
		}
	}

	// Assign players for Winners Round 1 Matches
	for ( i = 0; i < (bracket.numOfPlayers - bracket.byes) / 2; i++) {
		winnerRounds[0].matches[i].player1 = players[bracket.byes + i/* - 1*/];
		winnerRounds[0].matches[i].player2 = players[bracket.numOfPlayers - i - 1];
		//console.log(winnerRounds[0].name+", match: "+i+", player1: "+winnerRounds[0].matches[i].player1.seed+", player2: "+winnerRounds[0].matches[i].player2.seed);
	}

	if (bracket.byes) {
		// Assign players to Winners Round 2 matches
		var count = 0;
		for ( i = 0; i < bracket.byes; i++) {
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
				winnerRounds[0].matches[i].winnerGoesTo = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].name;
			} else {
				winnerRounds[0].matches[i].winnerGoesTo = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].name;
			}
		}
	}

	// Create the Linked List
	// Winner rounds - Winner goes to
	if (bracket.byes) {
		i = 1;
	} else {
		i = 0;
	}
	var count = 0;
	for (; i < (bracket.numOfWinnerRounds - 1); i++) {
		count = 0;
		for ( j = 0; j < winnerRounds[i].amountOfMatches; j++) {
			if (j < winnerRounds[i + 1].amountOfMatches) {
				winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j].name;
			} else {
				count++;
				winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j - count].name;
				count++;
			}
		}
	}

	for ( i = 0; i < bracket.numOfWinnerRounds; i++) {
		bracket.winnerRounds[i] = winnerRounds[i];
	}
}

function doubleEliminationBracket(bracket) {
	// Add the final Round to the Winner bracket
	bracket.winnerRounds[bracket.numOfWinnerRounds] = new Object();
	bracket.winnerRounds[bracket.numOfWinnerRounds].name = "Winners Round " + (bracket.numOfWinnerRounds + 1);
	bracket.winnerRounds[bracket.numOfWinnerRounds].amountOfMatches = 1;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches = new Array();
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0] = new Object();
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].name = "Winners Round " + (bracket.numOfWinnerRounds + 1) + " Match 1";
	bracket.numOfWinnerRounds++;

	var loserRounds = new Array();
	loserRounds[0] = new Object();
	loserRounds[0].name = "Losers Round 1";
	//console.log(loserRounds[0].name);
	loserRounds[0].amountOfMatches = getLosersRound1Matches(bracket.numOfPlayers);
	//console.log("Amount of matches: " + loserRounds[0].amountOfMatches);
	bracket.numOfLoserRounds++;

	// Calculate loser rounds matches
	i = 0;
	if (bracket.winnerRounds[0].amountOfMatches > bracket.winnerRounds[1].amountOfMatches) {
		loserRounds[1] = new Object();
		loserRounds[1].name = "Losers Round 2";
		//console.log(loserRounds[1].name);
		loserRounds[1].amountOfMatches = bracket.winnerRounds[1].amountOfMatches;
		//console.log("Amount of matches: " + loserRounds[1].amountOfMatches);
		bracket.numOfLoserRounds++;
		i = 1;
	}
	var j = 1;
	var count = 0;
	do {
		i++;
		loserRounds[i] = new Object();
		loserRounds[i].name = "Losers Round " + (i + 1);
		//console.log(loserRounds[i].name);
		loserRounds[i].amountOfMatches = (bracket.winnerRounds[j].amountOfMatches) / 2;
		//console.log("Amount of matches: " + loserRounds[i].amountOfMatches);
		bracket.numOfLoserRounds++;
		count++;
		if (!(count % 2)) {
			j++;
		}
	} while(loserRounds[i].amountOfMatches > 1);
	i++;
	loserRounds[i] = new Object();
	loserRounds[i].name = "Losers Round " + (i + 1);
	//console.log(loserRounds[i].name);
	loserRounds[i].amountOfMatches = 1;
	//console.log("Amount of matches: " + loserRounds[i].amountOfMatches);
	bracket.numOfLoserRounds++;

	// Create the Matches for the Loser Rounds
	for ( i = 0; i < bracket.numOfLoserRounds; i++) {
		loserRounds[i].matches = new Array();
		for ( j = 0; j < loserRounds[i].amountOfMatches; j++) {
			loserRounds[i].matches[j] = new Object();
			loserRounds[i].matches[j].name = "Losers Round " + (i + 1) + " Match " + (j + 1);
			//console.log(loserRounds[i].matches[j].name);
		}
	}
	// Go ahead and set the 'winner goes to' Match here, since its the last round of the losers bracket, the winner always goes to the final
	loserRounds[i-1].matches[0].winnerGoesTo = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].name;

	if (bracket.byes) {
		// Create the Linked Lists
		// Losers Round 1 - Winner goes to
		for ( i = 0; i < loserRounds[0].amountOfMatches; i++) {
			if (i < (loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches)) {
				loserRounds[0].matches[i].winnerGoesTo = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].name;
			} else {
				loserRounds[0].matches[i].winnerGoesTo = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].name;
			}
		}

		// Winners Round 1 & 2 - Loser goes to
		if (bracket.winnerRounds[0].amountOfMatches > loserRounds[0].amountOfMatches) {
			for ( i = 0; i < bracket.winnerRounds[0].amountOfMatches; i++) {
				if (i < (bracket.winnerRounds[0].amountOfMatches - bracket.winnerRounds[1].amountOfMatches)) {
					bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[i].name;
				} else if (i < ((bracket.winnerRounds[0].amountOfMatches - bracket.winnerRounds[1].amountOfMatches) * 2)) {
					bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].name;
				} else {
					bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].name;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].name;
				}
			}
			for ( i = 0; i < (bracket.winnerRounds[0].amountOfMatches - bracket.winnerRounds[1].amountOfMatches); i++) {
				bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i].name;
			}
		} else {
			for ( i = 0; i < bracket.winnerRounds[0].amountOfMatches; i++) {
				bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].name;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].name;
			}
			for ( i = 0; i < (bracket.winnerRounds[1].amountOfMatches - bracket.winnerRounds[0].amountOfMatches); i++) {
				// bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i].name;
				if (i < loserRounds[1].amountOfMatches) {
					bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i].name;
				} else {
					bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].name;
				}
			}
		}
	}

	// Create the Linked Lists
	// Winner rounds - Loser goes to
	if (bracket.byes/* && bracket.winnerRounds[0].amountOfMatches > loserRounds[0].amountOfMatches*/) {
		i = 2;
	} else {
		i = 0;
	}
	var temp = i;
	for (; i < (bracket.numOfWinnerRounds - 1); i++) {
		count = 0;
		for ( j = 0; j < bracket.winnerRounds[i].amountOfMatches; j++) {
			if (!i) {
				if (j < loserRounds[i].amountOfMatches) {
					bracket.winnerRounds[i].matches[j].loserGoesTo = loserRounds[i].matches[j].name;
				} else {
					count++;
					bracket.winnerRounds[i].matches[j].loserGoesTo = loserRounds[i].matches[j - count].name;
					count++;
				}
			} else/*if (temp > bracket.numOfLoserRounds)*/
			{
				// Check if by putting this condition you didn't fuck shit up by fixing the stupid error
				if (loserRounds[temp].amountOfMatches < loserRounds[temp - 1].amountOfMatches) {
					temp++;
				}
				//console.log(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches));
				bracket.winnerRounds[i].matches[j].loserGoesTo = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].name;
			}
		}
		temp++;
	}

	// Loser rounds - Winner goes to
	if (bracket.byes) {
		i = 1;
	} else {
		i = 0;
	}
	var count = 0;
	for (; i < (bracket.numOfLoserRounds - 1); i++) {
		count = 0;
		for ( j = 0; j < loserRounds[i].amountOfMatches; j++) {
			if (loserRounds[i].amountOfMatches > loserRounds[i + 1].amountOfMatches) {
				if (j < loserRounds[i + 1].amountOfMatches) {
					loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j].name;
				} else {
					count++;
					loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j - count].name;
					count++;
				}
			} else {
				loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j].name;
			}
		}
	}

	for ( i = 0; i < bracket.numOfLoserRounds; i++) {
		bracket.loserRounds[i] = loserRounds[i];
	}
}

module.exports.createBraket = createBraket;