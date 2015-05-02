function competes(res, client, done, log, competitor, match) {
	client.query({
		text : "INSERT INTO competes (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
		values : [match.event_name, match.event_start_date, match.event_location, match.tournament_name, match.round_number, match.round_of, match.match_number, competitor.competitor_number]
	}, function(err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("tournament.js - competes");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		}
	});
}

function is_set(res, client, done, log, match, set_seq) {
	client.query({
		text : "INSERT INTO is_set (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
		values : [match.event_name, match.event_start_date, match.event_location, match.tournament_name, match.round_number, match.round_of, match.match_number, set_seq]
	}, function(err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("tournament.js - is_set");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		}
	});
}

function competitor_goes_to(res, client, done, log, competitor_goes_to, is_winner) {
	client.query({
		text : "INSERT INTO competitor_goes_to (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_of, past_match, future_round_number, future_round_of, future_match, is_winner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
		values : [competitor_goes_to.event_name, competitor_goes_to.event_start_date, competitor_goes_to.event_location, competitor_goes_to.tournament_name, competitor_goes_to.past_round_number, competitor_goes_to.past_round_of, competitor_goes_to.past_match, competitor_goes_to.future_round_number, competitor_goes_to.future_round_of, competitor_goes_to.future_match, is_winner]
	}, function(err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("tournament.js - competitor_goes_to");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		}
	});
}

function addMatch(res, client, done, log, match, round_best_of) {
	client.query({
		text : "INSERT INTO match (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, is_favourite, match_completed) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
		values : [match.event_name, match.event_start_date, match.event_location, match.tournament_name, match.round_number, match.round_of, match.match_number, match.is_favourite, match.match_completed]
	}, function(err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - addMatch");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		} else {
			// Sets
			for (var i = 0; i < round_best_of; i++) {
				is_set(res, client, done, log, match, (i + 1));
			}
			// competes
			for (var i = 0; i < match.players.length; i++) {
				competes(res, client, done, log, match.players[i], match);
			}
			// is_played_in
			if (match.is_played_in) {
				client.query({
					text : "INSERT INTO is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
					values : [match.event_name, match.event_start_date, match.event_location, match.tournament_name, match.round_number, match.round_of, match.match_number, match.is_played_in]
				}, function(err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						console.log("tournament.js - is_played_in");
						console.log(err);
						res.status(500).send(err);
						log.info({
							res : res
						}, 'done response');
					}
				});
			}
			if (match.winnerGoesTo) {
				competitor_goes_to(res, client, done, log, match.winnerGoesTo, true);
			}
			if (match.loserGoesTo) {
				competitor_goes_to(res, client, done, log, match.loserGoesTo, false);
			}
		}
	});
}

function addRound(res, client, done, log, round) {
	client.query({
		text : "INSERT INTO round (event_name, event_start_date, event_location, tournament_name, round_number, round_of, round_start_date, round_pause, round_completed, round_best_of) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
		values : [round.event_name, round.event_start_date, round.event_location, round.tournament_name, round.round_number, round.round_of, round.round_start_date, round.round_pause, round.round_completed, round.round_best_of]
	}, function(err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - addRound");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		}
	});
}

function addCompetitorToGroup(res, client, done, log, group, competitor) {
	client.query({
		text : "INSERT INTO is_in (event_name, event_start_date, event_location, tournament_name, group_number, competitor_number) VALUES($1, $2, $3, $4, $5, $6)",
		values : [group.event_name, group.event_start_date, group.event_location, group.tournament_name, group.group_number, competitor.competitor_number]
	}, function(err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - addCompetitorToGroup");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		}
	});
}

function attachGroupToMatch(res, client, done, log, match, group_number) {
	client.query({
		text : "INSERT INTO has_a (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, group_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
		values : [match.event_name, match.event_start_date, match.event_location, match.tournament_name, match.round_number, match.round_of, match.match_number, group_number]
	}, function(err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - attachGroupToMatch");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		}
	});
}

function createGroup(res, client, done, log, group) {
	console.log(group.event_name, group.event_start_date, group.event_location, group.tournament_name, group.group_number);
	client.query({
		text : 'INSERT INTO "group" (event_name, event_start_date, event_location, tournament_name, group_number) VALUES($1, $2, $3, $4, $5)',
		values : [group.event_name, group.event_start_date, group.event_location, group.tournament_name, group.group_number]
	}, function(err, result) {
		if (err) {
			console.log(err);
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - createGroup");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res : res
			}, 'done response');
		} else {
			// Add the players of that group
			for (var i = 0; i < group.players.length; i++) {
				console.log(group.players[i]);
				addCompetitorToGroup(res, client, done, log, group, group.players[i]);
			}
			for (var i = 0; i < group.rounds.length; i++) {
				for (var j = 0; j < group.rounds[i].matches.length; j++) {
					attachGroupToMatch(res, client, done, log, group.rounds[i].matches[j], group.group_number);
				}
			}
		}
	});
}

var createTournament = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// And so it begins
		client.query("BEGIN");
		var query = client.query({
			text : "SELECT tournament_name, tournament_start_date, tournament_type, tournament_format, number_of_people_per_group, amount_of_winners_per_group FROM tournament WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND tournament_active",
			values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - createTournament");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				var tournament = result.rows[0];
				tournament.event_name = req.params.event;
				tournament.event_start_date = req.query.date;
				tournament.event_location = req.query.location;

				// Get the competitors sorted by seed (i.e., The top seeded player would be at the first index with a seed value of 1)
				var query = client.query({
					text : "SELECT distinct competitor.competitor_number, competitor.competitor_seed FROM tournament LEFT OUTER JOIN is_a ON is_a.event_name = tournament.event_name AND is_a.event_start_date = tournament.event_start_date AND is_a.event_location = tournament.event_location AND is_a.tournament_name = tournament.tournament_name LEFT OUTER JOIN competes_for ON competes_for.event_name = tournament.event_name AND competes_for.event_start_date = tournament.event_start_date AND competes_for.event_location = tournament.event_location AND competes_for.tournament_name = tournament.tournament_name LEFT OUTER JOIN competitor ON tournament.event_name = competitor.event_name AND tournament.event_start_date = competitor.event_start_date AND tournament.event_location = competitor.event_location AND tournament.tournament_name = competitor.tournament_name AND (is_a.competitor_number = competitor.competitor_number OR competes_for.competitor_number = competitor.competitor_number) WHERE tournament.event_name = $1 AND tournament.event_start_date = $2 AND tournament.event_location = $3 AND tournament.tournament_name = $4 AND competitor.competitor_check_in ORDER BY competitor.competitor_seed",
					values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					client.query("ROLLBACK");
					done();
					console.log("torunament.js - createTournament");
					console.log(error);
					res.status(500).send(error);
					log.info({
						res : res
					}, 'done response');
				});
				query.on("end", function(result) {
					tournament.players = result.rows;
					var query = client.query({
						text : "SELECT * FROM station JOIN capacity_for ON station.event_name = capacity_for.event_name AND station.event_start_date = capacity_for.event_start_date AND station.event_location = capacity_for.event_location AND station.station_number = capacity_for.station_number WHERE station.event_name = $1 AND station.event_start_date = $2 AND station.event_location = $3 AND capacity_for.tournament_name = $4",
						values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
					});
					query.on("row", function(row, result) {
						result.addRow(row);
					});
					query.on('error', function(error) {
						client.query("ROLLBACK");
						done();
						console.log("torunament.js - createTournament");
						console.log(error);
						res.status(500).send(error);
						log.info({
							res : res
						}, 'done response');
					});
					query.on("end", function(result) {
						tournament.stations = result.rows;
						// console.log(tournament);
						var station = 0;
						if (tournament.tournament_type === "Two Stage") {
							tournament.groupStage = {};
							tournament.groupStage.numOfGroups = Math.ceil(tournament.players.length / tournament.number_of_people_per_group);

							generateGroupStage(tournament.groupStage, tournament.players, tournament, station, assignStationsForGroupStage, "Group");

							if (tournament.tournament_format === "Single Elimination" || tournament.tournament_format === "Double Elimination") {
								tournament.bracket = {};
								tournament.bracket.players = [];
								for (var i = 0, k = 0; i < tournament.groupStage.numOfGroups; i++) {
									for (var j = 0; j < tournament.groupStage.groups[i].numOfWinners; j++) {
										tournament.bracket.players[k] = new String("Winner #" + (j + 1) + " of Group " + (i + 1));
										k++;
									}
								}

								// console.log(tournament.bracket.players);
								tournament.bracket.numOfPlayers = tournament.bracket.players.length;
								if (tournament.bracket.numOfPlayers < 4) {
									client.query("ROLLBACK");
									done();
									res.status(403).send("The bracket must contain at least 4 players");
									log.info({
										res : res
									}, 'done response');
									return 0;
								}
								generateBracket(tournament.bracket, tournament.bracket.players, tournament, station, assignStationsForFinalStage);
							} else {
								tournament.group = {};
								tournament.group.players = [];
								for (var i = 0, k = 0; i < tournament.groupStage.numOfGroups; i++) {
									for (var j = 0; j < tournament.groupStage.groups[i].numOfWinners; j++) {
										tournament.group.players[k] = new String("Winner #" + (j + 1) + " of Group " + (i + 1));
										k++;
									}
								}
								tournament.group.playersPerGroup = tournament.group.players.length;
								generateGroupStage(tournament.group, tournament.group.players, tournament, station, assignStationsForFinalStage, "Round Robin");
							}
						} else {
							if (tournament.tournament_format === "Single Elimination" || tournament.tournament_format === "Double Elimination") {
								tournament.bracket = {};
								tournament.bracket.numOfPlayers = tournament.players.length;
								if (tournament.bracket.numOfPlayers < 4) {
									client.query("ROLLBACK");
									done();
									res.status(403).send("The bracket must contain at least 4 players");
									log.info({
										res : res
									}, 'done response');
									return 0;
								}
								generateBracket(tournament.bracket, tournament.players, tournament, station, assignStationsForFinalStage);
							} else {
								tournament.group = {};
								tournament.group.playersPerGroup = tournament.players.length;
								generateGroupStage(tournament.group, tournament.players, tournament, station, assignStationsForFinalStage, "Round Robin");
							}
						}

						// Now we have everything needed to create the stages of a tournament in the database
						/*
						 * Perform the same check as before to handle node being an asynchronous a-hole.
						 * Since we need to perform various functions that also involve more than one query we need to be carefull and do things in order.
						 */
						// Just to be sure
						var flag = false;
						if (tournament.tournament_type === "Two Stage") {
							// Create the groups and connect the competitors with them
							for (var i = 0; i < tournament.groupStage.groups.length; i++) {
								createGroup(res, client, done, log, tournament.groupStage.groups[i]);
							}
							for (var i = 0; i < tournament.groupStage.groups[0].numOfRounds; i++) {
								addRound(res, client, done, log, tournament.groupStage.groups[0].rounds[i]);
								for (var j = 0; j < tournament.groupStage.groups.length; j++) {
									for (var k = 0; i < tournament.groupStage.groups[j].numOfRounds && k < tournament.groupStage.groups[j].rounds[i].matches.length; k++) {
										// Add the matches for the current round
										addMatch(res, client, done, log, tournament.groupStage.groups[j].rounds[i].matches[k], tournament.groupStage.groups[j].rounds[i].round_best_of);
									}
								}
							}
						}
						if (tournament.tournament_format === "Single Elimination" || tournament.tournament_format === "Double Elimination") {
							for (var i = 0; i < tournament.bracket.numOfWinnerRounds; i++) {
								addRound(res, client, done, log, tournament.bracket.winnerRounds[i]);
								for (var j = 0; j < tournament.bracket.winnerRounds[i].amountOfMatches; j++) {
									addMatch(res, client, done, log, tournament.bracket.winnerRounds[i].matches[j], tournament.bracket.winnerRounds[i].round_best_of);
								}
							}
							if (tournament.tournament_format === "Double Elimination") {
								for (var i = 0; i < tournament.bracket.numOfLoserRounds; i++) {
									addRound(res, client, done, log, tournament.bracket.loserRounds[i]);
									for (var j = 0; j < tournament.bracket.loserRounds[i].amountOfMatches; j++) {
										addMatch(res, client, done, log, tournament.bracket.loserRounds[i].matches[j], tournament.bracket.loserRounds[i].round_best_of);
									}
								}
							}
							flag = true;
						} else {
							createGroup(res, client, done, log, tournament.group.groups[0]);
							for (var i = 0; i < tournament.group.groups[0].numOfRounds; i++) {
								addRound(res, client, done, log, tournament.group.groups[0].rounds[i]);
								for (var k = 0; i < tournament.group.groups[0].numOfRounds && k < tournament.group.groups[0].rounds[i].matches.length; k++) {
									// Add the matches for the current round
									addMatch(res, client, done, log, tournament.group.groups[0].rounds[i].matches[k], tournament.group.groups[0].rounds[i].round_best_of);
								}
							}
							flag = true;
						}

						if (flag) {
							client.query("COMMIT");
							done();
							res.status(201).send(tournament);
							log.info({
								res : res
							}, 'done response');
						}
					});
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

function assignStationsForGroupStage(tournament, station) {
	var iter = 0;
	for (var i = 0; i < tournament.groupStage.groups.length && station < tournament.stations.length; i++) {
		for (var j = 0; j < tournament.groupStage.groups[i].rounds.length && station < tournament.stations.length; j++) {
			iter += tournament.groupStage.groups[i].rounds[j].matches.length;
		}
	}

	var group = round = match = 0;
	for (var i = 0; i < iter && station < tournament.stations.length; i++) {

		if (match < tournament.groupStage.groups[group%tournament.groupStage.groups.length].rounds[round].matches.length) {
			tournament.groupStage.groups[group%tournament.groupStage.groups.length].rounds[round].matches[match].is_played_in = tournament.stations[station].station_number;
			tournament.stations[station++].station_in_use = true;
		}
		group = (++group % tournament.groupStage.groups.length);
		if (!(group % tournament.groupStage.groups.length)) {
			match++;
			if (match == tournament.groupStage.groups[group%tournament.groupStage.groups.length].rounds[round].matches.length) {
				match = 0;
				round++;
			}
		}
	}
}

function assignStationsForFinalStage(tournament, station) {
	if (tournament.tournament_format === "Single Elimination" || tournament.tournament_format === "Double Elimination") {
		if (station < tournament.stations.length) {
			if (tournament.tournament_format === "Single Elimination") {
				for (var i = 0; i < tournament.bracket.winnerRounds.length && station < tournament.stations.length; i++) {
					for (var j = 0; j < tournament.bracket.winnerRounds[i].matches.length && station < tournament.stations.length; j++) {
						tournament.bracket.winnerRounds[i].matches[j].is_played_in = tournament.stations[station].station_number;
						tournament.stations[station++].station_in_use = true;
					}
				}
			} else {
				for (var i = 0, k = 0; i < tournament.bracket.winnerRounds.length && k < tournament.bracket.loserRounds.length && station < tournament.stations.length; ) {
					if (i <= k) {
						for (var j = 0; j < tournament.bracket.winnerRounds[i].matches.length && station < tournament.stations.length; j++) {
							tournament.bracket.winnerRounds[i].matches[j].is_played_in = tournament.stations[station].station_number;
							tournament.stations[station++].station_in_use = true;
						}
						i++;
						continue;
					} else {
						for (var j = 0; j < tournament.bracket.loserRounds[k].matches.length && station < tournament.stations.length; j++) {
							tournament.bracket.loserRounds[k].matches[j].is_played_in = tournament.stations[station].station_number;
							tournament.stations[station++].station_in_use = true;
						}
						k++;
					}
				}
			}
		}
	} else {
		if (station < tournament.stations.length) {
			var iter = 0;
			for (var i = 0; i < tournament.group.groups.length && station < tournament.stations.length; i++) {
				for (var j = 0; j < tournament.group.groups[i].rounds.length && station < tournament.stations.length; j++) {
					iter += tournament.group.groups[i].rounds[j].matches.length;
				}
			}

			var group = round = match = 0;
			for (var i = 0; i < iter && station < tournament.stations.length; i++) {

				if (match < tournament.group.groups[group%tournament.group.groups.length].rounds[round].matches.length) {
					tournament.group.groups[group%tournament.group.groups.length].rounds[round].matches[match].is_played_in = tournament.stations[station].station_number;
					tournament.stations[station++].station_in_use = true;
				}
				group = (++group % tournament.group.groups.length);
				if (!(group % tournament.group.groups.length)) {
					match++;
					if (match == tournament.group.groups[group%tournament.group.groups.length].rounds[round].matches.length) {
						match = 0;
						round++;
					}
				}
			}
		}
	}
}

function generateGroupStage(groupStage, players, tournament, station, assignStations, round_of) {
	console.log("Number of groups in the Group Stage");
	groupStage.numOfGroups = Math.ceil(players.length / tournament.number_of_people_per_group);
	console.log(groupStage.numOfGroups);
	groupStage.groups = [];

	console.log("Creating the Groups for the Group Stage");
	// Create the Groups
	for (var k = 0; k < groupStage.numOfGroups; k++) {
		groupStage.groups[k] = {};
		// DB parameters
		groupStage.groups[k].event_name = tournament.event_name;
		groupStage.groups[k].event_start_date = tournament.event_start_date;
		groupStage.groups[k].event_location = tournament.event_location;
		groupStage.groups[k].tournament_name = tournament.tournament_name;
		groupStage.groups[k].group_number = (k + 1);
		groupStage.groups[k].players = [];
		// Assign the players to their respective Groups based on their seeding
		for (var i = k * tournament.number_of_people_per_group, count = 0; i < players.length && i < (k + 1) * tournament.number_of_people_per_group; i++, count++) {
			groupStage.groups[k].players[count] = players[i];
		}
		// Algorithm parameters
		groupStage.groups[k].numOfRounds = (!(groupStage.groups[k].players.length % 2)) ? (groupStage.groups[k].players.length - 1) : groupStage.groups[k].players.length;
		groupStage.groups[k].numOfMatchesPerRound = Math.floor(groupStage.groups[k].players.length / 2);
		groupStage.groups[k].numOfWinners = ((groupStage.groups[k].players.length < tournament.amount_of_winners_per_group) ? groupStage.groups[k].players.length : tournament.amount_of_winners_per_group);
		console.log(groupStage.groups[k]);
	}

	for (var i = 0; i < groupStage.numOfGroups; i++) {
		console.log("\nCreating the Rounds for Group " + groupStage.groups[i].group_number);
		groupStage.groups[i].rounds = [];
		// Create the Rounds and Matches that each group will play
		for (var j = 0; j < groupStage.groups[i].numOfRounds; j++) {
			groupStage.groups[i].rounds[j] = {};
			groupStage.groups[i].rounds[j].event_name = tournament.event_name;
			groupStage.groups[i].rounds[j].event_start_date = tournament.event_start_date;
			groupStage.groups[i].rounds[j].event_location = tournament.event_location;
			groupStage.groups[i].rounds[j].tournament_name = tournament.tournament_name;
			groupStage.groups[i].rounds[j].round_number = (j + 1);
			groupStage.groups[i].rounds[j].round_of = round_of;
			groupStage.groups[i].rounds[j].round_start_date = tournament.tournament_start_date;
			groupStage.groups[i].rounds[j].round_pause = true;
			groupStage.groups[i].rounds[j].round_completed = false;
			groupStage.groups[i].rounds[j].round_best_of = 3;
			groupStage.groups[i].rounds[j].matches = [];
			console.log("Created Round " + groupStage.groups[i].rounds[j].round_number);
			console.log("Creating the Matches for the Round");
			for (var k = 0; k < groupStage.groups[i].numOfMatchesPerRound; k++) {
				groupStage.groups[i].rounds[j].matches[k] = {};
				groupStage.groups[i].rounds[j].matches[k].event_name = tournament.event_name;
				groupStage.groups[i].rounds[j].matches[k].event_start_date = tournament.event_start_date;
				groupStage.groups[i].rounds[j].matches[k].event_location = tournament.event_location;
				groupStage.groups[i].rounds[j].matches[k].tournament_name = tournament.tournament_name;
				groupStage.groups[i].rounds[j].matches[k].round_number = groupStage.groups[i].rounds[j].round_number;
				groupStage.groups[i].rounds[j].matches[k].round_of = groupStage.groups[i].rounds[j].round_of;
				groupStage.groups[i].rounds[j].matches[k].match_number = (k + 1 + (groupStage.groups[(!(i) ? i : (i - 1))].numOfMatchesPerRound * i));
				groupStage.groups[i].rounds[j].matches[k].is_favourite = false;
				groupStage.groups[i].rounds[j].matches[k].match_completed = false;
				groupStage.groups[i].rounds[j].matches[k].players = [];
				console.log("Created Match " + groupStage.groups[i].rounds[j].matches[k].match_number);
			}
			console.log("Number of players in this Group: " + groupStage.groups[i].players.length);
			if (!(groupStage.groups[i].players.length % 2)) {
				console.log("Number of players in this Group is an even number");
				var count = 0;
				for (var l = 0; l < groupStage.groups[i].numOfMatchesPerRound * 2; l++) {
					if (!l) {
						// groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[l];
						(groupStage.groups[i].players[l] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[l].players.push(groupStage.groups[i].players[l]));
					} else if (l < groupStage.groups[i].numOfMatchesPerRound) {
						// groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)];
						(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + count + 1) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[l].players.push(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)]));
					} else {
						// groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].player2 = groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)];
						(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + count + 1) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].players.push(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)]));
					}
				}
			} else {
				for (var l = 0; l < groupStage.groups[i].numOfMatchesPerRound * 2; l++) {
					if (l < groupStage.groups[i].numOfMatchesPerRound) {
						// groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length];
						(groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[l].players.push(groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length]));
					} else {
						// groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].player2 = groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length];
						(groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].players.push(groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length]));
					}
				}
			}
		}
	}

	assignStations(tournament, station);
}

function generateBracket(bracket, players, tournament, station, assignStations) {
	bracket.byes = getByes(bracket.numOfPlayers);
	bracket.numOfWinnerRounds = 0;

	if (tournament.tournament_format == "Single Elimination") {
		bracket.winnerRounds = [];
		singleEliminationBracket(bracket, players, tournament);
	} else if (tournament.tournament_format == "Double Elimination") {
		bracket.winnerRounds = [];
		singleEliminationBracket(bracket, players, tournament);
		bracket.numOfLoserRounds = 0;
		bracket.loserRounds = [];
		doubleEliminationBracket(bracket, tournament);
	}

	assignStations(tournament, station);
}

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

function singleEliminationBracket(bracket, players, tournament) {
	// calculate winner rounds matches
	var winnerRounds = [];
	var i = 0;
	var winners = bracket.numOfPlayers;
	for ( i = 0; winners > 1; i++) {
		winnerRounds[i] = {};
		winnerRounds[i].event_name = tournament.event_name;
		winnerRounds[i].event_start_date = tournament.event_start_date;
		winnerRounds[i].event_location = tournament.event_location;
		winnerRounds[i].tournament_name = tournament.tournament_name;
		winnerRounds[i].round_number = (i + 1);
		winnerRounds[i].round_of = "Winner";
		winnerRounds[i].round_start_date = tournament.tournament_start_date;
		winnerRounds[i].round_pause = true;
		winnerRounds[i].round_completed = false;
		winnerRounds[i].round_best_of = 3;
		winnerRounds[i].amountOfMatches = getWinnersRoundMatches(winners);
		//console.log("Amount of matches: " + winnerRounds[i].amountOfMatches);
		bracket.numOfWinnerRounds++;

		winners = getNumOfPlayersForNextWinnersRound(winners);
	}

	//console.log(bracket.numOfPlayers);

	//Create the Matches for every Round
	for ( i = 0; i < bracket.numOfWinnerRounds; i++) {
		winnerRounds[i].matches = [];
		for ( j = 0; j < winnerRounds[i].amountOfMatches; j++) {
			winnerRounds[i].matches[j] = {};
			winnerRounds[i].matches[j].event_name = tournament.event_name;
			winnerRounds[i].matches[j].event_start_date = tournament.event_start_date;
			winnerRounds[i].matches[j].event_location = tournament.event_location;
			winnerRounds[i].matches[j].tournament_name = tournament.tournament_name;
			winnerRounds[i].matches[j].round_number = winnerRounds[i].round_number;
			winnerRounds[i].matches[j].round_of = winnerRounds[i].round_of;
			winnerRounds[i].matches[j].match_number = (j + 1);
			winnerRounds[i].matches[j].is_favourite = false;
			winnerRounds[i].matches[j].match_completed = false;
			winnerRounds[i].matches[j].players = [];
		}
	}

	// Assign players for Winners Round 1 Matches
	for ( i = 0; i < (bracket.numOfPlayers - bracket.byes) / 2; i++) {
		// winnerRounds[0].matches[i].player1 = players[bracket.byes + i/* - 1*/];
		(players[bracket.byes + i/* - 1*/] instanceof String ? 'Do nothing' : winnerRounds[0].matches[i].players.push(players[bracket.byes + i/* - 1*/]));
		// winnerRounds[0].matches[i].player2 = players[bracket.numOfPlayers - i - 1];
		(players[bracket.numOfPlayers - i - 1] instanceof String ? 'Do nothing' : winnerRounds[0].matches[i].players.push(players[bracket.numOfPlayers - i - 1]));
		//console.log(winnerRounds[0].name+", match: "+i+", player1: "+winnerRounds[0].matches[i].player1.seed+", player2: "+winnerRounds[0].matches[i].player2.seed);
	}

	if (bracket.byes) {
		// Assign players to Winners Round 2 matches
		var count = 0;
		for ( i = 0; i < bracket.byes; i++) {
			if (i < winnerRounds[1].amountOfMatches) {
				// winnerRounds[1].matches[i].player1 = players[i];
				(players[i] instanceof String ? 'Do nothing' : winnerRounds[1].matches[i].players.push(players[i]));
				//console.log(winnerRounds[1].name+", match: "+i+", player1: "+winnerRounds[1].matches[i].player1.seed);
			} else {
				count++;
				// winnerRounds[1].matches[i - count].player2 = players[i];
				(players[i] instanceof String ? 'Do nothing' : winnerRounds[1].matches[i - count].players.push(players[i]));
				//console.log(winnerRounds[1].name+", match: "+(i-count)+", player1: "+winnerRounds[1].matches[i-count].player1.seed+", player2: "+winnerRounds[1].matches[i-count].player2.seed);
				count++;
			}
		}

		// Create the Linked List
		// Winners Round 1 - Winner goes to
		for ( i = 0; i < winnerRounds[0].amountOfMatches; i++) {
			if (i < (winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches)) {
				winnerRounds[0].matches[i].winnerGoesTo = {};
				winnerRounds[0].matches[i].winnerGoesTo.event_name = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].event_name;
				winnerRounds[0].matches[i].winnerGoesTo.event_start_date = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].event_start_date;
				winnerRounds[0].matches[i].winnerGoesTo.event_location = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].event_location;
				winnerRounds[0].matches[i].winnerGoesTo.tournament_name = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].tournament_name;
				winnerRounds[0].matches[i].winnerGoesTo.past_round_number = winnerRounds[0].matches[i].round_number;
				winnerRounds[0].matches[i].winnerGoesTo.past_round_of = winnerRounds[0].matches[i].round_of;
				winnerRounds[0].matches[i].winnerGoesTo.past_match = winnerRounds[0].matches[i].match_number;
				winnerRounds[0].matches[i].winnerGoesTo.future_round_number = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].round_number;
				winnerRounds[0].matches[i].winnerGoesTo.future_round_of = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].round_of;
				winnerRounds[0].matches[i].winnerGoesTo.future_match = winnerRounds[1].matches[winnerRounds[0].amountOfMatches + i - ((winnerRounds[0].amountOfMatches - winnerRounds[1].amountOfMatches) * 2)].match_number;
			} else {
				winnerRounds[0].matches[i].winnerGoesTo = {};
				winnerRounds[0].matches[i].winnerGoesTo.event_name = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].event_name;
				winnerRounds[0].matches[i].winnerGoesTo.event_start_date = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].event_start_date;
				winnerRounds[0].matches[i].winnerGoesTo.event_location = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].event_location;
				winnerRounds[0].matches[i].winnerGoesTo.tournament_name = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].tournament_name;
				winnerRounds[0].matches[i].winnerGoesTo.past_round_number = winnerRounds[0].matches[i].round_number;
				winnerRounds[0].matches[i].winnerGoesTo.past_round_of = winnerRounds[0].matches[i].round_of;
				winnerRounds[0].matches[i].winnerGoesTo.past_match = winnerRounds[0].matches[i].match_number;
				winnerRounds[0].matches[i].winnerGoesTo.future_round_number = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].round_number;
				winnerRounds[0].matches[i].winnerGoesTo.future_round_of = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].round_of;
				winnerRounds[0].matches[i].winnerGoesTo.future_match = winnerRounds[1].matches[winnerRounds[0].amountOfMatches - i - 1].match_number;
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
				// winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j].match_number;

				winnerRounds[i].matches[j].winnerGoesTo = {};
				winnerRounds[i].matches[j].winnerGoesTo.event_name = winnerRounds[i+1].matches[j].event_name;
				winnerRounds[i].matches[j].winnerGoesTo.event_start_date = winnerRounds[i+1].matches[j].event_start_date;
				winnerRounds[i].matches[j].winnerGoesTo.event_location = winnerRounds[i+1].matches[j].event_location;
				winnerRounds[i].matches[j].winnerGoesTo.tournament_name = winnerRounds[i+1].matches[j].tournament_name;
				winnerRounds[i].matches[j].winnerGoesTo.past_round_number = winnerRounds[i].matches[j].round_number;
				winnerRounds[i].matches[j].winnerGoesTo.past_round_of = winnerRounds[i].matches[j].round_of;
				winnerRounds[i].matches[j].winnerGoesTo.past_match = winnerRounds[i].matches[j].match_number;
				winnerRounds[i].matches[j].winnerGoesTo.future_round_number = winnerRounds[i+1].matches[j].round_number;
				winnerRounds[i].matches[j].winnerGoesTo.future_round_of = winnerRounds[i+1].matches[j].round_of;
				winnerRounds[i].matches[j].winnerGoesTo.future_match = winnerRounds[i+1].matches[j].match_number;

			} else {
				count++;
				// winnerRounds[i].matches[j].winnerGoesTo = winnerRounds[i+1].matches[j - count].match_number;

				winnerRounds[i].matches[j].winnerGoesTo = {};
				winnerRounds[i].matches[j].winnerGoesTo.event_name = winnerRounds[i+1].matches[j - count].event_name;
				winnerRounds[i].matches[j].winnerGoesTo.event_start_date = winnerRounds[i+1].matches[j - count].event_start_date;
				winnerRounds[i].matches[j].winnerGoesTo.event_location = winnerRounds[i+1].matches[j - count].event_location;
				winnerRounds[i].matches[j].winnerGoesTo.tournament_name = winnerRounds[i+1].matches[j - count].tournament_name;
				winnerRounds[i].matches[j].winnerGoesTo.past_round_number = winnerRounds[i].matches[j].round_number;
				winnerRounds[i].matches[j].winnerGoesTo.past_round_of = winnerRounds[i].matches[j].round_of;
				winnerRounds[i].matches[j].winnerGoesTo.past_match = winnerRounds[i].matches[j].match_number;
				winnerRounds[i].matches[j].winnerGoesTo.future_round_number = winnerRounds[i+1].matches[j - count].round_number;
				winnerRounds[i].matches[j].winnerGoesTo.future_round_of = winnerRounds[i+1].matches[j - count].round_of;
				winnerRounds[i].matches[j].winnerGoesTo.future_match = winnerRounds[i+1].matches[j - count].match_number;

				count++;
			}
		}
	}

	for ( i = 0; i < bracket.numOfWinnerRounds; i++) {
		bracket.winnerRounds[i] = winnerRounds[i];
	}
}

//TODO Hard code for 4+ players
function doubleEliminationBracket(bracket, tournament) {
	// Add the final Round to the Winner bracket
	bracket.winnerRounds[bracket.numOfWinnerRounds] = {};
	bracket.winnerRounds[bracket.numOfWinnerRounds].event_name = tournament.event_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds].event_start_date = tournament.event_start_date;
	bracket.winnerRounds[bracket.numOfWinnerRounds].event_location = tournament.event_location;
	bracket.winnerRounds[bracket.numOfWinnerRounds].tournament_name = tournament.tournament_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds].round_number = (bracket.numOfWinnerRounds + 1);
	bracket.winnerRounds[bracket.numOfWinnerRounds].round_of = "Winner";
	bracket.winnerRounds[bracket.numOfWinnerRounds].round_start_date = tournament.tournament_start_date;
	bracket.winnerRounds[bracket.numOfWinnerRounds].round_pause = true;
	bracket.winnerRounds[bracket.numOfWinnerRounds].round_completed = false;
	bracket.winnerRounds[bracket.numOfWinnerRounds].round_best_of = 3;
	bracket.winnerRounds[bracket.numOfWinnerRounds].amountOfMatches = 1;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches = [];
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0] = {};

	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].event_name = tournament.event_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].event_start_date = tournament.event_start_date;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].event_location = tournament.event_location;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].tournament_name = tournament.tournament_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].round_number = bracket.winnerRounds[bracket.numOfWinnerRounds].round_number;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].round_of = bracket.winnerRounds[bracket.numOfWinnerRounds].round_of;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].match_number = 1;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].is_favourite = false;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].match_completed = false;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].players = [];

	// bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].name = "Winners Round " + (bracket.numOfWinnerRounds + 1) + " Match 1";
	bracket.numOfWinnerRounds++;
	// console.log(bracket);
	// bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].match_number;

	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo = {};
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.event_name = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].event_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.event_start_date = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].event_start_date;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.event_location = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].event_location;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.tournament_name = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].tournament_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.past_round_number = bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].round_number;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.past_round_of = bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].round_of;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.past_match = bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].match_number;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.future_round_number = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].round_number;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.future_round_of = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].round_of;
	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo.future_match = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].match_number;

	var loserRounds = [];
	loserRounds[0] = {};
	loserRounds[0].event_name = tournament.event_name;
	loserRounds[0].event_start_date = tournament.event_start_date;
	loserRounds[0].event_location = tournament.event_location;
	loserRounds[0].tournament_name = tournament.tournament_name;
	loserRounds[0].round_number = 1;
	loserRounds[0].round_of = "Loser";
	loserRounds[0].round_start_date = tournament.tournament_start_date;
	loserRounds[0].round_pause = true;
	loserRounds[0].round_completed = false;
	loserRounds[0].round_best_of = 3;
	//console.log(loserRounds[0].name);
	loserRounds[0].amountOfMatches = getLosersRound1Matches(bracket.numOfPlayers);
	//console.log("Amount of matches: " + loserRounds[0].amountOfMatches);
	bracket.numOfLoserRounds++;

	// Calculate loser rounds matches
	i = 0;
	if (bracket.winnerRounds[0].amountOfMatches > bracket.winnerRounds[1].amountOfMatches) { // Maybe check for byes here
		loserRounds[1] = {};
		loserRounds[1].event_name = tournament.event_name;
		loserRounds[1].event_start_date = tournament.event_start_date;
		loserRounds[1].event_location = tournament.event_location;
		loserRounds[1].tournament_name = tournament.tournament_name;
		loserRounds[1].round_number = 2;
		loserRounds[1].round_of = "Loser";
		loserRounds[1].round_start_date = tournament.tournament_start_date;
		loserRounds[1].round_pause = true;
		loserRounds[1].round_completed = false;
		loserRounds[1].round_best_of = 3;
		//console.log(loserRounds[1].name);
		loserRounds[1].amountOfMatches = bracket.winnerRounds[1].amountOfMatches;
		//console.log("Amount of matches: " + loserRounds[1].amountOfMatches);
		bracket.numOfLoserRounds++;
		i = 1;
	}
	var j = 1;
	var count = 0;
	if (bracket.numOfPlayers > 4) {
		do {
			i++;
			loserRounds[i] = {};
			loserRounds[i].event_name = tournament.event_name;
			loserRounds[i].event_start_date = tournament.event_start_date;
			loserRounds[i].event_location = tournament.event_location;
			loserRounds[i].tournament_name = tournament.tournament_name;
			loserRounds[i].round_number = (i + 1);
			loserRounds[i].round_of = "Loser";
			loserRounds[i].round_start_date = tournament.tournament_start_date;
			loserRounds[i].round_pause = true;
			loserRounds[i].round_completed = false;
			loserRounds[i].round_best_of = 3;
			//console.log(loserRounds[i].name);
			loserRounds[i].amountOfMatches = (bracket.winnerRounds[j].amountOfMatches) / 2;
			//console.log("Amount of matches: " + loserRounds[i].amountOfMatches);
			bracket.numOfLoserRounds++;
			count++;
			if (!(count % 2)) {
				j++;
			}
		} while (loserRounds[i].amountOfMatches > 1);
		i++;
		loserRounds[i] = {};
		loserRounds[i].event_name = tournament.event_name;
		loserRounds[i].event_start_date = tournament.event_start_date;
		loserRounds[i].event_location = tournament.event_location;
		loserRounds[i].tournament_name = tournament.tournament_name;
		loserRounds[i].round_number = (i + 1);
		loserRounds[i].round_of = "Loser";
		loserRounds[i].round_start_date = tournament.tournament_start_date;
		loserRounds[i].round_pause = true;
		loserRounds[i].round_completed = false;
		loserRounds[i].round_best_of = 3;
		//console.log(loserRounds[i].name);
		loserRounds[i].amountOfMatches = 1;
		//console.log("Amount of matches: " + loserRounds[i].amountOfMatches);
		bracket.numOfLoserRounds++;
	}
	// Create the Matches for the Loser Rounds
	for ( i = 0; i < bracket.numOfLoserRounds; i++) {
		loserRounds[i].matches = [];
		for ( j = 0; j < loserRounds[i].amountOfMatches; j++) {
			loserRounds[i].matches[j] = {};

			loserRounds[i].matches[j].event_name = tournament.event_name;
			loserRounds[i].matches[j].event_start_date = tournament.event_start_date;
			loserRounds[i].matches[j].event_location = tournament.event_location;
			loserRounds[i].matches[j].tournament_name = tournament.tournament_name;
			loserRounds[i].matches[j].round_number = loserRounds[i].round_number;
			loserRounds[i].matches[j].round_of = loserRounds[i].round_of;
			loserRounds[i].matches[j].match_number = (j + 1);
			loserRounds[i].matches[j].is_favourite = false;
			loserRounds[i].matches[j].match_completed = false;
			loserRounds[i].matches[j].players = [];

			// loserRounds[i].matches[j].name = "Losers Round " + (i + 1) + " Match " + (j + 1);
			//console.log(loserRounds[i].matches[j].name);
		}
	}
	// Go ahead and set the 'winner goes to' Match here, since its the last round of the losers bracket, the winner always goes to the final
	// loserRounds[i-1].matches[0].winnerGoesTo = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].match_number;

	loserRounds[i-1].matches[0].winnerGoesTo = {};
	loserRounds[i-1].matches[0].winnerGoesTo.event_name = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].event_name;
	loserRounds[i-1].matches[0].winnerGoesTo.event_start_date = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].event_start_date;
	loserRounds[i-1].matches[0].winnerGoesTo.event_location = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].event_location;
	loserRounds[i-1].matches[0].winnerGoesTo.tournament_name = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].tournament_name;
	loserRounds[i-1].matches[0].winnerGoesTo.past_round_number = loserRounds[i-1].matches[0].round_number;
	loserRounds[i-1].matches[0].winnerGoesTo.past_round_of = loserRounds[i-1].matches[0].round_of;
	loserRounds[i-1].matches[0].winnerGoesTo.past_match = loserRounds[i-1].matches[0].match_number;
	loserRounds[i-1].matches[0].winnerGoesTo.future_round_number = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].round_number;
	loserRounds[i-1].matches[0].winnerGoesTo.future_round_of = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].round_of;
	loserRounds[i-1].matches[0].winnerGoesTo.future_match = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].match_number;

	if (bracket.byes) {
		// Create the Linked Lists
		// Losers Round 1 - Winner goes to
		for ( i = 0; i < loserRounds[0].amountOfMatches; i++) {
			if (i < (loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches)) {
				// loserRounds[0].matches[i].winnerGoesTo = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].match_number;

				loserRounds[0].matches[i].winnerGoesTo = {};
				loserRounds[0].matches[i].winnerGoesTo.event_name = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].event_name;
				loserRounds[0].matches[i].winnerGoesTo.event_start_date = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].event_start_date;
				loserRounds[0].matches[i].winnerGoesTo.event_location = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].event_location;
				loserRounds[0].matches[i].winnerGoesTo.tournament_name = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].tournament_name;
				loserRounds[0].matches[i].winnerGoesTo.past_round_number = loserRounds[0].matches[i].round_number;
				loserRounds[0].matches[i].winnerGoesTo.past_round_of = loserRounds[0].matches[i].round_of;
				loserRounds[0].matches[i].winnerGoesTo.past_match = loserRounds[0].matches[i].match_number;
				loserRounds[0].matches[i].winnerGoesTo.future_round_number = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].round_number;
				loserRounds[0].matches[i].winnerGoesTo.future_round_of = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].round_of;
				loserRounds[0].matches[i].winnerGoesTo.future_match = loserRounds[1].matches[loserRounds[0].amountOfMatches + i - ((loserRounds[0].amountOfMatches - loserRounds[1].amountOfMatches) * 2)].match_number;

			} else {
				// loserRounds[0].matches[i].winnerGoesTo = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].match_number;

				loserRounds[0].matches[i].winnerGoesTo = {};
				loserRounds[0].matches[i].winnerGoesTo.event_name = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].event_name;
				loserRounds[0].matches[i].winnerGoesTo.event_start_date = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].event_start_date;
				loserRounds[0].matches[i].winnerGoesTo.event_location = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].event_location;
				loserRounds[0].matches[i].winnerGoesTo.tournament_name = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].tournament_name;
				loserRounds[0].matches[i].winnerGoesTo.past_round_number = loserRounds[0].matches[i].round_number;
				loserRounds[0].matches[i].winnerGoesTo.past_round_of = loserRounds[0].matches[i].round_of;
				loserRounds[0].matches[i].winnerGoesTo.past_match = loserRounds[0].matches[i].match_number;
				loserRounds[0].matches[i].winnerGoesTo.future_round_number = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].round_number;
				loserRounds[0].matches[i].winnerGoesTo.future_round_of = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].round_of;
				loserRounds[0].matches[i].winnerGoesTo.future_match = loserRounds[1].matches[loserRounds[0].amountOfMatches - i - 1].match_number;

			}
		}

		// Winners Round 1 & 2 - Loser goes to
		if (bracket.winnerRounds[0].amountOfMatches > loserRounds[0].amountOfMatches) {
			for ( i = 0; i < bracket.winnerRounds[0].amountOfMatches; i++) {
				if (i < (bracket.winnerRounds[0].amountOfMatches - bracket.winnerRounds[1].amountOfMatches)) {
					// bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[i].match_number;

					bracket.winnerRounds[0].matches[i].loserGoesTo = {};
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_name = loserRounds[0].matches[i].event_name;
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_start_date = loserRounds[0].matches[i].event_start_date;
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_location = loserRounds[0].matches[i].event_location;
					bracket.winnerRounds[0].matches[i].loserGoesTo.tournament_name = loserRounds[0].matches[i].tournament_name;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_number = bracket.winnerRounds[0].matches[i].round_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_of = bracket.winnerRounds[0].matches[i].round_of;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_match = bracket.winnerRounds[0].matches[i].match_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_number = loserRounds[0].matches[i].round_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_of = loserRounds[0].matches[i].round_of;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_match = loserRounds[0].matches[i].match_number;

				} else if (i < ((bracket.winnerRounds[0].amountOfMatches - bracket.winnerRounds[1].amountOfMatches) * 2)) {
					// bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].match_number;

					bracket.winnerRounds[0].matches[i].loserGoesTo = {};
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_name = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].event_name;
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_start_date = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].event_start_date;
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_location = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].event_location;
					bracket.winnerRounds[0].matches[i].loserGoesTo.tournament_name = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].tournament_name;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_number = bracket.winnerRounds[0].matches[i].round_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_of = bracket.winnerRounds[0].matches[i].round_of;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_match = bracket.winnerRounds[0].matches[i].match_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_number = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].round_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_of = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].round_of;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_match = loserRounds[0].matches[loserRounds[0].amountOfMatches - (i % loserRounds[0].amountOfMatches) - 1].match_number;
				} else {
					// bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].match_number;

					bracket.winnerRounds[0].matches[i].loserGoesTo = {};
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_name = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].event_name;
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_start_date = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].event_start_date;
					bracket.winnerRounds[0].matches[i].loserGoesTo.event_location = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].event_location;
					bracket.winnerRounds[0].matches[i].loserGoesTo.tournament_name = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].tournament_name;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_number = bracket.winnerRounds[0].matches[i].round_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_of = bracket.winnerRounds[0].matches[i].round_of;
					bracket.winnerRounds[0].matches[i].loserGoesTo.past_match = bracket.winnerRounds[0].matches[i].match_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_number = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].round_number;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_of = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].round_of;
					bracket.winnerRounds[0].matches[i].loserGoesTo.future_match = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].match_number;

					// bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].match_number;

					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo = {};
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.event_name = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].event_name;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.event_start_date = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].event_start_date;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.event_location = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].event_location;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.tournament_name = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].tournament_name;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.past_round_number = bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].round_number;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.past_round_of = bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].round_of;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.past_match = bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].match_number;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.future_round_number = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].round_number;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.future_round_of = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].round_of;
					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo.future_match = loserRounds[1].matches[loserRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].match_number;

				}
			}
			for ( i = 0; i < (bracket.winnerRounds[0].amountOfMatches - bracket.winnerRounds[1].amountOfMatches); i++) {
				// bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i].match_number;

				bracket.winnerRounds[1].matches[i].loserGoesTo = {};
				bracket.winnerRounds[1].matches[i].loserGoesTo.event_name = loserRounds[1].matches[i].event_name;
				bracket.winnerRounds[1].matches[i].loserGoesTo.event_start_date = loserRounds[1].matches[i].event_start_date;
				bracket.winnerRounds[1].matches[i].loserGoesTo.event_location = loserRounds[1].matches[i].event_location;
				bracket.winnerRounds[1].matches[i].loserGoesTo.tournament_name = loserRounds[1].matches[i].tournament_name;
				bracket.winnerRounds[1].matches[i].loserGoesTo.past_round_number = bracket.winnerRounds[1].matches[i].round_number;
				bracket.winnerRounds[1].matches[i].loserGoesTo.past_round_of = bracket.winnerRounds[1].matches[i].round_of;
				bracket.winnerRounds[1].matches[i].loserGoesTo.past_match = bracket.winnerRounds[1].matches[i].match_number;
				bracket.winnerRounds[1].matches[i].loserGoesTo.future_round_number = loserRounds[1].matches[i].round_number;
				bracket.winnerRounds[1].matches[i].loserGoesTo.future_round_of = loserRounds[1].matches[i].round_of;
				bracket.winnerRounds[1].matches[i].loserGoesTo.future_match = loserRounds[1].matches[i].match_number;

			}
		} else {
			for ( i = 0; i < bracket.winnerRounds[0].amountOfMatches; i++) {
				// bracket.winnerRounds[0].matches[i].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].match_number;

				bracket.winnerRounds[0].matches[i].loserGoesTo = {};
				bracket.winnerRounds[0].matches[i].loserGoesTo.event_name = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].event_name;
				bracket.winnerRounds[0].matches[i].loserGoesTo.event_start_date = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].event_start_date;
				bracket.winnerRounds[0].matches[i].loserGoesTo.event_location = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].event_location;
				bracket.winnerRounds[0].matches[i].loserGoesTo.tournament_name = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].tournament_name;
				bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_number = bracket.winnerRounds[0].matches[i].round_number;
				bracket.winnerRounds[0].matches[i].loserGoesTo.past_round_of = bracket.winnerRounds[0].matches[i].round_of;
				bracket.winnerRounds[0].matches[i].loserGoesTo.past_match = bracket.winnerRounds[0].matches[i].match_number;
				bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_number = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].round_number;
				bracket.winnerRounds[0].matches[i].loserGoesTo.future_round_of = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].round_of;
				bracket.winnerRounds[0].matches[i].loserGoesTo.future_match = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].match_number;

				// bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].match_number;

				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo = {};
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.event_name = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].event_name;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.event_start_date = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].event_start_date;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.event_location = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].event_location;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.tournament_name = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].tournament_name;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.past_round_number = bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].round_number;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.past_round_of = bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].round_of;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.past_match = bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].match_number;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.future_round_number = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].round_number;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.future_round_of = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].round_of;
				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo.future_match = loserRounds[0].matches[loserRounds[0].amountOfMatches - i - 1].match_number;

			}
			for ( i = 0; i < (bracket.winnerRounds[1].amountOfMatches - bracket.winnerRounds[0].amountOfMatches); i++) {
				// bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i].name;
				if (i < loserRounds[1].amountOfMatches) {
					// bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[i].match_number;

					bracket.winnerRounds[1].matches[i].loserGoesTo = {};
					bracket.winnerRounds[1].matches[i].loserGoesTo.event_name = loserRounds[1].matches[i].event_name;
					bracket.winnerRounds[1].matches[i].loserGoesTo.event_start_date = loserRounds[1].matches[i].event_start_date;
					bracket.winnerRounds[1].matches[i].loserGoesTo.event_location = loserRounds[1].matches[i].event_location;
					bracket.winnerRounds[1].matches[i].loserGoesTo.tournament_name = loserRounds[1].matches[i].tournament_name;
					bracket.winnerRounds[1].matches[i].loserGoesTo.past_round_number = bracket.winnerRounds[1].matches[i].round_number;
					bracket.winnerRounds[1].matches[i].loserGoesTo.past_round_of = bracket.winnerRounds[1].matches[i].round_of;
					bracket.winnerRounds[1].matches[i].loserGoesTo.past_match = bracket.winnerRounds[1].matches[i].match_number;
					bracket.winnerRounds[1].matches[i].loserGoesTo.future_round_number = loserRounds[1].matches[i].round_number;
					bracket.winnerRounds[1].matches[i].loserGoesTo.future_round_of = loserRounds[1].matches[i].round_of;
					bracket.winnerRounds[1].matches[i].loserGoesTo.future_match = loserRounds[1].matches[i].match_number;

				} else {
					// bracket.winnerRounds[1].matches[i].loserGoesTo = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].match_number;

					bracket.winnerRounds[1].matches[i].loserGoesTo = {};
					bracket.winnerRounds[1].matches[i].loserGoesTo.event_name = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].event_name;
					bracket.winnerRounds[1].matches[i].loserGoesTo.event_start_date = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].event_start_date;
					bracket.winnerRounds[1].matches[i].loserGoesTo.event_location = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].event_location;
					bracket.winnerRounds[1].matches[i].loserGoesTo.tournament_name = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].tournament_name;
					bracket.winnerRounds[1].matches[i].loserGoesTo.past_round_number = bracket.winnerRounds[1].matches[i].round_number;
					bracket.winnerRounds[1].matches[i].loserGoesTo.past_round_of = bracket.winnerRounds[1].matches[i].round_of;
					bracket.winnerRounds[1].matches[i].loserGoesTo.past_match = bracket.winnerRounds[1].matches[i].match_number;
					bracket.winnerRounds[1].matches[i].loserGoesTo.future_round_number = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].round_number;
					bracket.winnerRounds[1].matches[i].loserGoesTo.future_round_of = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].round_of;
					bracket.winnerRounds[1].matches[i].loserGoesTo.future_match = loserRounds[1].matches[loserRounds[1].amountOfMatches - (i % loserRounds[1].amountOfMatches) - 1].match_number;

				}
			}
		}
	}

	var fix = 0;
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
					// bracket.winnerRounds[i].matches[j].loserGoesTo = loserRounds[i].matches[j].match_number;

					bracket.winnerRounds[i].matches[j].loserGoesTo = {};
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_name = loserRounds[i].matches[j].event_name;
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_start_date = loserRounds[i].matches[j].event_start_date;
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_location = loserRounds[i].matches[j].event_location;
					bracket.winnerRounds[i].matches[j].loserGoesTo.tournament_name = loserRounds[i].matches[j].tournament_name;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_number = bracket.winnerRounds[i].matches[j].round_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_of = bracket.winnerRounds[i].matches[j].round_of;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_match = bracket.winnerRounds[i].matches[j].match_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_number = loserRounds[i].matches[j].round_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_of = loserRounds[i].matches[j].round_of;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_match = loserRounds[i].matches[j].match_number;

				} else {
					count++;
					// bracket.winnerRounds[i].matches[j].loserGoesTo = loserRounds[i].matches[j - count].match_number;

					bracket.winnerRounds[i].matches[j].loserGoesTo = {};
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_name = loserRounds[i].matches[j - count].event_name;
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_start_date = loserRounds[i].matches[j - count].event_start_date;
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_location = loserRounds[i].matches[j - count].event_location;
					bracket.winnerRounds[i].matches[j].loserGoesTo.tournament_name = loserRounds[i].matches[j - count].tournament_name;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_number = bracket.winnerRounds[i].matches[j].round_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_of = bracket.winnerRounds[i].matches[j].round_of;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_match = bracket.winnerRounds[i].matches[j].match_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_number = loserRounds[i].matches[j - count].round_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_of = loserRounds[i].matches[j - count].round_of;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_match = loserRounds[i].matches[j - count].match_number;

					count++;
				}
			} else/*if (temp > bracket.numOfLoserRounds)*/
			{
				// Check if by putting this condition you didn't fuck shit up by fixing the stupid error
				if (loserRounds[temp].amountOfMatches < loserRounds[temp - 1].amountOfMatches) {
					temp++;
				}
				//console.log(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches));
				// bracket.winnerRounds[i].matches[j].loserGoesTo = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].match_number;
				if (bracket.numOfPlayers > 4 || fix < 1) {
					bracket.winnerRounds[i].matches[j].loserGoesTo = {};
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_name = loserRounds[temp].matches[Math.floor(((j + loserRounds[(bracket.numOfPlayers > 4 ? 2 : 1)].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].event_name;
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_start_date = loserRounds[temp].matches[Math.floor(((j + loserRounds[(bracket.numOfPlayers > 4 ? 2 : 1)].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].event_start_date;
					bracket.winnerRounds[i].matches[j].loserGoesTo.event_location = loserRounds[temp].matches[Math.floor(((j + loserRounds[(bracket.numOfPlayers > 4 ? 2 : 1)].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].event_location;
					bracket.winnerRounds[i].matches[j].loserGoesTo.tournament_name = loserRounds[temp].matches[Math.floor(((j + loserRounds[(bracket.numOfPlayers > 4 ? 2 : 1)].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].tournament_name;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_number = bracket.winnerRounds[i].matches[j].round_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_of = bracket.winnerRounds[i].matches[j].round_of;
					bracket.winnerRounds[i].matches[j].loserGoesTo.past_match = bracket.winnerRounds[i].matches[j].match_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_number = loserRounds[temp].matches[Math.floor(((j + loserRounds[(bracket.numOfPlayers > 4 ? 2 : 1)].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].round_number;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_of = loserRounds[temp].matches[Math.floor(((j + loserRounds[(bracket.numOfPlayers > 4 ? 2 : 1)].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].round_of;
					bracket.winnerRounds[i].matches[j].loserGoesTo.future_match = loserRounds[temp].matches[Math.floor(((j + loserRounds[(bracket.numOfPlayers > 4 ? 2 : 1)].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].match_number;
					fix++;
				}
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
					// loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j].match_number;

					loserRounds[i].matches[j].winnerGoesTo = {};
					loserRounds[i].matches[j].winnerGoesTo.event_name = loserRounds[i+1].matches[j].event_name;
					loserRounds[i].matches[j].winnerGoesTo.event_start_date = loserRounds[i+1].matches[j].event_start_date;
					loserRounds[i].matches[j].winnerGoesTo.event_location = loserRounds[i+1].matches[j].event_location;
					loserRounds[i].matches[j].winnerGoesTo.tournament_name = loserRounds[i+1].matches[j].tournament_name;
					loserRounds[i].matches[j].winnerGoesTo.past_round_number = loserRounds[i].matches[j].round_number;
					loserRounds[i].matches[j].winnerGoesTo.past_round_of = loserRounds[i].matches[j].round_of;
					loserRounds[i].matches[j].winnerGoesTo.past_match = loserRounds[i].matches[j].match_number;
					loserRounds[i].matches[j].winnerGoesTo.future_round_number = loserRounds[i+1].matches[j].round_number;
					loserRounds[i].matches[j].winnerGoesTo.future_round_of = loserRounds[i+1].matches[j].round_of;
					loserRounds[i].matches[j].winnerGoesTo.future_match = loserRounds[i+1].matches[j].match_number;

				} else {
					count++;
					// loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j - count].match_number;

					loserRounds[i].matches[j].winnerGoesTo = {};
					loserRounds[i].matches[j].winnerGoesTo.event_name = loserRounds[i+1].matches[j - count].event_name;
					loserRounds[i].matches[j].winnerGoesTo.event_start_date = loserRounds[i+1].matches[j - count].event_start_date;
					loserRounds[i].matches[j].winnerGoesTo.event_location = loserRounds[i+1].matches[j - count].event_location;
					loserRounds[i].matches[j].winnerGoesTo.tournament_name = loserRounds[i+1].matches[j - count].tournament_name;
					loserRounds[i].matches[j].winnerGoesTo.past_round_number = loserRounds[i].matches[j].round_number;
					loserRounds[i].matches[j].winnerGoesTo.past_round_of = loserRounds[i].matches[j].round_of;
					loserRounds[i].matches[j].winnerGoesTo.past_match = loserRounds[i].matches[j].match_number;
					loserRounds[i].matches[j].winnerGoesTo.future_round_number = loserRounds[i+1].matches[j - count].round_number;
					loserRounds[i].matches[j].winnerGoesTo.future_round_of = loserRounds[i+1].matches[j - count].round_of;
					loserRounds[i].matches[j].winnerGoesTo.future_match = loserRounds[i+1].matches[j - count].match_number;

					count++;
				}
			} else {
				// loserRounds[i].matches[j].winnerGoesTo = loserRounds[i+1].matches[j].match_number;

				loserRounds[i].matches[j].winnerGoesTo = {};
				loserRounds[i].matches[j].winnerGoesTo.event_name = loserRounds[i+1].matches[j].event_name;
				loserRounds[i].matches[j].winnerGoesTo.event_start_date = loserRounds[i+1].matches[j].event_start_date;
				loserRounds[i].matches[j].winnerGoesTo.event_location = loserRounds[i+1].matches[j].event_location;
				loserRounds[i].matches[j].winnerGoesTo.tournament_name = loserRounds[i+1].matches[j].tournament_name;
				loserRounds[i].matches[j].winnerGoesTo.past_round_number = loserRounds[i].matches[j].round_number;
				loserRounds[i].matches[j].winnerGoesTo.past_round_of = loserRounds[i].matches[j].round_of;
				loserRounds[i].matches[j].winnerGoesTo.past_match = loserRounds[i].matches[j].match_number;
				loserRounds[i].matches[j].winnerGoesTo.future_round_number = loserRounds[i+1].matches[j].round_number;
				loserRounds[i].matches[j].winnerGoesTo.future_round_of = loserRounds[i+1].matches[j].round_of;
				loserRounds[i].matches[j].winnerGoesTo.future_match = loserRounds[i+1].matches[j].match_number;

			}
		}
	}

	for ( i = 0; i < bracket.numOfLoserRounds; i++) {
		bracket.loserRounds[i] = loserRounds[i];
	}
}

function getMatchHistoryForPlayer(req, res, client, done, log, standings, player, index, length, canEnd, finalStage) {
	var matchHistory = [];
	var query = client.query({
		text: "SELECT competes.round_number, competes.round_of, competes.match_number, ((SELECT sum(submits.score) FROM submits WHERE event_name = competes.event_name AND event_start_date = competes.event_start_date AND event_location = competes.event_location AND tournament_name = competes.tournament_name AND round_number = competes.round_number AND round_of = competes.round_of AND match_number = competes.match_number AND competitor_number = competes.competitor_number) > (SELECT sum(submits.score) FROM submits WHERE event_name = competes.event_name AND event_start_date = competes.event_start_date AND event_location = competes.event_location AND tournament_name = competes.tournament_name AND round_number = competes.round_number AND round_of = competes.round_of AND match_number = competes.match_number AND competitor_number <> competes.competitor_number)) AS win, (SELECT count(*) FROM submits WHERE event_name = competes.event_name AND event_start_date = competes.event_start_date AND event_location = competes.event_location AND tournament_name = competes.tournament_name AND round_number = competes.round_number AND round_of = competes.round_of AND match_number = competes.match_number) > 0 AS in_progress FROM competes WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND CASE WHEN $6 THEN (round_of = 'Winner' OR round_of = 'Loser' OR round_of = 'Round Robin') ELSE round_of = 'Group' END AND competitor_number = $5",
		values: [req.params.event, req.query.date, req.query.location, req.params.tournament, player.competitor_number, finalStage]
	});
	query.on("row", function (row, result) {
		matchHistory.push(row);
	});
	query.on('error', function (error) {
		done();
		console.log("torunament.js - getMatchHistoryForPlayer");
		console.log(error);
		res.status(500).send(error);
		log.info({
			res: res
		}, 'done response');
	});
	query.on("end", function (result) {
		player.match_history = matchHistory;
		if (index == length && canEnd) {
			done();
			res.status(200).send(standings);
			log.info({
				res: res
			}, 'done response');
		}
	});
}

function getMatchHistory(req, res, client, done, log, standings, players, index, length) {
	for (var i = 0; i < players.length; i++) {
		getMatchHistoryForPlayer(req, res, client, done, log, standings, players[i], i, players.length-1, index == length, true);
	}
}

function getStandingsForFinalStage(req, res, client, done, log, standings) {
	var query = client.query({
		text: 'SELECT every(round_completed) AS stage_completed FROM round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_of = $5',
		values: [req.params.event, req.query.date, req.query.location, req.params.tournament, "Winner"]
	});
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on('error', function (error) {
		done();
		console.log("torunament.js - getStandingsForFinalStage");
		console.log(error);
		res.status(500).send(error);
		log.info({
			res: res
		}, 'done response');
	});
	query.on("end", function (result) {
		//TODO logic here
		if (!result.rows[0].stage_completed) {
			var query = client.query({
				text: 'SELECT distinct competitor.competitor_number FROM competes NATURAL JOIN competitor WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_of = $5 AND competitor.competitor_check_in',
				values: [req.params.event, req.query.date, req.query.location, req.params.tournament, "Winner"]
			});
			query.on("row", function (row, result) {
				result.addRow(row);
			});
			query.on('error', function (error) {
				done();
				console.log("torunament.js - getStandingsForFinalStage");
				console.log(error);
				res.status(500).send(error);
				log.info({
					res: res
				}, 'done response');
			});
			query.on("end", function (result) {
				if (result.rows.length) {
					standings.finalStage = [];
					console.log("F O R S E N B O Y S");
					var query = client.query({
						text: "SELECT CASE WHEN tournament.team_size > 1 THEN team.team_name || ',;!;,' || team.team_logo ELSE customer.customer_username || ',;!;,' || customer.customer_profile_pic || ',;!;,' || customer.customer_tag END AS info, competes.competitor_number, competitor.competitor_seed FROM competitor JOIN competes ON competitor.event_name = competes.event_name AND competitor.event_start_date = competes.event_start_date AND competitor.event_location = competes.event_location AND competitor.tournament_name = competes.tournament_name AND competes.round_of = $5 AND competitor.competitor_number = competes.competitor_number JOIN tournament ON competes.event_name = tournament.event_name AND competes.event_start_date = tournament.event_start_date AND competes.event_location = tournament.event_location AND competes.tournament_name = tournament.tournament_name JOIN is_a ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number JOIN customer ON customer.customer_username = is_a.customer_username LEFT OUTER JOIN competes_for ON competes_for.event_name = competes.event_name AND competes_for.event_start_date = competes.event_start_date AND competes_for.event_location = competes.event_location AND competes_for.tournament_name = competes.tournament_name AND competes_for.competitor_number = competes.competitor_number LEFT OUTER JOIN team ON team.team_name = competes_for.team_name WHERE tournament.event_name = $1 AND tournament.event_start_date = $2 AND tournament.event_location = $3 AND tournament.tournament_name = $4 AND competitor.competitor_seed > 0 AND competes.round_of = $5 AND competitor.competitor_check_in GROUP BY tournament.team_size, team.team_name, team.team_logo, customer.customer_username, customer.customer_profile_pic, customer.customer_tag, competes.competitor_number, competitor.competitor_seed",
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament, "Winner"]
					});
					query.on("row", function (row, result) {
						var repeated = false;
						var info_string = row.info;
						var info_array = info_string.split(",;!;,");
						var temp = {};
						if (info_array.length == 2) {
							temp = {
								team_name: info_array[0],
								team_logo: info_array[1],
								competitor_number: parseInt(row.competitor_number),
								competitor_seed: parseInt(row.competitor_seed)
							};
						} else {
							temp = {
								customer_username: info_array[0],
								customer_profile_pic: info_array[1],
								customer_tag: info_array[2],
								competitor_number: parseInt(row.competitor_number),
								competitor_seed: parseInt(row.competitor_seed)
							};
						}

						for (var i = 0; i < standings.finalStage.length; i++) {
							if (standings.finalStage[i].competitor_number == temp.competitor_number) {
								repeated = true;
							}
						}
						if (!repeated) {
							standings.finalStage.push(temp);
						}

						//standings.finalStage.standings[row.standing - 1].push(temp);
					});
					query.on('error', function (error) {
						done();
						console.log("torunament.js - addMatch");
						console.log(error);
						res.status(500).send(error);
						log.info({
							res: res
						}, 'done response');
					});
					query.on("end", function (result) {
						for (var i = 0; i < standings.finalStage.length; i++) {
							//getMatchHistory(req, res, client, done, log, standings, standings.finalStage.standings[i], i, standings.finalStage.standings.length - 1);
							getMatchHistoryForPlayer(req, res, client, done, log, standings, standings.finalStage[i], i, standings.finalStage.length-1, true, true);
						}
					});
				} else {
					done();
					res.status(200).send(standings);
					log.info({
						res: res
					}, 'done response');
				}
			});
		} else {
			var query = client.query({
				text: 'SELECT max(competitor.competitor_standing) AS standings FROM competitor JOIN is_a ON is_a.event_name = competitor.event_name AND is_a.event_start_date = competitor.event_start_date AND is_a.event_location = competitor.event_location AND is_a.tournament_name = competitor.tournament_name AND is_a.competitor_number = competitor.competitor_number JOIN tournament ON competitor.event_name = tournament.event_name AND competitor.event_start_date = tournament.event_start_date AND competitor.event_location = tournament.event_location AND competitor.tournament_name = tournament.tournament_name JOIN customer ON customer.customer_username = is_a.customer_username WHERE is_a.event_name = $1 AND is_a.event_start_date = $2 AND is_a.event_location = $3 AND is_a.tournament_name = $4 AND competitor.competitor_standing > 0',
				values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
			});
			query.on("row", function (row, result) {
				result.addRow(row);
			});
			query.on('error', function (error) {
				done();
				console.log("torunament.js - getStandingsForFinalStage");
				console.log(error);
				res.status(500).send(error);
				log.info({
					res: res
				}, 'done response');
			});
			query.on("end", function (result) {
				if (result.rows.length) {
					standings.finalStage = {};
					standings.finalStage.standings = [];
					console.log(result.rows[0].standings);
					for (var i = 0; i < result.rows[0].standings; i++) {
						console.log("Hello!");
						standings.finalStage.standings[i] = [];
					}
					var query = client.query({
						text: "SELECT CASE WHEN tournament.team_size > 1 THEN team.team_name || ',;!;,' || team.team_logo ELSE customer.customer_username || ',;!;,' || customer.customer_profile_pic || ',;!;,' || customer.customer_tag END AS info, competitor.competitor_number, competitor.competitor_seed, competitor.competitor_standing AS standing FROM competitor JOIN tournament ON competitor.event_name = tournament.event_name AND competitor.event_start_date = tournament.event_start_date AND competitor.event_location = tournament.event_location AND competitor.tournament_name = tournament.tournament_name JOIN is_a ON is_a.event_name = competitor.event_name AND is_a.event_start_date = competitor.event_start_date AND is_a.event_location = competitor.event_location AND is_a.tournament_name = competitor.tournament_name AND is_a.competitor_number = competitor.competitor_number JOIN customer ON customer.customer_username = is_a.customer_username LEFT OUTER JOIN competes_for ON competes_for.event_name = competitor.event_name AND competes_for.event_start_date = competitor.event_start_date AND competes_for.event_location = competitor.event_location AND competes_for.tournament_name = competitor.tournament_name AND competes_for.competitor_number = competitor.competitor_number LEFT OUTER JOIN team ON team.team_name = competes_for.team_name WHERE tournament.event_name = $1 AND tournament.event_start_date = $2 AND tournament.event_location = $3 AND tournament.tournament_name = $4 AND competitor.competitor_standing > 0 GROUP BY tournament.team_size, team.team_name, team.team_logo, customer.customer_username, customer.customer_profile_pic, customer.customer_tag, competitor.competitor_number, competitor.competitor_seed, competitor.competitor_standing ORDER BY standing",
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
					});
					query.on("row", function (row, result) {
						var repeated = false;
						var info_string = row.info;
						var info_array = info_string.split(",;!;,");
						var temp = {};
						if (info_array.length == 2) {
							temp = {
								team_name: info_array[0],
								team_logo: info_array[1],
								competitor_number: parseInt(row.competitor_number),
								standing: row.standing
							};
						} else {
							temp = {
								customer_username: info_array[0],
								customer_profile_pic: info_array[1],
								customer_tag: info_array[2],
								competitor_number: parseInt(row.competitor_number),
								competitor_seed: parseInt(row.competitor_seed),
								standing: row.standing
							};
						}

						for (var i = 0; i < standings.finalStage.standings[row.standing - 1].length; i++) {
							if (standings.finalStage.standings[row.standing - 1][i].competitor_number == temp.competitor_number) {
								repeated = true;
							}
						}
						if (!repeated) {
							standings.finalStage.standings[row.standing - 1].push(temp);
						}

						//standings.finalStage.standings[row.standing - 1].push(temp);
					});
					query.on('error', function (error) {
						done();
						console.log("torunament.js - addMatch");
						console.log(error);
						res.status(500).send(error);
						log.info({
							res: res
						}, 'done response');
					});
					query.on("end", function (result) {
						for (var i = 0; i < standings.finalStage.standings.length; i++) {
							getMatchHistory(req, res, client, done, log, standings, standings.finalStage.standings[i], i, standings.finalStage.standings.length - 1);
						}
					});
				} else {
					done();
					res.status(204).send('');
					log.info({
						res: res
					}, 'done response');
				}
			});
		}
	});
}

function getGroupHistory(req, res, client, done, log, standings, players, index, length) {
	for (var i = 0; i < players.length; i++) {
		getMatchHistoryForPlayer(req, res, client, done, log, standings, players[i], i, players.length-1, false, false);
	}
	if (index == length) {
		getStandingsForFinalStage(req, res, client, done, log, standings);
	}
}

var getStandings = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text: "SELECT tournament_type FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		query.on('error', function (error) {
			done();
			console.log("torunament.js - getStandings");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res: res
			}, 'done response');
		});
		query.on("end", function (result) {
			if (result.rows.length) {
				var standings = {};
				if (result.rows[0].tournament_type == "Two Stage") {
					var query = client.query({
						text: 'SELECT group_number, team_size, (SELECT every(round_completed) FROM round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_of = $5) AS stage_completed FROM "group" NATURAL JOIN tournament WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4',
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament, "Group"]
					});
					query.on("row", function (row, result) {
						result.addRow(row);
					});
					query.on('error', function (error) {
						done();
						console.log("torunament.js - getStandings");
						console.log(error);
						res.status(500).send(error);
						log.info({
							res: res
						}, 'done response');
					});
					query.on("end", function (result) {
						standings.groupStage = {};
						standings.groupStage.groups = [];
						for (var i = 0; i < result.rows.length; i++) {
							standings.groupStage.groups[i] = [];
						}
						var stageCompleted = result.rows[0].stage_completed;
						if (!result.rows[0].stage_completed) {
							var query = client.query({
								text: 'SELECT CASE WHEN tournament.team_size > 1 THEN team.team_name || $6 || team.team_logo ELSE customer.customer_username || $6 || customer.customer_profile_pic || $6 || customer.customer_tag END AS info, has_a.group_number, competitor.competitor_number, competitor.competitor_seed FROM competes JOIN round ON competes.event_name = round.event_name AND competes.event_start_date = round.event_start_date AND competes.event_location = round.event_location AND competes.tournament_name = round.tournament_name AND competes.round_of = round.round_of AND competes.round_number = round.round_number JOIN competitor ON competitor.event_name = competes.event_name AND competitor.event_start_date = competes.event_start_date AND competitor.event_location = competes.event_location AND competitor.tournament_name = competes.tournament_name AND competitor.competitor_number = competes.competitor_number JOIN has_a ON has_a.event_name = competes.event_name AND has_a.event_start_date = competes.event_start_date AND has_a.event_location = competes.event_location AND has_a.tournament_name = competes.tournament_name AND has_a.round_number = competes.round_number AND has_a.round_of = competes.round_of AND has_a.match_number = competes.match_number JOIN tournament ON competes.event_name = tournament.event_name AND competes.event_start_date = tournament.event_start_date AND competes.event_location = tournament.event_location AND competes.tournament_name = tournament.tournament_name JOIN is_a ON is_a.event_name = competitor.event_name AND is_a.event_start_date = competitor.event_start_date AND is_a.event_location = competitor.event_location AND is_a.tournament_name = competitor.tournament_name AND is_a.competitor_number = competitor.competitor_number JOIN customer ON customer.customer_username = is_a.customer_username LEFT OUTER JOIN competes_for ON competes_for.event_name = competitor.event_name AND competes_for.event_start_date = competitor.event_start_date AND competes_for.event_location = competitor.event_location AND competes_for.tournament_name = competitor.tournament_name AND competes_for.competitor_number = competitor.competitor_number LEFT OUTER JOIN team ON team.team_name = competes_for.team_name LEFT OUTER JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.round_of = competes.round_of AND submits.round_number = competes.round_number AND submits.competitor_number = competes.competitor_number WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_of = $5 GROUP BY customer.customer_username, customer.customer_tag, customer.customer_profile_pic, round.round_best_of, has_a.group_number, competitor.competitor_seed, tournament.number_of_people_per_group, tournament.amount_of_winners_per_group, competitor.competitor_number, team.team_name, team.team_logo, tournament.team_size, team.team_name, team.team_logo, competes.competitor_number ORDER BY has_a.group_number, CASE WHEN sum(submits.score)/((round.round_best_of/2)+1) IS NULL THEN 0 ELSE sum(submits.score)/((round.round_best_of/2)+1) END DESC, competitor.competitor_seed',
								values: [req.params.event, req.query.date, req.query.location, req.params.tournament, "Group", ",;!;,"]
							});
							query.on("row", function (row, result) {
								var repeated = false;
								var info_string = row.info;
								var info_array = info_string.split(",;!;,");
								var temp = {};
								if (info_array.length == 2) {
									temp = {
										team_name: info_array[0],
										team_logo: info_array[1],
										group_number: row.group_number,
										competitor_number: parseInt(row.competitor_number),
										competitor_seed: parseInt(row.competitor_seed)
									};
								} else {
									temp = {
										customer_username: info_array[0],
										customer_profile_pic: info_array[1],
										customer_tag: info_array[2],
										group_number: row.group_number,
										competitor_number: parseInt(row.competitor_number),
										competitor_seed: parseInt(row.competitor_seed)
									};
								}

								for (var i = 0; i < standings.groupStage.groups.length; i++) {
									if (standings.groupStage.groups[row.group_number - 1].competitor_number == temp.competitor_number) {
										repeated = true;
									}
								}
								if (!repeated) {
									standings.groupStage.groups[row.group_number - 1].push(temp);
								}
							});
							query.on('error', function (error) {
								done();
								console.log("torunament.js - getStandings");
								console.log(error);
								res.status(500).send(error);
								log.info({
									res: res
								}, 'done response');
							});
							query.on("end", function (result) {
								console.log("torunament.js - getStandings");
								console.log(standings.groupStage);
								console.log(standings.groupStage.groups.length);
								for (var i = 0; i < standings.groupStage.groups.length; i++) {
									console.log(standings.groupStage.groups[i]);
									getGroupHistory(req, res, client, done, log, standings, standings.groupStage.groups[i], i, standings.groupStage.groups.length - 1);
								}
							});
						} else {
							var query = client.query({
								text: 'SELECT CASE WHEN tournament.team_size > 1 THEN team.team_name || $6 || team.team_logo ELSE customer.customer_username || $6 || customer.customer_profile_pic || $6 || customer.customer_tag END AS info, has_a.group_number, competes.competitor_number, competitor.competitor_seed, sum(submits.score)/((round.round_best_of/2)+1) AS wins, CASE WHEN has_a.group_number = (SELECT count(*) FROM "group" WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4) THEN ((SELECT count(*) FROM is_a WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4) % tournament.number_of_people_per_group - 1) - sum(submits.score)/((round.round_best_of/2)+1) ELSE (tournament.number_of_people_per_group - 1) - sum(submits.score)/((round.round_best_of/2)+1) END AS loses, CASE WHEN row_number() OVER(ORDER BY has_a.group_number, sum(submits.score)/((round.round_best_of/2)+1) DESC, competitor.competitor_seed) % (tournament.number_of_people_per_group) = 0 THEN row_number() OVER(ORDER BY has_a.group_number, sum(submits.score)/((round.round_best_of/2)+1) DESC) % (tournament.number_of_people_per_group + 1) ELSE row_number() OVER(ORDER BY has_a.group_number, sum(submits.score)/((round.round_best_of/2)+1) DESC) % (tournament.number_of_people_per_group) END AS standing, (CASE WHEN row_number() OVER(ORDER BY has_a.group_number, sum(submits.score)/((round.round_best_of/2)+1) DESC, competitor.competitor_seed) % (tournament.number_of_people_per_group) = 0 THEN row_number() OVER(ORDER BY has_a.group_number, sum(submits.score)/((round.round_best_of/2)+1) DESC) % (tournament.number_of_people_per_group + 1) ELSE row_number() OVER(ORDER BY has_a.group_number, bool_and(competes.competitor_number IN (SELECT competitor_number FROM competes WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_of = $6 OR competes.round_of = $7)) FROM submits JOIN competes ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.round_of = competes.round_of AND submits.round_number = competes.round_number AND submits.competitor_number = competes.competitor_number JOIN round ON submits.event_name = round.event_name AND submits.event_start_date = round.event_start_date AND submits.event_location = round.event_location AND submits.tournament_name = round.tournament_name AND submits.round_of = round.round_of AND submits.round_number = round.round_number JOIN competitor ON competitor.event_name = competes.event_name AND competitor.event_start_date = competes.event_start_date AND competitor.event_location = competes.event_location AND competitor.tournament_name = competes.tournament_name AND competitor.competitor_number = competes.competitor_number JOIN has_a ON has_a.event_name = competes.event_name AND has_a.event_start_date = competes.event_start_date AND has_a.event_location = competes.event_location AND has_a.tournament_name = competes.tournament_name AND has_a.round_number = competes.round_number AND has_a.round_of = competes.round_of AND has_a.match_number = competes.match_number JOIN tournament ON submits.event_name = tournament.event_name AND submits.event_start_date = tournament.event_start_date AND submits.event_location = tournament.event_location AND submits.tournament_name = tournament.tournament_name JOIN is_a ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number JOIN customer ON customer.customer_username = is_a.customer_username LEFT OUTER JOIN competes_for ON competes_for.event_name = competes.event_name AND competes_for.event_start_date = competes.event_start_date AND competes_for.event_location = competes.event_location AND competes_for.tournament_name = competes.tournament_name AND competes_for.competitor_number = competes.competitor_number LEFT OUTER JOIN team ON team.team_name = competes_for.team_name WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_of = $5 GROUP BY customer.customer_username, customer.customer_tag, customer.customer_profile_pic, round.round_best_of, has_a.group_number, competitor.competitor_seed, tournament.number_of_people_per_group, tournament.amount_of_winners_per_group, competes.competitor_number, team.team_name, team.team_logo, tournament.team_size, team.team_name, team.team_logo, competes.competitor_number ORDER BY has_a.group_number, wins DESC, competitor.competitor_seed, standing',
								values: [req.params.event, req.query.date, req.query.location, req.params.tournament, "Group", ",;!;,", "Winner", "Round Robin"]
							});
							query.on("row", function (row, result) {
								var repeated = false;
								var info_string = row.info;
								var info_array = info_string.split(",;!;,");
								var temp = {};
								if (info_array.length == 2) {
									temp = {
										team_name: info_array[0],
										team_logo: info_array[1],
										group_number: row.group_number,
										competitor_number: parseInt(row.competitor_number),
										competitor_seed: parseInt(row.competitor_seed),
										wins: row.wins,
										loses: row.loses,
										standing: row.standing,
										advanced: row.advanced
									};
								} else {
									temp = {
										customer_username: info_array[0],
										customer_profile_pic: info_array[1],
										customer_tag: info_array[2],
										group_number: row.group_number,
										competitor_number: parseInt(row.competitor_number),
										competitor_seed: parseInt(row.competitor_seed),
										wins: row.wins,
										loses: row.loses,
										standing: row.standing,
										advanced: row.advanced
									};
								}

								for (var i = 0; i < standings.groupStage.groups[row.group_number - 1].length; i++) {
									if (standings.groupStage.groups[row.group_number - 1][i].competitor_number == temp.competitor_number) {
										repeated = true;
									}
								}
								if (!repeated) {
									standings.groupStage.groups[row.group_number - 1].push(temp);
								}

								//standings.groupStage.groups[row.group_number - 1].push(temp);
							});
							query.on('error', function (error) {
								done();
								console.log("torunament.js - getStandings");
								console.log(error);
								res.status(500).send(error);
								log.info({
									res: res
								}, 'done response');
							});
							query.on("end", function (result) {
								console.log("torunament.js - getStandings");
								console.log(standings.groupStage);
								console.log(standings.groupStage.groups.length);
								for (var i = 0; i < standings.groupStage.groups.length; i++) {
									console.log(standings.groupStage.groups[i]);
									getGroupHistory(req, res, client, done, log, standings, standings.groupStage.groups[i], i, standings.groupStage.groups.length - 1);
								}
							});
						}
					});
				} else {
					getStandingsForFinalStage(req, res, client, done, log, standings);
				}
			} else {
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

var getRounds = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text: "SELECT team_size, tournament_type, tournament_format FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		query.on('error', function (error) {
			done();
			console.log("torunament.js - getRounds");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res: res
			}, 'done response');
		});
		query.on("end", function (result) {
			if (result.rows.length) {
				var details = result.rows[0];
				var tournament = {};
				tournament.finalStage = {};
				if (result.rows[0].tournament_type == "Two Stage") {
					tournament.groupStage = {};
					tournament.groupStage.groups = [];
				}
				if (result.rows[0].tournament_format == "Single Elimination") {
					tournament.finalStage.winnerRounds = [];
				} else if (result.rows[0].tournament_format == "Double Elimination") {
					tournament.finalStage.winnerRounds = [];
					tournament.finalStage.loserRounds = [];
				} else {
					tournament.finalStage.roundRobinRounds = [];
				}
				var query = client.query({
					text: 'SELECT match.round_number, match.round_of, match.match_number, match.match_completed, round.round_start_date, round.round_pause, round.round_completed, round.round_best_of, CASE WHEN tournament.team_size > 1 THEN team.team_name || $9 || team.team_logo ELSE customer.customer_username || $9 || customer.customer_profile_pic || $9 || customer.customer_tag END AS info, competes.competitor_number, sum(submits.score) AS score, has_a.group_number, is_played_in.station_number, stream.stream_link, match.is_favourite FROM match NATURAL JOIN tournament LEFT OUTER JOIN competes ON match.event_name = competes.event_name AND match.event_start_date = competes.event_start_date AND match.event_location = competes.event_location AND match.tournament_name = competes.tournament_name AND competes.round_number = match.round_number AND competes.round_of = match.round_of AND competes.match_number = match.match_number LEFT OUTER JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number LEFT OUTER JOIN is_a ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND competes.competitor_number = is_a.competitor_number LEFT OUTER JOIN customer ON is_a.customer_username = customer.customer_username LEFT OUTER JOIN competitor ON competitor.event_name = competes.event_name AND competitor.event_start_date = competes.event_start_date AND competitor.event_location = competes.event_location AND competitor.tournament_name = competes.tournament_name AND competitor.competitor_number = competes.competitor_number LEFT OUTER JOIN competes_for ON competes_for.event_name = competitor.event_name AND competes_for.event_start_date = competitor.event_start_date AND competes_for.event_location = competitor.event_location AND competes_for.tournament_name = competitor.tournament_name AND competes_for.competitor_number = competitor.competitor_number LEFT OUTER JOIN team ON team.team_name = competes_for.team_name LEFT OUTER JOIN has_a ON match.event_name = has_a.event_name AND match.event_start_date = has_a.event_start_date AND match.event_location = has_a.event_location AND match.tournament_name = has_a.tournament_name AND has_a.round_number = match.round_number AND has_a.round_of = match.round_of AND has_a.match_number = match.match_number LEFT OUTER JOIN is_played_in ON match.event_name = is_played_in.event_name AND match.event_start_date = is_played_in.event_start_date AND match.event_location = is_played_in.event_location AND match.tournament_name = is_played_in.tournament_name AND is_played_in.round_number = match.round_number AND is_played_in.round_of = match.round_of AND is_played_in.match_number = match.match_number LEFT OUTER JOIN stream ON stream.event_name = is_played_in.event_name AND stream.event_start_date = is_played_in.event_start_date AND stream.event_location = is_played_in.event_location AND stream.station_number = is_played_in.station_number JOIN round ON match.event_name = round.event_name AND match.event_start_date = round.event_start_date AND match.event_location = round.event_location AND match.tournament_name = round.tournament_name AND round.round_number = match.round_number AND round.round_of = match.round_of WHERE match.event_name = $1 AND match.event_start_date = $2 AND match.event_location = $3 AND match.tournament_name = $4 GROUP BY match.round_number, match.round_of, match.match_number, match.match_completed, customer.customer_tag, customer.customer_profile_pic, customer.customer_username, competes.competitor_number, competitor.competitor_seed, has_a.group_number, is_played_in.station_number, round.round_start_date, round.round_pause, round.round_completed, round.round_best_of, tournament.team_size, team.team_name, team.team_logo, stream.stream_link, match.is_favourite ORDER BY CASE WHEN match.round_of = $5 THEN 1 WHEN match.round_of = $6 THEN 2 WHEN match.round_of = $7 THEN 3 WHEN match.round_of = $8 THEN 4 END, match.round_number, match.match_number, competitor.competitor_seed',
					values: [req.params.event, req.query.date, req.query.location, req.params.tournament, "Group", "Round Robin", "Winner", "Loser", ",;!;,"]
				});
				query.on("row", function (row, result) {
					//console.log(row);
					var repeated = false;
					var info_string = row.info;
					var info_array = (!info_string ? new Array((details.team_size > 1 ? 2 : 3)) : info_string.split(",;!;,"));
					var temp = {};
					if (info_array.length == 2) {
						temp = {
							team_name : info_array[0],
							team_logo : info_array[1],
							competitor_number : parseInt(row.competitor_number),
							score : row.score
						};
					} else {
						temp = {
							customer_username : info_array[0],
							customer_profile_pic : info_array[1],
							customer_tag : info_array[2],
							competitor_number : parseInt(row.competitor_number),
							score : row.score
						};
					}
					if (row.group_number) {
						if (!tournament.groupStage.groups[row.group_number-1]) {
							tournament.groupStage.groups[row.group_number-1] = {};
							tournament.groupStage.groups[row.group_number-1].group_number = row.group_number;
							tournament.groupStage.groups[row.group_number-1].rounds = [];
						}
						if (!tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1]) {
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1] = {};
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].round_number = row.round_number;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].round_start_date = row.round_start_date;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].round_pause = row.round_pause;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].round_completed = row.round_completed;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].round_best_of = row.round_best_of;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches = [];
						}
						if (!tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number]) {
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number] = {};
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].match_number = row.match_number;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].match_completed = row.match_completed;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].station_number = row.station_number;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].stream_link = row.stream_link;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].is_favourite = row.is_favourite;
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].players = [];
						}

						for (var i = 0; i < tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].players.length; i++) {
							if (tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].players[i].competitor_number == temp.competitor_number) {
								repeated = true;
							}
						}
						if (!repeated) {
							tournament.groupStage.groups[row.group_number-1].rounds[row.round_number-1].matches[row.match_number-row.group_number].players.push(temp);
						}
					} else if (row.round_of === "Winner") {
						if (!tournament.finalStage.winnerRounds[row.round_number-1]) {
							tournament.finalStage.winnerRounds[row.round_number-1] = {};
							tournament.finalStage.winnerRounds[row.round_number-1].round_number = row.round_number;
							tournament.finalStage.winnerRounds[row.round_number-1].round_start_date = row.round_start_date;
							tournament.finalStage.winnerRounds[row.round_number-1].round_pause = row.round_pause;
							tournament.finalStage.winnerRounds[row.round_number-1].round_completed = row.round_completed;
							tournament.finalStage.winnerRounds[row.round_number-1].round_best_of = row.round_best_of;
							tournament.finalStage.winnerRounds[row.round_number-1].matches = [];
						}
						if (!tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1]) {
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1] = {};
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].match_number = row.match_number;
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].match_completed = row.match_completed;
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].station_number = row.station_number;
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].stream_link = row.stream_link;
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].is_favourite = row.is_favourite;
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].players = [];
						}

						for (var i = 0; i < tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].players.length; i++) {
							if (tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].players[i].competitor_number == temp.competitor_number) {
								repeated = true;
							}
						}
						if (!repeated) {
							tournament.finalStage.winnerRounds[row.round_number-1].matches[row.match_number-1].players.push(temp);
						}
					} else if (row.round_of === "Loser") {
						if (!tournament.finalStage.loserRounds[row.round_number-1]) {
							tournament.finalStage.loserRounds[row.round_number-1] = {};
							tournament.finalStage.loserRounds[row.round_number-1].round_number = row.round_number;
							tournament.finalStage.loserRounds[row.round_number-1].round_start_date = row.round_start_date;
							tournament.finalStage.loserRounds[row.round_number-1].round_pause = row.round_pause;
							tournament.finalStage.loserRounds[row.round_number-1].round_completed = row.round_completed;
							tournament.finalStage.loserRounds[row.round_number-1].round_best_of = row.round_best_of;
							tournament.finalStage.loserRounds[row.round_number-1].matches = [];
						}
						if (!tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1]) {
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1] = {};
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].match_number = row.match_number;
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].match_completed = row.match_completed;
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].station_number = row.station_number;
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].stream_link = row.stream_link;
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].is_favourite = row.is_favourite;
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].players = [];
						}

						for (var i = 0; i < tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].players.length; i++) {
							if (tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].players[i].competitor_number == temp.competitor_number) {
								repeated = true;
							}
						}
						if (!repeated) {
							tournament.finalStage.loserRounds[row.round_number-1].matches[row.match_number-1].players.push(temp);
						}
					} else {
						if (!tournament.finalStage.roundRobinRounds[row.round_number-1]) {
							tournament.finalStage.roundRobinRounds[row.round_number-1] = {};
							tournament.finalStage.roundRobinRounds[row.round_number-1].round_number = row.round_number;
							tournament.finalStage.roundRobinRounds[row.round_number-1].round_start_date = row.round_start_date;
							tournament.finalStage.roundRobinRounds[row.round_number-1].round_pause = row.round_pause;
							tournament.finalStage.roundRobinRounds[row.round_number-1].round_completed = row.round_completed;
							tournament.finalStage.roundRobinRounds[row.round_number-1].round_best_of = row.round_best_of;
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches = [];
						}
						if (!tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1]) {
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1] = {};
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].match_number = row.match_number;
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].match_completed = row.match_completed;
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].station_number = row.station_number;
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].stream_link = row.stream_link;
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].is_favourite = row.is_favourite;
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].players = [];
						}

						for (var i = 0; i < tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].players.length; i++) {
							if (tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].players[i].competitor_number == temp.competitor_number) {
								repeated = true;
							}
						}
						if (!repeated) {
							tournament.finalStage.roundRobinRounds[row.round_number-1].matches[row.match_number-1].players.push(temp);
						}
					}
				});
				query.on('error', function (error) {
					done();
					console.log("torunament.js - getRounds");
					console.log(error);
					res.status(500).send(error);
					log.info({
						res: res
					}, 'done response');
				});
				query.on("end", function (result) {
					// This takes care of the null values that happen in groups other than Group 1 because this group is the only one whose matches start from 1 (match_number)
					if (tournament.groupStage) {
						for (var i = 0; i < tournament.groupStage.groups.length; i++) {
							for (var j = 0; j < tournament.groupStage.groups[i].rounds.length; j++) {
								var newArray = [];
								for (var k = 0; k < tournament.groupStage.groups[i].rounds[j].matches.length; k++) {
									if (tournament.groupStage.groups[i].rounds[j].matches[k]) {
										newArray.push(tournament.groupStage.groups[i].rounds[j].matches[k]);
									}
								}
								tournament.groupStage.groups[i].rounds[j].matches = newArray;
							}
						}
					}

					done();
					res.status(200).send(tournament);
					log.info({
						res: res
					}, 'done response');
				});
			} else {
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

var getMatch = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text: "SELECT team_size, tournament_type, tournament_format FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		query.on('error', function (error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - getMatch");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res: res
			}, 'done response');
		});
		query.on("end", function (result) {
			if (result.rows.length) {
				var details = result.rows[0];
				var matchDetails = {};
				matchDetails.players = [];
				matchDetails.is_competitor = false;
				console.log(req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match);
				var query = client.query({
					text: 'SELECT CASE WHEN tournament.team_size > 1 THEN team.team_name || $9 || team.team_logo ELSE customer.customer_username || $9 || customer.customer_profile_pic || $9 || customer.customer_tag END AS info, competes.competitor_number, (customer.customer_username = $8) AS is_competitor, match.match_completed, match.is_favourite, sum(submits.score) AS score, (SELECT every(round_completed) FROM round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND CASE WHEN $6 = $10 THEN round_of = $11 ELSE round_of = $6 END) AS stage_completed, tournament.score_type, is_played_in.station_number, stream.stream_link, match.is_favourite FROM customer NATURAL JOIN is_a NATURAL JOIN tournament LEFT OUTER JOIN competes ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number LEFT OUTER JOIN competes_for ON competes_for.event_name = competes.event_name AND competes_for.event_start_date = competes.event_start_date AND competes_for.event_location = competes.event_location AND competes_for.tournament_name = competes.tournament_name AND competes_for.competitor_number = competes.competitor_number LEFT OUTER JOIN team ON team.team_name = competes_for.team_name LEFT OUTER JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number LEFT OUTER JOIN match ON match.event_name = competes.event_name AND match.event_start_date = competes.event_start_date AND match.event_location = competes.event_location AND match.tournament_name = competes.tournament_name AND match.round_number = competes.round_number AND match.round_of = competes.round_of AND match.match_number = competes.match_number LEFT OUTER JOIN is_played_in ON match.event_name = is_played_in.event_name AND match.event_start_date = is_played_in.event_start_date AND match.event_location = is_played_in.event_location AND match.tournament_name = is_played_in.tournament_name AND is_played_in.round_number = match.round_number AND is_played_in.round_of = match.round_of AND is_played_in.match_number = match.match_number LEFT OUTER JOIN stream ON stream.event_name = is_played_in.event_name AND stream.event_start_date = is_played_in.event_start_date AND stream.event_location = is_played_in.event_location AND stream.station_number = is_played_in.station_number  WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_number = $5 AND competes.round_of = $6 AND competes.match_number = $7 GROUP BY customer.customer_username, customer.customer_tag, customer.customer_profile_pic, match.match_completed, match.is_favourite, competes.competitor_number, tournament.team_size, team.team_name, team.team_logo, tournament.score_type, is_played_in.station_number, stream.stream_link, match.is_favourite ORDER BY competes.competitor_number',
					values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.user.username, ",;!;,", "Loser", "Winner"]
				});
				query.on("row", function (row, result) {
					var repeated = false;
					var info_string = row.info;
					var info_array = (!info_string ? new Array((details.team_size > 1 ? 2 : 3)) : info_string.split(",;!;,"));
					var temp = {};
					if (info_array.length == 2) {
						temp = {
							team_name : info_array[0],
							team_logo : info_array[1],
							competitor_number: parseInt(row.competitor_number),
							score : row.score
						};
					} else {
						temp = {
							customer_username : info_array[0],
							customer_profile_pic : info_array[1],
							customer_tag : info_array[2],
							competitor_number: parseInt(row.competitor_number),
							score : row.score
						};
					}

					for (var i = 0; i < matchDetails.players.length; i++) {
						if (matchDetails.players[i].competitor_number == temp.competitor_number) {
							repeated = true;
						}
					}
					if (!repeated) {
						matchDetails.players.push(temp);
					}

					//matchDetails.players.push(temp);
					matchDetails.match_completed = row.match_completed;
					matchDetails.stage_completed = row.stage_completed;
					matchDetails.is_favourite = row.is_favourite;
					matchDetails.score_type = row.score_type;
					matchDetails.station_number = row.station_number;
					matchDetails.stream_link = row.stream_link;
					matchDetails.is_favourite = row.is_favourite;
					if (!matchDetails.is_competitor) {
						matchDetails.is_competitor = row.is_competitor;
					}
				});
				query.on('error', function (error) {
					client.query("ROLLBACK");
					done();
					console.log("torunament.js - getMatch");
					console.log(error);
					res.status(500).send(error);
					log.info({
						res: res
					}, 'done response');
				});
				query.on("end", function (result) {
					matchDetails.sets = [];
					// Get the details for the sets
					var query = client.query({
						text: 'SELECT CASE WHEN tournament.team_size > 1 THEN team.team_name ELSE customer.customer_username END AS info, submits.competitor_number, is_set.set_seq, is_set.set_completed, submits.score AS score FROM is_set JOIN match NATURAL JOIN tournament ON is_set.event_name = match.event_name AND is_set.event_start_date = match.event_start_date AND is_set.event_location = match.event_location AND is_set.tournament_name = match.tournament_name AND is_set.round_number = match.round_number AND is_set.round_of = match.round_of AND is_set.match_number = match.match_number LEFT OUTER JOIN submits ON submits.event_name = is_set.event_name AND submits.event_start_date = is_set.event_start_date AND submits.event_location = is_set.event_location AND submits.tournament_name = is_set.tournament_name AND submits.round_number = is_set.round_number AND submits.round_of = is_set.round_of AND submits.match_number = is_set.match_number AND submits.set_seq = is_set.set_seq LEFT OUTER JOIN competes ON is_set.event_name = competes.event_name AND is_set.event_start_date = competes.event_start_date AND is_set.event_location = competes.event_location AND is_set.tournament_name = competes.tournament_name AND competes.round_number = is_set.round_number AND competes.round_of = is_set.round_of AND competes.match_number = is_set.match_number AND submits.competitor_number = competes.competitor_number LEFT OUTER JOIN is_a ON is_a.competitor_number = competes.competitor_number AND is_a.event_name = is_set.event_name AND is_a.event_start_date = is_set.event_start_date AND is_a.event_location = is_set.event_location AND is_a.tournament_name = is_set.tournament_name LEFT OUTER JOIN customer ON customer.customer_username = is_a.customer_username LEFT OUTER JOIN competes_for ON competes_for.event_name = submits.event_name AND competes_for.event_start_date = submits.event_start_date AND competes_for.event_location = submits.event_location AND competes_for.tournament_name = submits.tournament_name AND competes_for.competitor_number = submits.competitor_number LEFT OUTER JOIN team ON team.team_name = competes_for.team_name WHERE is_set.event_name = $1 AND is_set.event_start_date = $2 AND is_set.event_location = $3 AND is_set.tournament_name = $4 AND is_set.round_number = $5 AND is_set.round_of = $6 AND is_set.match_number = $7 ORDER BY submits.competitor_number',
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
					});
					query.on("row", function (row, result) {
						var repeated = false;
						if (!matchDetails.sets[row.set_seq-1]) {
							matchDetails.sets[row.set_seq-1] = {};
							matchDetails.sets[row.set_seq-1].set_seq = row.set_seq;
							matchDetails.sets[row.set_seq-1].set_completed = row.set_completed;
							matchDetails.sets[row.set_seq-1].scores = [];
						}

						for (var i = 0; i < matchDetails.sets[row.set_seq-1].scores.length; i++) {
							if (matchDetails.sets[row.set_seq-1].scores[i].competitor_number == parseInt(row.competitor_number)) {
								repeated = true;
							}
						}
						if (!repeated) {
							matchDetails.sets[row.set_seq-1].scores.push({
								name : row.info,
								competitor_number: parseInt(row.competitor_number),
								score : row.score
							});
						}

						//matchDetails.sets[row.set_seq-1].scores.push({
						//	name : row.info,
						//	competitor_number: row.competitor_number,
						//	score : row.score
						//});
					});
					query.on('error', function (error) {
						client.query("ROLLBACK");
						done();
						console.log("torunament.js - getMatch");
						console.log(error);
						res.status(500).send(error);
						log.info({
							res: res
						}, 'done response');
					});
					query.on("end", function (result) {
						done();
						res.status(200).send(matchDetails);
						log.info({
							res: res
						}, 'done response');
					});
				});
			} else {
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

var markAsFavourite = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT tournament_name FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - markAsFavourite");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text: "UPDATE match SET is_favourite = NOT is_favourite WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7",
					values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
				}, function (err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						console.log("torunament.js - markAsFavourite");
						console.log(err);
						res.status(500).send(err);
						log.info({
							res: res
						}, 'done response');
					} else {
						client.query("COMMIT");
						done();
						res.status(200).send("Updated");
						log.info({
							res: res
						}, 'done response');
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

var changeStation = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT tournament_name FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - changeStation");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				/**
				 * Check if the match where the station is to be changed already has a station
				 */
				var query = client.query({
					text: "SELECT station_number FROM is_played_in NATURAL JOIN match NATURAL JOIN round NATURAL JOIN tournament WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7",
					values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					client.query("ROLLBACK");
					done();
					console.log("torunament.js - changeStation");
					console.log(error);
					res.status(500).send(error);
					log.info({
						res : res
					}, 'done response');
				});
				query.on("end", function(result) {
					/**
					 * If it already has a station we have to do a switch. We don't know if there is a match that is scheduled to play in the provided station, so we have to look for one (in the same round).
					 * 		If there is a match, do the switch
					 * 		Else, just remove the station assigned to the match and assign the new station
					 */
					if (result.rows.length) {
						//Store the value for the station
						var station = parseInt(result.rows[0].station_number);
						// The match already had a station
						// Look for a match played in the provided station
						var query = client.query({
							text: "SELECT match_number FROM is_played_in NATURAL JOIN match NATURAL JOIN round NATURAL JOIN tournament WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6",
							values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of]
						});
						query.on("row", function(row, result) {
							result.addRow(row);
						});
						query.on('error', function(error) {
							client.query("ROLLBACK");
							done();
							console.log("torunament.js - changeStation");
							console.log(error);
							res.status(500).send(error);
							log.info({
								res : res
							}, 'done response');
						});
						query.on("end", function(result) {
							if (result.rows.length) {
								var match = parseInt(result.rows[0].match_number);
								// There was a match, so let's switch
								client.query({
									text: "DELETE FROM is_played_in WHERE (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) = ($1, $2, $3, $4, $5, $6, $7)",
									values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
								}, function (err, result) {
									if (err) {
										client.query("ROLLBACK");
										done();
										console.log("torunament.js - changeStation");
										console.log(err);
										res.status(500).send(err);
										log.info({
											res: res
										}, 'done response');
									} else {
										client.query({
											text: "INSERT INTO is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
											values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.body.station]
										}, function (err, result) {
											if (err) {
												client.query("ROLLBACK");
												done();
												console.log("torunament.js - changeStation");
												console.log(err);
												res.status(500).send(err);
												log.info({
													res: res
												}, 'done response');
											} else {
												client.query({
													text: "DELETE FROM is_played_in WHERE (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) = ($1, $2, $3, $4, $5, $6, $7)",
													values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, match]
												}, function (err, result) {
													if (err) {
														client.query("ROLLBACK");
														done();
														console.log("torunament.js - changeStation");
														console.log(err);
														res.status(500).send(err);
														log.info({
															res: res
														}, 'done response');
													} else {
														client.query({
															text: "INSERT INTO is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
															values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, match, station]
														}, function (err, result) {
															if (err) {
																client.query("ROLLBACK");
																done();
																console.log("torunament.js - changeStation");
																console.log(err);
																res.status(500).send(err);
																log.info({
																	res: res
																}, 'done response');
															} else {
																client.query("COMMIT");
																done();
																res.status(200).send("Updated");
																log.info({
																	res: res
																}, 'done response');
															}
														});
													}
												});
											}
										});
									}
								});
							} else {
								// There wasn't a match, we just need to replace the currrent station with the provided one
								client.query({
									text: "DELETE FROM is_played_in WHERE (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) = ($1, $2, $3, $4, $5, $6, $7)",
									values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
								}, function (err, result) {
									if (err) {
										client.query("ROLLBACK");
										done();
										console.log("torunament.js - changeStation");
										console.log(err);
										res.status(500).send(err);
										log.info({
											res: res
										}, 'done response');
									} else {
										client.query({
											text: "INSERT INTO is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
											values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.body.station]
										}, function (err, result) {
											if (err) {
												client.query("ROLLBACK");
												done();
												console.log("torunament.js - changeStation");
												console.log(err);
												res.status(500).send(err);
												log.info({
													res: res
												}, 'done response');
											} else {
												client.query("COMMIT");
												done();
												res.status(200).send("Updated");
												log.info({
													res: res
												}, 'done response');
											}
										});
									}
								});
							}
						});
					} else {
						// This match didn't have a station already assigned. So we just need to remove this station from any match that currently has is (in this same round) and assign it to the desired match
						client.query({
							text: "DELETE FROM is_played_in WHERE (event_name, event_start_date, event_location, tournament_name, round_number, round_of, station_number) = ($1, $2, $3, $4, $5, $6, $7)",
							values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.body.station]
						}, function (err, result) {
							if (err) {
								client.query("ROLLBACK");
								done();
								console.log("torunament.js - changeStation");
								console.log(err);
								res.status(500).send(err);
								log.info({
									res: res
								}, 'done response');
							} else {
								client.query({
									text: "INSERT INTO is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
									values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.body.station]
								}, function (err, result) {
									if (err) {
										client.query("ROLLBACK");
										done();
										console.log("torunament.js - changeStation");
										console.log(err);
										res.status(500).send(err);
										log.info({
											res: res
										}, 'done response');
									} else {
										client.query("COMMIT");
										done();
										res.status(200).send("Updated");
										log.info({
											res: res
										}, 'done response');
									}
								});
							}
						});
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

var unPauseRound = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT tournament_name FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - unPauseRound");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text: "UPDATE round SET (round_pause, round_start_date) = (NOT round_pause, $7) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6",
					values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, (new Date()).toUTCString()]
				}, function (err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						console.log("torunament.js - unPauseRound");
						console.log(err);
						res.status(500).send(err);
						log.info({
							res: res
						}, 'done response');
					} else {
						client.query("COMMIT");
						done();
						res.status(200).send("Un-paused");
						log.info({
							res: res
						}, 'done response');
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

var changeTimeAndDateOfRound = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT tournament_name FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - changeTimeAndDateOfRound");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text: "UPDATE round SET round_start_date = $7 WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6",
					values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.body.start_date]
				}, function (err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						console.log("torunament.js - changeTimeAndDateOfRound");
						console.log(err);
						res.status(500).send(err);
						log.info({
							res: res
						}, 'done response');
					} else {
						client.query("COMMIT");
						done();
						res.status(200).send("Updated");
						log.info({
							res: res
						}, 'done response');
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

function addSet(req, res, client, done, log, match_number, next_set, index, length, canEnd) {
	client.query({
		text: "INSERT INTO is_set (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
		values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, match_number, next_set]
	}, function (err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - addSet");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res: res
			}, 'done response');
		} else if (index == length && canEnd) {
			client.query("COMMIT");
			done();
			res.status(201).send("Sets added");
			log.info({
				res: res
			}, 'done response');
		}
	});
}

function removeSet(req, res, client, done, log, match_number, next_set, index, length, canEnd) {
	var query = client.query({
		text : "SELECT max(set_seq) AS next_set FROM is_set WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7",
		values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, match_number]
	});
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on('error', function(error) {
		client.query("ROLLBACK");
		done();
		console.log("torunament.js - removeSet");
		console.log(error);
		res.status(500).send(error);
		log.info({
			res : res
		}, 'done response');
	});
	query.on("end", function(result) {
		client.query({
			text: "DELETE FROM is_set WHERE (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) = ($1, $2, $3, $4, $5, $6, $7, $8)",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, match_number, next_set]
		}, function (err, result) {
			if (err) {
				client.query("ROLLBACK");
				done();
				console.log("torunament.js - removeSet");
				console.log(err);
				res.status(500).send(err);
				log.info({
					res: res
				}, 'done response');
			} else if (index == length && canEnd) {
				client.query("COMMIT");
				done();
				res.status(204).send("");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
}

function addSets(req, res, client, done, log, match_number, next_set, sets_to_add, index, length) {
	for (var i = 0; i < sets_to_add; i++) {
		addSet(req, res, client, done, log, match_number, next_set+i+1, i, sets_to_add-1, index == length);
	}
}

function removeSets(req, res, client, done, log, match_number, next_set, sets_to_remove, index, length) {
	for (var i = 0; i < sets_to_remove; i++) {
		removeSet(req, res, client, done, log, match_number, next_set-i, i, sets_to_remove-1, index == length);
	}
}

var editBestOf = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT round_best_of, (SELECT count(*) FROM match WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6) AS matches FROM tournament NATURAL JOIN event NATURAL JOIN round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - editBestOf");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				var round = {};
				round.best_of = parseInt(result.rows[0].round_best_of);
				round.matches = parseInt(result.rows[0].matches);
				if (isNaN(req.body.best_of) || req.body.best_of <= 0 || req.body.best_of % 2 == 0) {
					client.query("ROLLBACK");
					done();
					res.status(400).json({
						best_of_value_less_than_or_equal_to_0 : req.body.best_of <= 0,
						best_of_value_is_even : req.body.best_of % 2 == 0
					});
					log.info({
						res: res
					}, 'done response');
				} else {
					client.query({
						text: "UPDATE round SET round_best_of = $7 WHERE (event_name, event_start_date, event_location, tournament_name, round_number, round_of) = ($1, $2, $3, $4, $5, $6)",
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.body.best_of]
					}, function (err, result) {
						if (err) {
							client.query("ROLLBACK");
							done();
							console.log("torunament.js - editBestOf");
							console.log(err);
							res.status(500).send(err);
							log.info({
								res: res
							}, 'done response');
						} else {
							var query = client.query({
								text : "SELECT max(set_seq) AS next_set FROM is_set WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = 1",
								values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of]
							});
							query.on("row", function(row, result) {
								result.addRow(row);
							});
							query.on('error', function(error) {
								client.query("ROLLBACK");
								done();
								console.log("torunament.js - editBestOf");
								console.log(error);
								res.status(500).send(error);
								log.info({
									res : res
								}, 'done response');
							});
							query.on("end", function(result) {
								var next_set = parseInt(result.rows[0].next_set);
								if (round.best_of < req.body.best_of) {
									for (var i = 0; i < round.matches; i++) {
										addSets(req, res, client, done, log, i + 1, next_set, req.body.best_of - round.best_of, i, round.matches - 1);
									}
								} else if (round.best_of > req.body.best_of) {
									for (var i = 0; i < round.matches; i++) {
										removeSets(req, res, client, done, log, i + 1, next_set, round.best_of - req.body.best_of, i, round.matches - 1);
									}
								} else {
									client.query("COMMIT");
									done();
									res.status(204).send("");
									log.info({
										res: res
									}, 'done response');
								}
							});
						}
					});
				}
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send("Tournament not found");
				log.info({
					res: res
				}, 'done response');
			}
		});
	});
};

var getPrizeDistributions = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT * FROM prize_distribution"
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			console.log("torunament.js - getPrizeDistributions");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			done();
			res.status(200).json(result.rows);
			log.info({
				res : res
			}, 'done response');
		});
	});
};

function customerIsACompetitor(req, res, client, done, log, customer_username, competitor_number, index, length) {
	client.query({
		text: "INSERT INTO is_a (event_name, event_start_date, event_location, tournament_name, competitor_number, customer_username) VALUES($1, $2, $3, $4, $5, $6)",
		values: [req.params.event, req.query.date, req.query.location, req.params.tournament, parseInt(competitor_number), customer_username]
	}, function (err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - customerIsACompetitor");
			console.log(err);
			res.status(500).send(err);
			log.info({
				res: res
			}, 'done response');
		} else if (index == length) {
			client.query("COMMIT");
			done();
			res.status(201).send('Registered');
			log.info({
				res : res
			}, 'done response');
		}
	});
}

//TODO Integrate with payment service
var registerForTournament = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT competitor_fee, team_size, tournament_max_capacity AS max_capacity, ($5 IN (SELECT customer_username FROM is_a WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4)) AS is_competitor, (SELECT count(*) FROM is_a WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4) AS registered_competitors FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.user.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - registerForTournament");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length && !result.rows[0].is_competitor && result.rows[0].max_capacity > result.rows[0].registered_competitors) {
				var tournament = result.rows[0];
				//if (tournament.competitor_fee) {
				/**
				 * Payment service happens here.
				 * The payment service code is probably going to be handled async, so I have to handle that but for now lets just do whatever
				 */

				//} else {
				var query = client.query({
					text : "SELECT max(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4",
					values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					client.query("ROLLBACK");
					done();
					console.log("torunament.js - registerForTournament");
					console.log(error);
					res.status(500).send(error);
					log.info({
						res : res
					}, 'done response');
				});
				query.on("end", function(result) {
					var nextCompetitor = (!(result.rows[0].next_competitor) ? 1 : result.rows[0].next_competitor);
					client.query({
						text: "INSERT INTO competitor (event_name, event_start_date, event_location, tournament_name, competitor_number, competitor_standing, competitor_seed, matches_won, matches_lost, competitor_has_forfeited, competitor_check_in, competitor_paid) VALUES($1, $2, $3, $4, $5, 0, 0, 0, 0, false, false, true)",
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament, nextCompetitor]
					}, function (err, result) {
						if (err) {
							client.query("ROLLBACK");
							done();
							console.log("torunament.js - registerForTournament");
							console.log(err);
							res.status(500).send(err);
							log.info({
								res : res
							}, 'done response');
						} else {
							if (parseInt(tournament.team_size) > 1) {
								if (!req.body.team || !req.body.players || req.body.players.length != parseInt(tournament.team_size)) {
									client.query("ROLLBACK");
									done();
									res.status(403).json({
										missing_team_name : !req.body.team,
										missing_players_array : !req.body.players,
										invalid_amount_of_players :  req.body.players != parseInt(tournament.team_size)
									});
									log.info({
										res : res
									}, 'done response');
								} else {
									client.query({
										text: "INSERT INTO competes_for (event_name, event_start_date, event_location, tournament_name, competitor_number, team_name) VALUES($1, $2, $3, $4, $5, $6)",
										values: [req.params.event, req.query.date, req.query.location, req.params.tournament, nextCompetitor, req.body.team]
									}, function (err, result) {
										if (err) {
											client.query("ROLLBACK");
											done();
											console.log("torunament.js - registerForTournament");
											console.log(err);
											res.status(500).send(err);
											log.info({
												res: res
											}, 'done response');
										} else {
											for (var i = 0, index = 0; i < parseInt(tournament.team_size); i++) {
												customerIsACompetitor(req, res, client, done, log, req.body.players[i], nextCompetitor, index++, parseInt(tournament.team_size)-1);
											}
										}
									});
								}
							} else {
								customerIsACompetitor(req, res, client, done, log, req.user.username, nextCompetitor, 0, 0);
							}
						}
					});
				});
				//}
			} else {
				client.query("ROLLBACK");
				done();
				res.status(403).json({
					already_registered : result.rows[0].is_competitor,
					at_max_capacity : result.rows[0].max_capacity <= result.rows[0].registered_competitors
				});
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var getCheckedInCompetitors = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT team_size, (SELECT count(*) > 0 FROM round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4) AS stages_created FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			console.log("torunament.js - getCheckedInCompetitors");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				var details = result.rows[0];
				if (parseInt(result.rows[0].team_size) > 1) {
					var query = client.query({
						text: "SELECT team_name, team_logo, competitor_number, competitor_seed FROM team NATURAL JOIN competes_for NATURAL JOIN competitor WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_check_in ORDER BY competitor_seed",
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
					});
					query.on("row", function (row, result) {
						result.addRow(row);
					});
					query.on('error', function (error) {
						done();
						console.log("torunament.js - getCheckedInCompetitors");
						console.log(error);
						res.status(500).send(error);
						log.info({
							res: res
						}, 'done response');
					});
					query.on("end", function (result) {
						details.competitors = result.rows;
						done();
						res.status(200).json(details);
						log.info({
							res: res
						}, 'done response');
					});
				} else {
					var query = client.query({
						text: "SELECT customer_username, customer_tag, customer_profile_pic, competitor_number, competitor_seed FROM customer NATURAL JOIN is_a NATURAL JOIN competitor WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_check_in ORDER BY competitor_seed",
						values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
					});
					query.on("row", function (row, result) {
						result.addRow(row);
					});
					query.on('error', function (error) {
						done();
						console.log("torunament.js - getCheckedInCompetitors");
						console.log(error);
						res.status(500).send(error);
						log.info({
							res: res
						}, 'done response');
					});
					query.on("end", function (result) {
						details.competitors = result.rows;
						done();
						res.status(200).json(details);
						log.info({
							res: res
						}, 'done response');
					});
				}
			} else {
				done();
				res.status(404).send('Tournament not found');
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

function changeSeedValue(req, res, client, done, log, competitor_number, seed, index, length) {
	client.query({
		text: "UPDATE competitor SET competitor_seed = $6 WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5",
		values: [req.params.event, req.query.date, req.query.location, req.params.tournament, competitor_number, seed]
	}, function (err, result) {
		if (err) {
			client.query("ROLLBACK");
			done();
			console.log(err);
			res.status(500).send(err);
			log.info({
				res: res
			}, 'done response');
		} else if (index == length) {
			client.query("COMMIT");
			done();
			res.status(201).send('Seeds updated');
			log.info({
				res: res
			}, 'done response');
		}
	});
}

var arrangeSeeds = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT count(*) AS players FROM tournament NATURAL JOIN event NATURAL JOIN competitor WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active AND competitor_check_in",
			values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log(error);
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				if (req.body.players && req.body.players.length == parseInt(result.rows[0].players) && req.body.players.length > 1) {
					for (var i = 0, index = 0; i < result.rows[0].players; i++) {
						changeSeedValue(req, res, client, done, log, parseInt(req.body.players[i].competitor_number), parseInt(req.body.players[i].seed), index++, req.body.players.length-1);
					}
				} else {
					client.query("ROLLBACK");
					done();
					res.status(403).json({
						missing_players_array : !req.body.players,
						invalid_amount_of_players : req.body.players.length != result.rows[0].players,
						not_enough_players_for_a_tournament : req.body.players.length <= 1
					});
					log.info({
						res : res
					}, 'done response');
				}
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send('Tournament not found');
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var createReport = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT tournament_name, ($8 IN (SELECT customer.customer_username FROM customer JOIN is_a ON is_a.customer_username = customer.customer_username LEFT OUTER JOIN competes ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number LEFT OUTER JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number LEFT OUTER JOIN match ON match.event_name = competes.event_name AND match.event_start_date = competes.event_start_date AND match.event_location = competes.event_location AND match.tournament_name = competes.tournament_name AND match.round_number = competes.round_number AND match.round_of = competes.round_of AND match.match_number = competes.match_number WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_number = $5 AND competes.round_of = $6 AND competes.match_number = $7 GROUP BY customer.customer_username)) AS is_competitor FROM event NATURAL JOIN tournament NATURAL JOIN round NATURAL JOIN match WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7 AND event_active AND tournament_active",
			values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.user.username]
		});
		query.on("row", function(row, result) {
			console.log(row);
			console.log(req.user.username);
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			console.log(error);
			console.log("HELLO!");
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				if (result.rows[0].is_competitor) {
					var query = client.query({
						text : "SELECT max(report_number)+1 AS next_report FROM report WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7",
						values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
					});
					query.on("row", function(row, result) {
						result.addRow(row);
					});
					query.on('error', function(error) {
						client.query("ROLLBACK");
						done();
						console.log(error);
						res.status(500).send(error);
						log.info({
							res : res
						}, 'done response');
					});
					query.on("end", function(result) {
						var nextReport = (!(result.rows[0].next_report) ? 1 : result.rows[0].next_report);
						if (req.body.description && req.body.type) {
							client.query({
								text: "INSERT INTO report (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, report_number, report_description, report_image, report_date, report_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
								values: [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.params.set, nextReport, req.body.description, (!req.body.image ? 'null' : req.body.image), (new Date()).toUTCString(), req.body.type]
							}, function (err, result) {
								if (err) {
									client.query("ROLLBACK");
									done();
									console.log(err);
									res.status(500).send(err);
									log.info({
										res: res
									}, 'done response');
								} else {
									client.query("COMMIT");
									done();
									res.status(201).send('Sumbitted');
									log.info({
										res: res
									}, 'done response');
								}
							});
						} else {
							client.query("ROLLBACK");
							done();
							res.status(403).json({
								missing_description : !req.body.description,
								missing_type : !req.body.type
							});
							log.info({
								res : res
							}, 'done response');
						}
					});
				} else {
					client.query("ROLLBACK");
					done();
					res.status(403).send("You can't submit a report for this match");
					log.info({
						res : res
					}, 'done response');
				}
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send('Something was not found. (event, tournament, round, or match)');
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var deleteStages = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text: "SELECT tournament_name FROM tournament NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND event_active AND tournament_active",
			values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		query.on('error', function (error) {
			client.query("ROLLBACK");
			done();
			console.log("torunament.js - deleteStages");
			console.log(error);
			res.status(500).send(error);
			log.info({
				res: res
			}, 'done response');
		});
		query.on("end", function (result) {
			if (result.rows.length) {
				client.query({
					text: "DELETE FROM round WHERE (event_name, event_start_date, event_location, tournament_name) = ($1, $2, $3, $4)",
					values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
				}, function (err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						console.log("torunament.js - deleteStages");
						console.log(err);
						res.status(500).send(err);
						log.info({
							res: res
						}, 'done response');
					} else {
						client.query({
							text: 'DELETE FROM "group" WHERE (event_name, event_start_date, event_location, tournament_name) = ($1, $2, $3, $4)',
							values: [req.params.event, req.query.date, req.query.location, req.params.tournament]
						}, function (err, result) {
							if (err) {
								client.query("ROLLBACK");
								done();
								console.log("torunament.js - deleteStages");
								console.log(err);
								res.status(500).send(err);
								log.info({
									res: res
								}, 'done response');
							} else {
								client.query("COMMIT");
								done();
								res.status(204).send("");
								log.info({
									res: res
								}, 'done response');
							}
						});
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send('Tournament was not found');
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

module.exports.createTournament = createTournament;
module.exports.getStandings = getStandings;
module.exports.getRounds = getRounds;
module.exports.getMatch = getMatch;
module.exports.getPrizeDistributions = getPrizeDistributions;
module.exports.registerForTournament = registerForTournament;
module.exports.getCheckedInCompetitors = getCheckedInCompetitors;
module.exports.arrangeSeeds = arrangeSeeds;
module.exports.createReport = createReport;
module.exports.markAsFavourite = markAsFavourite;
module.exports.unPauseRound = unPauseRound;
module.exports.editBestOf = editBestOf;
module.exports.changeStation = changeStation;
module.exports.changeTimeAndDateOfRound = changeTimeAndDateOfRound;
module.exports.deleteStages = deleteStages;
