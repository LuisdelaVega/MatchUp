function competes(res, client, done, log, competitor, match) {
	client.query({
		text : "INSERT INTO competes (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
		values : [match.event_name, match.event_start_date, match.event_location, match.tournament_name, match.round_number, match.round_of, match.match_number, competitor.competitor_number]
	}, function(err, result) {
		if (err) {
			console.log("competes");
			client.query("ROLLBACK");
			done();
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
			console.log("is_set");
			client.query("ROLLBACK");
			done();
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
			console.log("competitor_goes_to");
			client.query("ROLLBACK");
			done();
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
			console.log(err);
			client.query("ROLLBACK");
			done();
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
						console.log("is_played_in");
						client.query("ROLLBACK");
						done();
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
			console.log(err);
			client.query("ROLLBACK");
			done();
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
			console.log("addCompetitorToGroup");
			client.query("ROLLBACK");
			done();
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
			console.log("attachGroupToMatch");
			client.query("ROLLBACK");
			done();
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
					text : "SELECT distinct competitor.competitor_number, competitor.competitor_seed FROM tournament JOIN is_a ON is_a.event_name = tournament.event_name AND is_a.event_start_date = tournament.event_start_date AND is_a.event_location = tournament.event_location AND is_a.tournament_name = tournament.tournament_name JOIN competitor ON is_a.event_name = competitor.event_name AND is_a.event_start_date = competitor.event_start_date AND is_a.event_location = competitor.event_location AND is_a.tournament_name = competitor.tournament_name AND is_a.competitor_number = competitor.competitor_number JOIN customer ON customer.customer_username = is_a.customer_username WHERE tournament.event_name = $1 AND tournament.event_start_date = $2 AND tournament.event_location = $3 AND tournament.tournament_name = $4 AND competitor_check_in ORDER BY competitor.competitor_seed",
					values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					client.query("ROLLBACK");
					done();
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
							tournament.groupStage = new Object();
							tournament.groupStage.numOfGroups = Math.ceil(tournament.players.length / tournament.number_of_people_per_group);

							generateGroupStage(tournament.groupStage, tournament.players, tournament, station, assignStationsForGroupStage, "Group");

							if (tournament.tournament_format === "Single Elimination" || tournament.tournament_format === "Double Elimination") {
								tournament.bracket = new Object();
								tournament.bracket.players = new Array();
								for (var i = 0, k = 0; i < tournament.groupStage.numOfGroups; i++) {
									for (var j = 0; j < tournament.groupStage.groups[i].numOfWinners; j++) {
										tournament.bracket.players[k] = new String("Winner #" + (j + 1) + " of Group " + (i + 1));
										k++;
									}
								}

								// console.log(tournament.bracket.players);
								tournament.bracket.numOfPlayers = tournament.bracket.players.length;
								generateBracket(tournament.bracket, tournament.bracket.players, tournament, station, assignStationsForFinalStage);
							} else {
								tournament.group = new Object();
								tournament.group.players = new Array();
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
								tournament.bracket = new Object();
								tournament.bracket.numOfPlayers = tournament.players.length;
								generateBracket(tournament.bracket, tournament.players, tournament, station, assignStationsForFinalStage);
							} else {
								tournament.group = new Object();
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
						// Added the false statement because I don't want it to run just yet
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
	groupStage.numOfGroups = Math.ceil(players.length / tournament.number_of_people_per_group);
	groupStage.groups = new Array();

	// Create the Groups
	for (var k = 0; k < groupStage.numOfGroups; k++) {
		groupStage.groups[k] = new Object();
		// DB parameters
		groupStage.groups[k].event_name = tournament.event_name;
		groupStage.groups[k].event_start_date = tournament.event_start_date;
		groupStage.groups[k].event_location = tournament.event_location;
		groupStage.groups[k].tournament_name = tournament.tournament_name;
		groupStage.groups[k].group_number = (k + 1);
		groupStage.groups[k].players = new Array();
		// Assign the players to their respective Groups based on their seeding
		for (var i = k * tournament.number_of_people_per_group, count = 0; i < players.length && i < (k + 1) * tournament.number_of_people_per_group; i++, count++) {
			groupStage.groups[k].players[count] = players[i];
		}
		// Algorithm parameters
		groupStage.groups[k].numOfRounds = (!(groupStage.groups[k].players.length % 2)) ? (groupStage.groups[k].players.length - 1) : groupStage.groups[k].players.length;
		groupStage.groups[k].numOfMatchesPerRound = Math.floor(groupStage.groups[k].players.length / 2);
		groupStage.groups[k].numOfWinners = ((groupStage.groups[k].players.length < tournament.amount_of_winners_per_group) ? groupStage.groups[k].players.length : tournament.amount_of_winners_per_group);
	}

	for (var i = 0; i < groupStage.numOfGroups; i++) {
		groupStage.groups[i].rounds = new Array();
		// Create the Rounds and Matches that each group will play
		for (var j = 0; j < groupStage.groups[i].numOfRounds; j++) {
			groupStage.groups[i].rounds[j] = new Object();
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
			groupStage.groups[i].rounds[j].matches = new Array();
			for (var k = 0; k < groupStage.groups[i].numOfMatchesPerRound; k++) {
				groupStage.groups[i].rounds[j].matches[k] = new Object();
				groupStage.groups[i].rounds[j].matches[k].event_name = tournament.event_name;
				groupStage.groups[i].rounds[j].matches[k].event_start_date = tournament.event_start_date;
				groupStage.groups[i].rounds[j].matches[k].event_location = tournament.event_location;
				groupStage.groups[i].rounds[j].matches[k].tournament_name = tournament.tournament_name;
				groupStage.groups[i].rounds[j].matches[k].round_number = groupStage.groups[i].rounds[j].round_number;
				groupStage.groups[i].rounds[j].matches[k].round_of = groupStage.groups[i].rounds[j].round_of;
				groupStage.groups[i].rounds[j].matches[k].match_number = (k + 1 + (groupStage.groups[(!(i) ? i : (i - 1))].numOfMatchesPerRound * i));
				groupStage.groups[i].rounds[j].matches[k].is_favourite = false;
				groupStage.groups[i].rounds[j].matches[k].match_completed = false;
				groupStage.groups[i].rounds[j].matches[k].players = new Array();
			}
			if (!(groupStage.groups[i].players.length % 2)) {
				var count = 0;
				for (var l = 0; l < groupStage.groups[i].numOfMatchesPerRound * 2; l++) {
					if (!l) {
						// groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[l];
						(groupStage.groups[i].players[l] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[l].players.push(groupStage.groups[i].players[l]));
					} else if (l < groupStage.groups[i].numOfMatchesPerRound) {
						// groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)];
						(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[l].players.push(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)]));
					} else {
						// groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].player2 = groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)];
						(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)] instanceof String ? 'Do nothing' : groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].players.push(groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)]));
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
		bracket.winnerRounds = new Array();
		singleEliminationBracket(bracket, players);
	} else if (tournament.tournament_format == "Double Elimination") {
		bracket.winnerRounds = new Array();
		singleEliminationBracket(bracket, players, tournament);
		bracket.numOfLoserRounds = 0;
		bracket.loserRounds = new Array();
		doubleEliminationBracket(bracket, tournament);
	}

	assignStations(tournament, station);
}

/*
 * Depreciated
 */
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

	if (req.params.format == 'single') {
		bracket.winnerRounds = new Array();
		singleEliminationBracket(bracket, players);
	} else if (req.params.format == 'double') {
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

/*
 * Depreciated
 */
var createGroupStage = function(req, res) {
	var groupStage = new Object();
	groupStage.winnersPerGroup = req.body.winnersPerGroup;
	groupStage.playersPerGroup = req.body.playersPerGroup;

	var players = req.body.players;

	groupStage.numOfGroups = Math.ceil(players.length / groupStage.playersPerGroup);
	groupStage.groups = new Array();

	for (var k = 0; k < groupStage.numOfGroups; k++) {
		groupStage.groups[k] = new Object();
		groupStage.groups[k].name = "Group " + (k + 1);
		groupStage.groups[k].players = new Array();
		for (var i = k * groupStage.playersPerGroup, count = 0; i < players.length && i < (k + 1) * groupStage.playersPerGroup; i++, count++) {
			groupStage.groups[k].players[count] = players[i];
		}
		groupStage.groups[k].numOfRounds = (!(groupStage.groups[k].players.length % 2)) ? (groupStage.groups[k].players.length - 1) : groupStage.groups[k].players.length;
		groupStage.groups[k].numOfMatchesPerRound = Math.floor(groupStage.groups[k].players.length / 2);
	}

	for (var i = 0; i < groupStage.numOfGroups; i++) {
		groupStage.groups[i].rounds = new Array();
		for (var j = 0; j < groupStage.groups[i].numOfRounds; j++) {
			groupStage.groups[i].rounds[j] = new Object();
			groupStage.groups[i].rounds[j].name = "Round " + (j + 1);
			groupStage.groups[i].rounds[j].matches = new Array();
			for (var k = 0; k < groupStage.groups[i].numOfMatchesPerRound; k++) {
				groupStage.groups[i].rounds[j].matches[k] = new Object();
				groupStage.groups[i].rounds[j].matches[k].name = "Match " + (k + 1);
			}
			if (!(groupStage.groups[i].players.length % 2)) {
				var count = 0;
				for (var l = 0; l < groupStage.groups[i].numOfMatchesPerRound * 2; l++) {
					if (!l) {
						groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[l];
					} else if (l < groupStage.groups[i].numOfMatchesPerRound) {
						groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)];
					} else {
						groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].player2 = groupStage.groups[i].players[(!((j + l) % groupStage.groups[i].players.length) ? (j + l + ++count) % groupStage.groups[i].players.length : (j + l + count) % groupStage.groups[i].players.length)];
					}
				}
			} else {
				for (var l = 0; l < groupStage.groups[i].numOfMatchesPerRound * 2; l++) {
					if (l < groupStage.groups[i].numOfMatchesPerRound) {
						groupStage.groups[i].rounds[j].matches[l].player1 = groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length];
					} else {
						groupStage.groups[i].rounds[j].matches[(groupStage.groups[i].numOfMatchesPerRound * 2) - l - 1].player2 = groupStage.groups[i].players[(j + l) % groupStage.groups[i].players.length];
					}
				}
			}
		}
	}

	res.json(groupStage);
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

function singleEliminationBracket(bracket, players, tournament) {
	// calculate winner rounds matches
	var winnerRounds = new Array();
	var i = 0;
	var winners = bracket.numOfPlayers;
	for ( i = 0; winners > 1; i++) {
		winnerRounds[i] = new Object();
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
		winnerRounds[i].matches = new Array();
		for ( j = 0; j < winnerRounds[i].amountOfMatches; j++) {
			winnerRounds[i].matches[j] = new Object();
			winnerRounds[i].matches[j].event_name = tournament.event_name;
			winnerRounds[i].matches[j].event_start_date = tournament.event_start_date;
			winnerRounds[i].matches[j].event_location = tournament.event_location;
			winnerRounds[i].matches[j].tournament_name = tournament.tournament_name;
			winnerRounds[i].matches[j].round_number = winnerRounds[i].round_number;
			winnerRounds[i].matches[j].round_of = winnerRounds[i].round_of;
			winnerRounds[i].matches[j].match_number = (j + 1);
			winnerRounds[i].matches[j].is_favourite = false;
			winnerRounds[i].matches[j].match_completed = false;
			winnerRounds[i].matches[j].players = new Array();
		}
	}

	// Assign players for Winners Round 1 Matches
	for ( i = 0; i < (bracket.numOfPlayers - bracket.byes) / 2; i++) {
		// winnerRounds[0].matches[i].player1 = players[bracket.byes + i/* - 1*/];
		console.log(players[bracket.byes + i/* - 1*/] instanceof String); (players[bracket.byes + i/* - 1*/] instanceof String ? 'Do nothing' : winnerRounds[0].matches[i].players.push(players[bracket.byes + i/* - 1*/]));
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
				winnerRounds[0].matches[i].winnerGoesTo = new Object();
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
				winnerRounds[0].matches[i].winnerGoesTo = new Object();
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

				winnerRounds[i].matches[j].winnerGoesTo = new Object();
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

				winnerRounds[i].matches[j].winnerGoesTo = new Object();
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

function doubleEliminationBracket(bracket, tournament) {
	// Add the final Round to the Winner bracket
	bracket.winnerRounds[bracket.numOfWinnerRounds] = new Object();
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
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches = new Array();
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0] = new Object();

	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].event_name = tournament.event_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].event_start_date = tournament.event_start_date;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].event_location = tournament.event_location;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].tournament_name = tournament.tournament_name;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].round_number = bracket.winnerRounds[bracket.numOfWinnerRounds].round_number;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].round_of = bracket.winnerRounds[bracket.numOfWinnerRounds].round_of;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].match_number = 1;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].is_favourite = false;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].match_completed = false;
	bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].players = new Array();

	// bracket.winnerRounds[bracket.numOfWinnerRounds].matches[0].name = "Winners Round " + (bracket.numOfWinnerRounds + 1) + " Match 1";
	bracket.numOfWinnerRounds++;
	// console.log(bracket);
	// bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].match_number;

	bracket.winnerRounds[bracket.numOfWinnerRounds-2].matches[0].winnerGoesTo = new Object();
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

	var loserRounds = new Array();
	loserRounds[0] = new Object();
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
	if (bracket.winnerRounds[0].amountOfMatches > bracket.winnerRounds[1].amountOfMatches) {
		loserRounds[1] = new Object();
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
	do {
		i++;
		loserRounds[i] = new Object();
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
	} while(loserRounds[i].amountOfMatches > 1);
	i++;
	loserRounds[i] = new Object();
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

	// Create the Matches for the Loser Rounds
	for ( i = 0; i < bracket.numOfLoserRounds; i++) {
		loserRounds[i].matches = new Array();
		for ( j = 0; j < loserRounds[i].amountOfMatches; j++) {
			loserRounds[i].matches[j] = new Object();

			loserRounds[i].matches[j].event_name = tournament.event_name;
			loserRounds[i].matches[j].event_start_date = tournament.event_start_date;
			loserRounds[i].matches[j].event_location = tournament.event_location;
			loserRounds[i].matches[j].tournament_name = tournament.tournament_name;
			loserRounds[i].matches[j].round_number = loserRounds[i].round_number;
			loserRounds[i].matches[j].round_of = loserRounds[i].round_of;
			loserRounds[i].matches[j].match_number = (j + 1);
			loserRounds[i].matches[j].is_favourite = false;
			loserRounds[i].matches[j].match_completed = false;
			loserRounds[i].matches[j].players = new Array();

			// loserRounds[i].matches[j].name = "Losers Round " + (i + 1) + " Match " + (j + 1);
			//console.log(loserRounds[i].matches[j].name);
		}
	}
	// Go ahead and set the 'winner goes to' Match here, since its the last round of the losers bracket, the winner always goes to the final
	// loserRounds[i-1].matches[0].winnerGoesTo = bracket.winnerRounds[bracket.numOfWinnerRounds-1].matches[0].match_number;

	loserRounds[i-1].matches[0].winnerGoesTo = new Object();
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

				loserRounds[0].matches[i].winnerGoesTo = new Object();
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

				loserRounds[0].matches[i].winnerGoesTo = new Object();
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

					bracket.winnerRounds[0].matches[i].loserGoesTo = new Object();
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

					bracket.winnerRounds[0].matches[i].loserGoesTo = new Object();
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

					bracket.winnerRounds[0].matches[i].loserGoesTo = new Object();
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

					bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches + (loserRounds[0].amountOfMatches * 2) - i - 1].loserGoesTo = new Object();
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

				bracket.winnerRounds[1].matches[i].loserGoesTo = new Object();
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

				bracket.winnerRounds[0].matches[i].loserGoesTo = new Object();
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

				bracket.winnerRounds[1].matches[bracket.winnerRounds[1].amountOfMatches - i - 1].loserGoesTo = new Object();
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

					bracket.winnerRounds[1].matches[i].loserGoesTo = new Object();
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

					bracket.winnerRounds[1].matches[i].loserGoesTo = new Object();
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

					bracket.winnerRounds[i].matches[j].loserGoesTo = new Object();
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

					bracket.winnerRounds[i].matches[j].loserGoesTo = new Object();
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

				bracket.winnerRounds[i].matches[j].loserGoesTo = new Object();
				bracket.winnerRounds[i].matches[j].loserGoesTo.event_name = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].event_name;
				bracket.winnerRounds[i].matches[j].loserGoesTo.event_start_date = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].event_start_date;
				bracket.winnerRounds[i].matches[j].loserGoesTo.event_location = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].event_location;
				bracket.winnerRounds[i].matches[j].loserGoesTo.tournament_name = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].tournament_name;
				bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_number = bracket.winnerRounds[i].matches[j].round_number;
				bracket.winnerRounds[i].matches[j].loserGoesTo.past_round_of = bracket.winnerRounds[i].matches[j].round_of;
				bracket.winnerRounds[i].matches[j].loserGoesTo.past_match = bracket.winnerRounds[i].matches[j].match_number;
				bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_number = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].round_number;
				bracket.winnerRounds[i].matches[j].loserGoesTo.future_round_of = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].round_of;
				bracket.winnerRounds[i].matches[j].loserGoesTo.future_match = loserRounds[temp].matches[Math.floor(((j + loserRounds[2].amountOfMatches / 2/* + 2*/) % loserRounds[temp].amountOfMatches))].match_number;

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

					loserRounds[i].matches[j].winnerGoesTo = new Object();
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

					loserRounds[i].matches[j].winnerGoesTo = new Object();
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

				loserRounds[i].matches[j].winnerGoesTo = new Object();
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

module.exports.createBraket = createBraket;
module.exports.createGroupStage = createGroupStage;
module.exports.createTournament = createTournament;
