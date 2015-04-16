var getEventsParams = {
    type : ["regular", "hosted"],
    filter : ["game", "genre"],
    state : ["live", "past", "upcoming"],
    magnitude : ["local", "regional", "national"]
};

var getEvents = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var where = false;
        var queryText = "SELECT ";
        var queryGroupBy = " GROUP BY event_name, event_start_date, event_location";
        switch (req.query.type) {
            case getEventsParams.type[0]:
                queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo, event_banner FROM event WHERE concat(event_name, event_location, event_start_date) NOT IN (SELECT concat(event_name, event_location, event_start_date) FROM hosts)";
                where = true;
                break;
            case getEventsParams.type[1]:
                queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo, event_banner, organization_name, organization_logo FROM event NATURAL JOIN hosts NATURAL JOIN organization";
                queryGroupBy += ", organization_name, organization_logo";
                break;
            default:
                queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo, event_banner FROM event";
        }
        switch (req.query.filter) {
            case getEventsParams.filter[0]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game WHERE game_name ILIKE '%" + ((!req.query.value) ? 0 : req.query.value) + "%')";
                break;
            case getEventsParams.filter[1]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game NATURAL JOIN is_of NATURAL JOIN genre WHERE genre_name ILIKE '%" + ((!req.query.value) ? 0 : req.query.value) + "%')";
                break;
        }
        switch (req.query.state) {
            case getEventsParams.state[0]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "event_start_date < now() at time zone 'utc' AND event_end_date > now() at time zone 'utc'";
                break;
            case getEventsParams.state[1]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "event_end_date < now() at time zone 'utc'";
                break;
            case getEventsParams.state[2]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "event_start_date > now() at time zone 'utc'";
                break;
        }
        switch (req.query.magnitude) {
            case getEventsParams.magnitude[0]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "event_type = 'Local'";
                break;
            case getEventsParams.magnitude[1]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "event_type = 'Regional'";
                break;
            case getEventsParams.magnitude[2]:
                if (where) {
                    queryText += " AND ";
                } else {
                    queryText += " WHERE ";
                    where = true;
                }
                queryText += "event_type = 'National'";
                break;
        }

        if (req.query.online && req.query.online != "false") {
            if (where) {
                queryText += " AND event_is_online";
            } else {
                queryText += " WHERE event_is_online";
                where = true;
            }
        }

        if (where) {
            queryText += " AND event_active";
        } else {
            queryText += " WHERE event_active";
        }

        queryText += queryGroupBy;
        queryText += " ORDER BY event_start_date";
        // Query the database to find the account
        var query = client.query({
            text : queryText
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
            done();
            res.status(200).json(result.rows);
            log.info({
                res : res
            }, 'done response');
        });
    });
};

var getEvent = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var event = new Object();
        client.query("BEGIN");
        var query = client.query({
            text : "SELECT event.event_name, event.event_start_date, event.event_end_date, event.event_location, event.event_venue, event.event_banner, event.event_logo, event.event_registration_deadline, event.event_rules, event.event_description, event.event_deduction_fee, event.event_is_online, event.event_type, event.customer_username AS creator, hosts.organization_name AS host FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location]
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
                event = result.rows[0];
                // Check if user is organizer
                var query = client.query({
                    text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                    values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    client.query("COMMIT");
                    done();
                    event.is_organizer = (result.rows.length > 0);
                    res.status(200).json(event);
                    log.info({
                        res : res
                    }, 'done response');
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(404).send("Couldn't find the event: " + req.params.event + " starting on: " + req.query.date + " located at: " + req.query.location);
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

function updateCompetitor(req, res, log, client, done, competitor, isWinner) {
    var queryText = "";

    if (isWinner) {
        queryText = "UPDATE competitor SET matches_won = matches_won + 1 WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5";
    } else {
        queryText = "UPDATE competitor SET matches_lost = matches_lost + 1 WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5";
    }

    client.query({
        text : queryText,
        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, competitor.competitor_number]
    }, function(err, result) {
        if (err) {
            client.query("ROLLBACK");
            done();
            console.log(err);
            res.status(500).send(err);
            log.info({
                res : res
            }, 'done response');
        } else {
            // Assign each competitor to their next match
            if (req.query.round_of != "Group" && req.query.round_of != "Round Robin") {
                if (req.query.round_of != "Loser" || isWinner) {
                    var query = client.query({
                        text : "SELECT future_round_number, future_round_of, future_match FROM competitor_goes_to WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND past_round_number = $5 AND past_round_of = $6 AND past_match = $7 AND is_winner = $8",
                        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, isWinner]
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
                            client.query({
                                text : "INSERT INTO competes (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                                values : [req.params.event, req.query.date, req.query.location, req.params.tournament, result.rows[0].future_round_number, result.rows[0].future_round_of, result.rows[0].future_match, competitor.competitor_number]
                            }, function(err, result) {
                                done();
                                if (err) {
                                    client.query("ROLLBACK");
                                    done();
                                    res.status(500).send("Oh, no! Disaster!");
                                    log.info({
                                        res : res
                                    }, 'done response');
                                }
                            });
                        }
                    });
                }
            }
        }
    });
}

function updateSetCompleted(req, res, log, client, done, index, length) {
    client.query({
        text : "UPDATE is_set SET set_completed = true WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7 AND set_seq = $8",
        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, (parseInt(req.params.set) + index)]
    }, function(err, result) {
        if (err) {
            client.query("ROLLBACK");
            done();
            console.log(err);
            res.status(500).send(err);
            log.info({
                res : res
            }, 'done response');
        }
    });
}

function competes(req, res, client, done, log, competitor, round, match, round_of, has_byes, index, length) {
    console.log("competitor: "+competitor, "round: "+round, "match: "+match, "round_of: "+round_of, "has_byes: "+has_byes, "index: "+index, "length: "+length);
    client.query({
        text : "INSERT INTO competes (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, round, round_of, match, competitor]
    }, function(err, result) {
        if (err) {
            console.log("competes");
            console.log(err);
            client.query("ROLLBACK");
            done();
            res.status(500).send(err);
            log.info({
                res : res
            }, 'done response');
        } else {
            //console.log(index);
            //console.log(length);
            if (!has_byes && index === length) {
                client.query("COMMIT");
                done();
                res.status(201).send("Score submitted");
                log.info({
                    res: res
                }, 'done response');
            }
        }
    });
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

function getNextPowerOf2(numOfPlayers) {
    return Math.ceil(Math.log(numOfPlayers) / Math.log(2));
}

function is_set(req, res, client, done, log, round_number, round_of, match_number, set_seq, station_number, index, length) {
    client.query({
        text : "INSERT INTO is_set (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, round_number, round_of, match_number, set_seq]
    }, function(err, result) {
        if (err) {
            console.log("is_set");
            client.query("ROLLBACK");
            done();
            res.status(500).send(err);
            log.info({
                res : res
            }, 'done response');
        } else if (index == length) {
            // Assign the same station to the extra match (No reason for them to move since they are playing each other again)
            client.query({
                text : "INSERT INTO is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                values : [req.params.event, req.query.date, req.query.location, req.params.tournament, round_number, round_of, match_number, station_number]
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
                    res.status(201).send("Score submitted");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
}

function updateStandingForOneCompetitor(req, res, client, done, log, competitor_number, standing, index, length, canEnd) {
    client.query({
        text : "UPDATE competitor SET competitor_standing = $6 WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5",
        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, competitor_number, standing]
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
            console.log("Set the standing for competitor #" + competitor_number + " at " + standing);
            console.log("index "+index+" length "+length+" canEnd "+canEnd);
            if (index == length && canEnd) {
                console.log("BYE");
                client.query("COMMIT");
                done();
                res.status(201).send("Score submitted");
                log.info({
                    res : res
                }, 'done response');
            }
        }
    });
}

function updateStandingForListOfCompetitors(req, res, client, done, log, competitors, standing, index, length) {
    for (var i = 0; i < competitors.length; i++) {
        console.log("Going to set the standing for competitor #" + competitors[i].competitor_number + " at " + standing);
        updateStandingForOneCompetitor(req, res, client, done, log, competitors[i].competitor_number, standing, i, (competitors.length-1), (index == length));
    }
}

function getLosers(req, res, client, done, log, tournament_format, rounds, whereTheLosersAt) {
    var standing = 3;
    console.log("Hello!");
    console.log(rounds.length);
    for (var i = 0, index = 0; i < rounds.length; i++) {
        console.log("Getting the losers from round: " + rounds[i].round_number + " of " + whereTheLosersAt);
        var query = client.query({
            text: "SELECT competes.competitor_number FROM competes WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_number = $5 AND competes.round_of = $6 AND (competes.competitor_number NOT IN (SELECT competitor_number FROM competes JOIN competitor_goes_to ON competes.event_name = competitor_goes_to.event_name AND competes.event_start_date = competitor_goes_to.event_start_date AND competes.event_location = competitor_goes_to.event_location AND competes.tournament_name = competitor_goes_to.tournament_name AND competes.round_number = competitor_goes_to.future_round_number AND competes.round_of = competitor_goes_to.future_round_of AND competes.match_number = competitor_goes_to.future_match WHERE competitor_goes_to.is_winner AND competitor_goes_to.future_round_number = $7 AND competitor_goes_to.future_round_of = $8)) ORDER BY competes.round_number DESC, competes.match_number",
            values: [req.params.event, req.query.date, req.query.location, req.params.tournament, rounds[i].round_number, whereTheLosersAt, ((tournament_format === "Double Elimination" && !i) ? req.params.round : (rounds[i].round_number+1)), ((tournament_format === "Double Elimination" && !i) ? "Winner" : whereTheLosersAt)]
        });
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on('error', function (error) {
            client.query("ROLLBACK");
            done();
            console.log(error);
            res.status(500).send(error);
            log.info({
                res: res
            }, 'done response');
        });
        query.on("end", function (result) {
            updateStandingForListOfCompetitors(req, res, client, done, log, result.rows, standing, index++, (rounds.length-1));
            console.log("Going to update the value for the standing currently at " + standing);
            standing += result.rows.length;
            console.log("Updated the value for the standing to " + standing);
        });
        console.log("i: "+i);
    }
}

//TODO check for compliance between the score in the body and the score_type of the Tournament
//TODO Check for round_pause
var submitScore = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        // And so it begins
        client.query("BEGIN");
        //console.log(req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of);
        /**
         * This is a multiple purpose query.
         * If it returns an empty array, it means the event was not found.
         * Else, it will return some useful details about the tournament that will be used later in the function
         */
        var query = client.query({
            text : "SELECT score_type, number_of_people_per_group, amount_of_winners_per_group, round_best_of, tournament_format, station_number FROM event NATURAL JOIN tournament NATURAL JOIN round NATURAL JOIN match LEFT OUTER JOIN is_played_in ON match.event_name = is_played_in.event_name AND match.event_start_date = is_played_in.event_start_date AND match.event_location = is_played_in.event_location AND match.tournament_name = is_played_in.tournament_name AND match.round_number = is_played_in.round_number AND match.round_of = is_played_in.round_of AND match.match_number = is_played_in.match_number WHERE match.event_name = $1 AND match.event_start_date = $2 AND match.event_location = $3 AND match.tournament_name = $4 AND match.round_number = $5 AND match.round_of = $6 AND match.match_number = $7 AND event.event_active",
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
            //console.log(result);
            if (result.rows.length) {
                // Store the details of this first query for later use
                var details = result.rows[0];
                // Check if user can submit score
                var query = client.query({
                    text : "SELECT competes.competitor_number, (submits.score IS NULL AND NOT is_set.set_completed) AS can_submit_score FROM is_set JOIN competes ON is_set.event_name = competes.event_name AND is_set.event_start_date = competes.event_start_date AND is_set.event_location = competes.event_location AND is_set.tournament_name = competes.tournament_name AND is_set.round_number = competes.round_number AND is_set.round_of = competes.round_of AND is_set.match_number = competes.match_number JOIN is_a ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number LEFT OUTER JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number AND submits.set_seq = is_set.set_seq WHERE is_set.event_name = $1 AND is_set.event_start_date = $2 AND is_set.event_location = $3 AND is_set.tournament_name = $4 AND is_set.round_number = $5 AND is_set.round_of = $6 AND is_set.match_number = $7 AND is_set.set_seq = $8 AND is_a.customer_username = $9",
                    values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.params.set, req.user.username]
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
                    if (result.rows.length && result.rows[0].can_submit_score) {
                        details.competitor_number = result.rows[0].competitor_number;
                        if (!isNaN(req.body.score)) {
                            // Get opponent's score
                            /*
                             * Before inserting the score, we must check to see if our opponent has submited his own score and compare it.
                             * If the scores are the same (i.e., both say they won, score = 1), then send a 409 (Conflict) and explain the situation in the body
                             */
                            var query = client.query({
                                text : "SELECT competes.competitor_number, submits.score FROM is_set JOIN competes ON is_set.event_name = competes.event_name AND is_set.event_start_date = competes.event_start_date AND is_set.event_location = competes.event_location AND is_set.tournament_name = competes.tournament_name AND is_set.round_number = competes.round_number AND is_set.round_of = competes.round_of AND is_set.match_number = competes.match_number JOIN is_a ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number AND submits.set_seq = is_set.set_seq WHERE is_set.event_name = $1 AND is_set.event_start_date = $2 AND is_set.event_location = $3 AND is_set.tournament_name = $4 AND is_set.round_number = $5 AND is_set.round_of = $6 AND is_set.match_number = $7 AND is_set.set_seq = $8 AND is_a.customer_username <> $9",
                                values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.params.set, req.user.username]
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
                                    if (result.rows[0].score == req.body.score) {
                                        client.query("ROLLBACK");
                                        done();
                                        res.status(409).send('Your opponent submitted the same score as you');
                                        log.info({
                                            res : res
                                        }, 'done response');
                                    } else {
                                        // No conflicts were detected so lets go ahead and submit the score and mark the set as completed
                                        client.query({
                                            text : "INSERT INTO submits (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, competitor_number, score) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                                            values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.params.set, details.competitor_number, req.body.score]
                                        }, function(err, result) {
                                            if (err) {
                                                client.query("ROLLBACK");
                                                done();
                                                console.log(err);
                                                res.status(500).send(err);
                                                log.info({
                                                    res : res
                                                }, 'done response');
                                            } else {
                                                // Since both competitors have successfully submitted their scores, the set is now completed
                                                client.query({
                                                    text : "UPDATE is_set SET set_completed = true WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7 AND set_seq = $8",
                                                    values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.params.set]
                                                }, function(err, result) {
                                                    if (err) {
                                                        client.query("ROLLBACK");
                                                        done();
                                                        console.log(err);
                                                        res.status(500).send(err);
                                                        log.info({
                                                            res : res
                                                        }, 'done response');
                                                    } else {
                                                        /*
                                                         * Now that the set has been marked completed, the domino effect begins.
                                                         * Worst case scenario:
                                                         * 		Completing this Set, completes the Match, which then completes the Round,
                                                         * 		which in effect completes the Group Stage. The server then has to calulate
                                                         * 		the winners of each Group and allocate them in their respective matches in
                                                         * 		the Final Stage.
                                                         */
                                                        var query = client.query({
                                                            text : "SELECT competes.competitor_number, sum(submits.score) AS score FROM is_set JOIN competes ON is_set.event_name = competes.event_name AND is_set.event_start_date = competes.event_start_date AND is_set.event_location = competes.event_location AND is_set.tournament_name = competes.tournament_name AND is_set.round_number = competes.round_number AND is_set.round_of = competes.round_of AND is_set.match_number = competes.match_number JOIN is_a ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number LEFT OUTER JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number AND submits.set_seq = is_set.set_seq WHERE is_set.event_name = $1 AND is_set.event_start_date = $2 AND is_set.event_location = $3 AND is_set.tournament_name = $4 AND is_set.round_number = $5 AND is_set.round_of = $6 AND is_set.match_number = $7 GROUP BY competes.competitor_number",
                                                            values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
                                                        });
                                                        query.on("row", function(row, result) {
                                                            //console.log(row);
                                                            //console.log(!isNaN(row.score), ((details.round_best_of + 1) / row.score) == row.score);
                                                            if (!isNaN(row.score) && ((details.round_best_of + 1) / row.score) == row.score) {
                                                                // Update set_completed for other the rest of the sets
                                                                for (var i = 0; i < (details.round_best_of - row.score); i++) {
                                                                    updateSetCompleted(req, res, log, client, done, (i + 1), ((details.round_best_of - row.score) - 1));
                                                                }
                                                            }
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
                                                            // Check if match is completed
                                                            var query = client.query({
                                                                text : "SELECT every(is_set.set_completed) as match_completed FROM is_set JOIN competes ON is_set.event_name = competes.event_name AND is_set.event_start_date = competes.event_start_date AND is_set.event_location = competes.event_location AND is_set.tournament_name = competes.tournament_name AND is_set.round_number = competes.round_number AND is_set.round_of = competes.round_of AND is_set.match_number = competes.match_number JOIN is_a ON is_a.event_name = competes.event_name AND is_a.event_start_date = competes.event_start_date AND is_a.event_location = competes.event_location AND is_a.tournament_name = competes.tournament_name AND is_a.competitor_number = competes.competitor_number WHERE is_set.event_name = $1 AND is_set.event_start_date = $2 AND is_set.event_location = $3 AND is_set.tournament_name = $4 AND is_set.round_number = $5 AND is_set.round_of = $6 AND is_set.match_number = $7 AND is_a.customer_username = $8",
                                                                values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.user.username]
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
                                                                /*
                                                                 * Domino #1 : There are no sets left to play in this match
                                                                 * Now we must:
                                                                 * 		#1. Calculate the outcome of this match (who won/lost) and assign the competitors to their next match if necessary
                                                                 * 		#2. Check and see if Domino #2 falls (this was the last match of the round)
                                                                 */
                                                                if (result.rows.length && result.rows[0].match_completed) {
                                                                    // Get the info for the two competitors of this match
                                                                    var query = client.query({
                                                                        text : "SELECT competes.competitor_number, sum(submits.score) AS score FROM competes LEFT OUTER JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_number = $5 AND competes.round_of = $6 AND competes.match_number = $7 GROUP BY competes.competitor_number ORDER BY score DESC",
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
                                                                        // Store the data of the outcome of the match
                                                                        var matchOutcome = result.rows;

                                                                        // Update the matches won/lost for each competitor
                                                                        for (var i = 0; i < matchOutcome.length; i++) {
                                                                            updateCompetitor(req, res, log, client, done, matchOutcome[i], !i);
                                                                        }
                                                                        // Update match completed
                                                                        client.query({
                                                                            text : "UPDATE match SET match_completed = true WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6 AND match_number = $7",
                                                                            values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match]
                                                                        }, function(err, result) {
                                                                            if (err) {
                                                                                client.query("ROLLBACK");
                                                                                done();
                                                                                console.log(err);
                                                                                res.status(500).send(err);
                                                                                log.info({
                                                                                    res : res
                                                                                }, 'done response');
                                                                            } else {
                                                                                // Asign the station where this match was played to another match that has no station already assigned
                                                                                //TODO Check this
                                                                                var query = client.query({
                                                                                    text : "SELECT round_number, round_of, match_number FROM match WHERE (concat(round_number, round_of, match_number) NOT IN (SELECT concat(round_number, round_of, match_number) FROM is_played_in WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4)) AND (concat(round_number, round_of, match_number, 2) IN (SELECT concat(round_number, round_of, match_number,count(concat(round_number, round_of, match_number))) FROM competes WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 GROUP BY round_number, round_of, match_number)) AND event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 ORDER BY round_number, CASE WHEN round_of = 'Group' THEN 1 WHEN round_of = 'Round Robin' THEN 2 WHEN round_of = 'Winner' THEN 3 WHEN round_of = 'Loser' THEN 4 END LIMIT 1",
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
                                                                                    if (result.rows.length && details.station_number) {
                                                                                        client.query({
                                                                                            text : "INSERT INTO is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                                                                                            values : [req.params.event, req.query.date, req.query.location, req.params.tournament, result.rows[0].round_number, result.rows[0].round_of, result.rows[0].match_number, details.station_number]
                                                                                        }, function (err, result) {
                                                                                            if (err) {
                                                                                                client.query("ROLLBACK");
                                                                                                done();
                                                                                                console.log(err);
                                                                                                res.status(500).send(err);
                                                                                                log.info({
                                                                                                    res: res
                                                                                                }, 'done response');
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                                // Check if round is completed
                                                                                var query = client.query({
                                                                                    text : "SELECT every(match_completed) AS round_completed FROM match WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6",
                                                                                    values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of]
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
                                                                                    /*
                                                                                     * Domino #2 : There are no matches left to play in this round
                                                                                     * Did I mention that the dominoes become bigger?
                                                                                     * Now we must check to see if there are any matches left to play in this stage.
                                                                                     * If all rounds have been completed, we must perform different actions depending on which stage ended.
                                                                                     */
                                                                                    if (result.rows.length && result.rows[0].round_completed) {
                                                                                        client.query({
                                                                                            text : "UPDATE round SET round_completed = true WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_number = $5 AND round_of = $6",
                                                                                            values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of]
                                                                                        }, function(err, result) {
                                                                                            if (err) {
                                                                                                client.query("ROLLBACK");
                                                                                                done();
                                                                                                console.log(err);
                                                                                                res.status(500).send(err);
                                                                                                log.info({
                                                                                                    res : res
                                                                                                }, 'done response');
                                                                                            } else {
                                                                                                /*
                                                                                                 * The stage we're at is indicated by the value of the round_of parameter.
                                                                                                 * We need to know if this round that was just completed was the last round of it's stage.
                                                                                                 * A good thing is that the queries become shorter as we progress, but don't get too comfortable,
                                                                                                 * there is a storm coming, especially if the stage that ended was
                                                                                                 * either the Group Stage or the Winners bracket. Keep scrolling down to watch the next episode.
                                                                                                 */
                                                                                                var query = client.query({
                                                                                                    text : "SELECT every(round_completed) AS stage_completed FROM round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_of = $5",
                                                                                                    values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.query.round_of]
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
                                                                                                    /*
                                                                                                     * Domino #3 : There are no rounds left to play in this Stage
                                                                                                     * Yup, we're finally here, the last and heaviest domino.
                                                                                                     * So, there are a few possible outcomes here, and it all depends on which Stage ended.
                                                                                                     * Lets write all possible outcomes bellow:
                                                                                                     *
                                                                                                     * 	Loser Bracket ended: Nothing. Ez amiright?
                                                                                                     * 		The loser finalist has already been placed in the Winers final match and no further action is needed at the moment.
                                                                                                     *
                                                                                                     * 	Group Stage ended: We need to calculate the standings of each player, in each group, and look for the value of ammount of winners per group. If there are player tied for 1st place in a group, we need to look for their match and whoever won takes the first place. We have to arrange the winners seeding based on the group each player was in and what was their placing in that group. After this, we use my algorithm to place the winners in their respective matches. Phew, that doesn't seem like much, does it?
                                                                                                     *
                                                                                                     * 	Winners Bracket ended or Round Robin Stage ended: Right, so this basically means the tournament ended. But what does it mean when we say the tournament ended? Well, we have to give players a way to brag, right? So we have to calculate their standing. Ez... is it? If only it was as simple as calculating their matches won and lost, and whatever. It's not (at least not for brackets). We have to know the size of the bracket and the last round the competitor played. I haven't yet thought this through completelly but yeah, ain't dis a bitch.
                                                                                                     */
                                                                                                    if (result.rows.length && result.rows[0].stage_completed) {
                                                                                                        // Eziest
                                                                                                        if (req.query.round_of === "Loser") {
                                                                                                            client.query("COMMIT");
                                                                                                            done();
                                                                                                            res.status(201).send("Score submitted");
                                                                                                            log.info({
                                                                                                                res : res
                                                                                                            }, 'done response');
                                                                                                        } else if (req.query.round_of === "Group") {
                                                                                                            // Prepare an array to store the winners of each Group
                                                                                                            var winners = new Array();
                                                                                                            var query = client.query({
                                                                                                                text : 'SELECT group_number FROM "group" WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 ORDER BY group_number',
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
                                                                                                                var numOfGroups = result.rows.length;
                                                                                                                for (var i = 0; i < result.rows.length; i++) {
                                                                                                                    /**
                                                                                                                     * Get the winners for each Group
                                                                                                                     *
                                                                                                                     * Postgres allows us to set two or more parameters on an ORDER BY. When there are two or more values equivalent in the first parameter
                                                                                                                     * the second one is used to determine the order (and so on).
                                                                                                                     */
                                                                                                                    var query = client.query({
                                                                                                                        text : "SELECT competitor_number FROM competitor NATURAL JOIN is_in WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND group_number = $5 ORDER BY matches_won DESC, competitor_seed ASC LIMIT $6",
                                                                                                                        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, result.rows[i].group_number, details.amount_of_winners_per_group]
                                                                                                                    });
                                                                                                                    query.on("row", function(row, result) {
                                                                                                                        // Store the winners of each group in our winners array
                                                                                                                        winners.push(row);
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
                                                                                                                        console.log("winners in on end: "+winners.length);
                                                                                                                        // All the work was done in the on.row, so this function is here for consistency
                                                                                                                        if (winners.length > (details.amount_of_winners_per_group*numOfGroups) - details.amount_of_winners_per_group) {
                                                                                                                            if (details.tournament_format === "Single Elimination" || details.tournament_format === "Double Elimination") {
                                                                                                                                console.log("Here!");
                                                                                                                                // Calculate the byes for the Bracket Stage
                                                                                                                                var byes = Math.pow(2, Math.ceil(Math.log(winners.length) / Math.log(2))) - winners.length;
                                                                                                                                console.log("byes: " + byes);
                                                                                                                                // Assign the winners to their respective matches in the Winners Bracket of the Final Stage
                                                                                                                                for (var i = 0; i < (winners.length - byes) / 2; i++) {
                                                                                                                                    competes(req, res, client, done, log, winners[byes + i].competitor_number, 1, i+1, "Winner", byes, i, ((winners.length - byes) / 2));
                                                                                                                                    competes(req, res, client, done, log, winners[winners.length - i - 1].competitor_number, 1, i+1, "Winner", byes, i, ((winners.length - byes) / 2) - 1);
                                                                                                                                }

                                                                                                                                if (byes) {
                                                                                                                                    // Assign players to Winners Round 2 matches
                                                                                                                                    var count = 0;
                                                                                                                                    for (var i = 0; i < byes; i++) {
                                                                                                                                        if (i < (getNumOfPlayersForNextWinnersRound(winners.length) / 2)) {
                                                                                                                                            competes(req, res, client, done, log, winners[i].competitor_number, 2, i+1, "Winner", !byes, i, byes - 1);
                                                                                                                                        } else {
                                                                                                                                            count++;
                                                                                                                                            competes(req, res, client, done, log, winners[i].competitor_number, 2, (i - count)+1, "Winner", !byes, i, byes - 1);
                                                                                                                                            count++;
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                // Assign the winners to their respective matches in the Round Robin Final Stage
                                                                                                                                var numOfRounds = (!(winners.length % 2)) ? (winners.length - 1) : winners.length;
                                                                                                                                var numOfMatchesPerRound = Math.floor(winners.length / 2);
                                                                                                                                var l = 0;
                                                                                                                                for (var j = 0; j < numOfRounds; j++) {
                                                                                                                                    if (!(winnerslength % 2)) {
                                                                                                                                        var count = 0;
                                                                                                                                        for (var l = 0; l < numOfMatchesPerRound * 2; l++) {
                                                                                                                                            if (!l) {
                                                                                                                                                competes(req, res, client, done, log, winners[l].competitor_number, j, l, "Round Robin", false, (j*numOfMatchesPerRound) + l, (numOfRounds*numOfMatchesPerRound) - 1);
                                                                                                                                            } else if (l < numOfMatchesPerRound) {
                                                                                                                                                competes(req, res, client, done, log, winners[(!((j + l) % winners.length) ? (j + l + ++count) % winners.length : (j + l + count) % winners.length)].competitor_number, j, l, "Round Robin", false, (j*numOfMatchesPerRound) + l, (numOfRounds*numOfMatchesPerRound) - 1);
                                                                                                                                            } else {
                                                                                                                                                competes(req, res, client, done, log, winners[(!((j + l) % winners.length) ? (j + l + ++count) % winners.length : (j + l + count) % winners.length)].competitor_number, j, (numOfMatchesPerRound * 2) - l - 1, "Round Robin", false, (j*numOfMatchesPerRound) + l, (numOfRounds*numOfMatchesPerRound) - 1);
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        for (var l = 0; l < numOfMatchesPerRound * 2; l++) {
                                                                                                                                            if (l < numOfMatchesPerRound) {
                                                                                                                                                competes(req, res, client, done, log, winners[(j + l) % winners.length].competitor_number, j, l, "Round Robin", false, (j*numOfMatchesPerRound) + l, (numOfRounds*numOfMatchesPerRound) - 1);
                                                                                                                                            } else {
                                                                                                                                                competes(req, res, client, done, log, winners[(j + l) % winners.length].competitor_number, j, (numOfMatchesPerRound * 2) - l - 1, "Round Robin", false, (j*numOfMatchesPerRound) + l, (numOfRounds*numOfMatchesPerRound) - 1);
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            });
                                                                                                        } else if (req.query.round_of === "Winner") {
                                                                                                            // Look for the finalists of the Winners Bracket
                                                                                                            var query = client.query({
                                                                                                                text : "SELECT competes.competitor_number, competitor.matches_lost, sum(submits.score) AS score FROM competes JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number JOIN competitor ON competitor.event_name = competes.event_name AND competitor.event_start_date = competes.event_start_date AND competitor.event_location = competes.event_location AND competitor.tournament_name = competes.tournament_name AND competitor.competitor_number = competes.competitor_number WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_of = 'Winner' AND competes.round_number = (SELECT max(round_number) FROM round WHERE round_of = 'Winner' AND event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4) GROUP BY competes.competitor_number, competitor.matches_lost ORDER BY score DESC",
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
                                                                                                                /**
                                                                                                                 * If both players have lost the same amount of matches, that means that the undefeated player lost his first match.
                                                                                                                 * This means that we are in a Double Elimination Bracket (In a Single Elimination Bracket, when you lose, you don't play any more matches, hence no two players of a specific match can have the same number of matches lost. We still perform the check to be consistent and buletproof).
                                                                                                                 * In a Double Elimination Bracket, a player is eliminated after losing two matches. This also applies in the Final match.
                                                                                                                 * We must create another round with a single match, where these two players face of again to determine the winner.
                                                                                                                 *
                                                                                                                 * If both players have a different of matches lost, this means that we have a winner and a loser. and can proceed to calculate the standings
                                                                                                                 */
                                                                                                                if (result.rows[0].matches_lost == result.rows[1].matches_lost && details.tournament_format === "Double Elimination") {
                                                                                                                    var competitorInfo = result.rows;
                                                                                                                    // Create the extra round
                                                                                                                    client.query({
                                                                                                                        text : "INSERT INTO round (event_name, event_start_date, event_location, tournament_name, round_number, round_of, round_start_date, round_pause, round_completed, round_best_of) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                                                                                                                        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, (parseInt(req.params.round)+1), "Winner", (new Date()).toUTCString(), false, false, details.round_best_of]
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
                                                                                                                            // Create the extra match
                                                                                                                            client.query({
                                                                                                                                text : "INSERT INTO match (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, is_favourite, match_completed) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                                                                                                                                values : [req.params.event, req.query.date, req.query.location, req.params.tournament, (parseInt(req.params.round)+1), "Winner", 1, true, false]
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
                                                                                                                                    // Assign one of the players to the extra match
                                                                                                                                    client.query({
                                                                                                                                        text : "INSERT INTO competes (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                                                                                                                                        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, (parseInt(req.params.round)+1), "Winner", 1, competitorInfo[0].competitor_number]
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
                                                                                                                                            // Assign the other player to the extra match
                                                                                                                                            client.query({
                                                                                                                                                text : "INSERT INTO competes (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                                                                                                                                                values : [req.params.event, req.query.date, req.query.location, req.params.tournament, (parseInt(req.params.round)+1), "Winner", 1, competitorInfo[1].competitor_number]
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
                                                                                                                                                    // Assign the sets to the extra match
                                                                                                                                                    for (var i = 0; i < details.round_best_of; i++) {
                                                                                                                                                        is_set(req, res, client, done, log, (parseInt(req.params.round)+1), "Winner", 1, (i+1), details.station_number, i, (parseInt(details.round_best_of) -1))
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    });
                                                                                                                } else {
                                                                                                                    /**
                                                                                                                     * Calculate the standings for each player.
                                                                                                                     *
                                                                                                                     * Start with the first and second place.
                                                                                                                     * Then go through the rounds where people would have played their last match.
                                                                                                                     *      If Double Elimination: all Loser Bracket Rounds
                                                                                                                     *      Else, all Winner Bracket Rounds not including the last one
                                                                                                                     */
                                                                                                                    var query = client.query({
                                                                                                                        text : "SELECT competes.competitor_number, sum(submits.score) AS score FROM competes JOIN submits ON submits.event_name = competes.event_name AND submits.event_start_date = competes.event_start_date AND submits.event_location = competes.event_location AND submits.tournament_name = competes.tournament_name AND submits.competitor_number = competes.competitor_number AND submits.round_number = competes.round_number AND submits.round_of = competes.round_of AND submits.match_number = competes.match_number JOIN competitor ON competitor.event_name = competes.event_name AND competitor.event_start_date = competes.event_start_date AND competitor.event_location = competes.event_location AND competitor.tournament_name = competes.tournament_name AND competitor.competitor_number = competes.competitor_number WHERE competes.event_name = $1 AND competes.event_start_date = $2 AND competes.event_location = $3 AND competes.tournament_name = $4 AND competes.round_of = 'Winner' AND competes.round_number = (SELECT max(round_number) FROM round WHERE round_of = 'Winner' AND event_name = $1 AND event_start_date = $2  AND event_location = $3 AND tournament_name = $4) GROUP BY competes.competitor_number, competitor.matches_lost ORDER BY score DESC",
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
                                                                                                                        var winners = result.rows;
                                                                                                                        client.query({
                                                                                                                            text : "UPDATE competitor SET competitor_standing = $6 WHERE event_name = $1 AND event_start_date = $2  AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5",
                                                                                                                            values : [req.params.event, req.query.date, req.query.location, req.params.tournament, winners[0].competitor_number, 1]
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
                                                                                                                                client.query({
                                                                                                                                    text : "UPDATE competitor SET competitor_standing = $6 WHERE event_name = $1 AND event_start_date = $2  AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5",
                                                                                                                                    values : [req.params.event, req.query.date, req.query.location, req.params.tournament, winners[1].competitor_number, 2]
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
                                                                                                                                        var whereTheLosersAt = "";
                                                                                                                                        var queryText = "";
                                                                                                                                        if (details.tournament_format === "Double Elimination") {
                                                                                                                                            whereTheLosersAt = "Loser";
                                                                                                                                            queryText = "SELECT round_number FROM round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_of = 'Loser' ORDER BY round_number DESC";
                                                                                                                                        } else {
                                                                                                                                            whereTheLosersAt = "Winner";
                                                                                                                                            queryText = "SELECT round_number FROM round WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_of = 'Winner' AND round_number <> (SELECT max(round_number) FROM round WHERE round_of = 'Winner' AND event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4) ORDER BY round_number DESC";
                                                                                                                                        }

                                                                                                                                        // Check for 3rd place and so on
                                                                                                                                        var query = client.query({
                                                                                                                                            text : queryText,
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
                                                                                                                                            // round_number, round_of
                                                                                                                                            getLosers(req, res, client, done, log, details.tournament_format, result.rows, whereTheLosersAt);
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                        });
                                                                                                                    });
                                                                                                                }
                                                                                                            });
                                                                                                        } else {
                                                                                                            // Round Robin standings are
                                                                                                            var query = client.query({
                                                                                                                text : "SELECT competitor_number FROM competitor NATURAL JOIN competes WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND round_of = 'Round Robin' ORDER BY matches_won DESC, competitor_seed ASC",
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
                                                                                                                for (var i = 0 ; i < result.rows.length; i++) {
                                                                                                                    updateStandingForOneCompetitor(req, res, client, done, log, result.rows[i].competitor_number, (i+1), i, (result.rows.length), true);
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    } else {
                                                                                                        client.query("COMMIT");
                                                                                                        done();
                                                                                                        res.status(201).send("Score submitted");
                                                                                                        log.info({
                                                                                                            res : res
                                                                                                        }, 'done response');
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        client.query("COMMIT");
                                                                                        done();
                                                                                        res.status(201).send("Score submitted");
                                                                                        log.info({
                                                                                            res : res
                                                                                        }, 'done response');
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                } else {
                                                                    client.query("COMMIT");
                                                                    done();
                                                                    res.status(201).send("Score submitted");
                                                                    log.info({
                                                                        res : res
                                                                    }, 'done response');
                                                                }
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    // Go ahead and submit the score, Everything else will happen when the opponent tries to submit his score
                                    client.query({
                                        text : "INSERT INTO submits (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, competitor_number, score) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                                        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.round, req.query.round_of, req.params.match, req.params.set, details.competitor_number, req.body.score]
                                    }, function(err, result) {
                                        if (err) {
                                            client.query("ROLLBACK");
                                            done();
                                            console.log(err);
                                            res.status(500).send(err);
                                            log.info({
                                                res : res
                                            }, 'done response');
                                        } else {
                                            client.query("COMMIT");
                                            done();
                                            res.status(201).send("Score submitted");
                                            log.info({
                                                res : res
                                            }, 'done response');
                                        }
                                    });
                                }
                            });
                        } else {
                            client.query("ROLLBACK");
                            done();
                            res.status(400).json({
                                error : "Incomplete or invalid parameters"
                            });
                            log.info({
                                res : res
                            }, 'done response');
                        }
                    } else {
                        client.query("ROLLBACK");
                        done();
                        res.status(403).send("You can't submit score");
                        log.info({
                            res : res
                        }, 'done response');
                    }
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(404).send("Couldn't find the event: " + req.params.event + " starting on: " + req.query.date + " located at: " + req.query.location);
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

//TODO Validate date
// DEPRECIATED
var getParticipants = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var queryText = "SELECT distinct customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic FROM event ";
        var queryJoinCustomer = "JOIN customer ON ";

        if (req.query.competitors) {
            queryText += "JOIN is_a ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location ";
            queryJoinCustomer += "customer.customer_username = is_a.customer_username ";
            if (req.query.spectators) {
                queryJoinCustomer += "OR ";
            }
        }
        if (req.query.spectators) {
            queryText += "JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location ";
            queryJoinCustomer += "customer.customer_username = pays.customer_username ";
        }
        if (!req.query.competitors && !req.query.spectators) {
            queryText += "JOIN is_a ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location ";
            queryJoinCustomer += "customer.customer_username = is_a.customer_username OR customer.customer_username = pays.customer_username ";
        }

        queryText += (queryJoinCustomer + "WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3");

        var query = client.query({
            text : queryText,
            values : [req.params.event, req.query.date, req.query.location]
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
            done();
            res.status(200).json(result.rows);
            log.info({
                res : res
            }, 'done response');
        });
    });
};

//TODO Validate Date
//TODO Validate Undefined
var getCompetitors = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var query = client.query({
            text : "SELECT distinct customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic, tournament.competitor_fee, competitor.competitor_check_in AS checked_in, competitor.competitor_seed, competitor.competitor_number FROM tournament JOIN is_a ON is_a.event_name = tournament.event_name AND is_a.event_start_date = tournament.event_start_date AND is_a.event_location = tournament.event_location AND is_a.tournament_name = tournament.tournament_name JOIN competitor ON is_a.event_name = competitor.event_name AND is_a.event_start_date = competitor.event_start_date AND is_a.event_location = competitor.event_location AND is_a.tournament_name = competitor.tournament_name AND is_a.competitor_number = competitor.competitor_number JOIN customer ON customer.customer_username = is_a.customer_username WHERE tournament.event_name = $1 AND tournament.event_start_date = $2 AND tournament.event_location = $3 AND tournament.tournament_name = $4 ORDER BY competitor.competitor_seed",
            values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
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
            done();
            res.status(200).json(result.rows);
            log.info({
                res : res
            }, 'done response');
        });
    });
};

//TODO Validate date 400
//TODO Validate Undefined
var getEventSpectators = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var query = client.query({
            text : "SELECT distinct customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic, pays.spec_fee_name, pays.check_in FROM event JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location JOIN customer ON customer.customer_username = pays.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3",
            values : [req.params.event, req.query.date, req.query.location]
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
            done();
            res.status(200).json(result.rows);
            log.info({
                res : res
            }, 'done response');
        });
    });
};

var getStationsForEvent = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var event = new Object();
        var query = client.query({
            text : "SELECT station.station_number, station.station_in_use, stream.stream_link FROM station LEFT OUTER JOIN stream ON station.event_name = stream.event_name AND station.event_start_date = stream.event_start_date AND station.event_location = stream.event_location AND station.station_number = stream.station_number WHERE station.event_name = $1 AND station.event_start_date = $2 AND station.event_location = $3",
            values : [req.params.event, req.query.date, req.query.location]
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
            done();
            res.status(200).json(result.rows);
            log.info({
                res : res
            }, 'done response');
        });
    });
};

var checkInSpectator = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, date.toUTCString(), req.query.location, req.user.username]
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
                    client.query({
                        text : "UPDATE pays SET check_in = NOT check_in WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4",
                        values : [req.params.event, req.query.date, req.query.location, req.params.username]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send(err);
                            log.info({
                                res : res
                            }, 'done response');
                        } else {
                            client.query("COMMIT");
                            done();
                            res.status(200).send("Updated");
                            log.info({
                                res : res
                            }, 'done response');
                        }
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't check-in people for this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var checkInCompetitor = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, date.toUTCString(), req.query.location, req.user.username]
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
                    client.query({
                        text : "UPDATE competitor SET competitor_check_in = NOT competitor_check_in WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5",
                        values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.competitor]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send(err);
                            log.info({
                                res : res
                            }, 'done response');
                        } else {
                            client.query("COMMIT");
                            done();
                            res.status(200).send("Updated");
                            log.info({
                                res : res
                            }, 'done response');
                        }
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't check-in people for this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var addStation = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, date.toUTCString(), req.query.location, req.user.username]
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
                    var query = client.query({
                        text : "SELECT max(station_number)+1 AS next_station FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
                        values : [req.params.event, req.query.date, req.query.location]
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
                        var next_station = (!(result.rows[0].next_station) ? 1 : result.rows[0].next_station);
                        client.query({
                            text : "INSERT INTO station (event_name, event_start_date, event_location, station_number) VALUES($1, $2, $3, $4)",
                            values : [req.params.event, req.query.date, req.query.location, next_station]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                                log.info({
                                    res : res
                                }, 'done response');
                            } else {
                                client.query("COMMIT");
                                done();
                                var station = new Object();
                                station.event = new Object();
                                station.event.name = req.params.event;
                                station.event.date = req.query.date;
                                station.event.location = req.query.location;
                                station.number = next_station;
                                res.status(201).json(station);
                                log.info({
                                    res : res
                                }, 'done response');
                            }
                        });
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't add stations to this event");
                }
            });
        }
    });
};

var removeStation = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                client.query({
                    text : "DELETE FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.query.station]
                }, function(err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        done();
                        res.status(500).send(err);
                        log.info({
                            res : res
                        }, 'done response');
                    } else {
                        client.query("COMMIT");
                        done();
                        res.status(204).send('');
                        log.info({
                            res : res
                        }, 'done response');
                    }
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't remove stations from this event");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

var getStation = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var station = new Object();
        var query = client.query({
            text : "SELECT station.station_number, station.station_in_use, stream.stream_link FROM station LEFT OUTER JOIN stream ON station.event_name = stream.event_name AND station.event_start_date = stream.event_start_date AND station.event_location = stream.event_location AND station.station_number = stream.station_number WHERE station.event_name = $1 AND station.event_start_date = $2 AND station.event_location = $3 AND station.station_number = $4",
            values : [req.params.event, req.query.date, req.query.location, req.params.station]
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
                station = result.rows[0];
                station.tournaments = new Array();
                var query = client.query({
                    text : "SELECT tournament_name FROM capacity_for WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.params.station]
                });
                query.on("row", function(row, result) {
                    station.tournaments.push(row.tournament_name);
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
                    // station.tournaments = result.rows;
                    client.query("COMMIT");
                    done();
                    res.status(200).json(station);
                    log.info({
                        res : res
                    }, 'done response');
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(404).send("Station not found");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

//TODO Update API
var addStream = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                var query = client.query({
                    text : "SELECT station_number FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.params.station]
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
                        client.query({
                            text : "INSERT INTO stream (event_name, event_start_date, event_location, station_number, stream_link) VALUES($1, $2, $3, $4, $5)",
                            values : [req.params.event, req.query.date, req.query.location, req.params.station, req.body.stream]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                                log.info({
                                    res : res
                                }, 'done response');
                            } else {
                                client.query("COMMIT");
                                done();
                                var station = new Object();
                                station.event = new Object();
                                station.event.name = req.params.event;
                                station.event.date = req.query.date;
                                station.event.location = req.query.location;
                                station.number = req.params.station;
                                res.status(201).json(station);
                                log.info({
                                    res : res
                                }, 'done response');
                            }
                        });
                    } else {
                        client.query("ROLLBACK");
                        done();
                        res.status(404).send("Station not found");
                        log.info({
                            res : res
                        }, 'done response');
                    }
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't add streams in this event");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
    //pg.end();
};

//TODO Validate date
//TODO Update API
var editStation = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                client.query({
                    text : "UPDATE stream SET stream_link = $5 WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.params.station, req.body.stream]
                }, function(err, result) {
                    done();
                    if (err) {
                        client.query("ROLLBACK");
                        done();
                        res.status(500).send("Oh, no! Disaster!");
                    } else {
                        client.query("COMMIT");
                        done();
                        var station = new Object();
                        station.event = new Object();
                        station.event.name = req.params.event;
                        station.event.date = req.query.date;
                        station.event.location = req.query.location;
                        station.number = req.params.station;
                        res.status(200).json(station);
                    }
                    log.info({
                        res : res
                    }, 'done response');
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't edit stations in this event");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

//TODO Verify event_start_date
var removeStream = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                client.query({
                    text : "DELETE FROM stream WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.params.station]
                }, function(err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        done();
                        res.status(500).send(err);
                    } else {
                        client.query("COMMIT");
                        done();
                        res.status(204).send('');
                    }
                    log.info({
                        res : res
                    }, 'done response');
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't remove streams in this event");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
    //pg.end();
};

//TODO Verify event_start_date
var getTournaments = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var query = client.query({
            text : "SELECT tournament_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, game.* FROM tournament NATURAL JOIN game WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
            values : [req.params.event, req.query.date, req.query.location]
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
            done();
            res.status(200).json(result.rows);
            log.info({
                res : res
            }, 'done response');
        });
    });
};

var getTournament = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var query = client.query({
            text : "SELECT tournament_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, game.* FROM tournament NATURAL JOIN game WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND tournament_active",
            values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
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
            done();
            if (result.rows.length) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).send("Tournament not found");
            }
            log.info({
                res : res
            }, 'done response');
        });
    });
};

var getSponsors = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var query = client.query({
            text : "SELECT sponsor_name, sponsor_logo, sponsor_link FROM sponsors NATURAL JOIN shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
            values : [req.params.event, req.query.date, req.query.location]
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
            done();
            res.status(200).json(result.rows);
            log.info({
                res : res
            }, 'done response');
        });
    });
};

var addSponsorToEvent = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                var query = client.query({
                    text : "SELECT sponsor_name FROM is_confirmed JOIN hosts ON is_confirmed.organization_name = hosts.organization_name JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND sponsor_name = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
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
                        client.query({
                            text : "INSERT INTO shows (event_name, event_start_date, event_location, sponsor_name) VALUES ($1, $2, $3, $4)",
                            values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                            } else {
                                client.query("COMMIT");
                                done();
                                res.status(201).send("Sponsor: " + req.query.sponsor + " added");
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    } else {
                        client.query("ROLLBACK");
                        done();
                        res.status(404).send(req.query.sponsor + " does not sponsor your Organization");
                        log.info({
                            res : res
                        }, 'done response');
                    }
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't add sponsors to this Event");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

var removeSponsor = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                var query = client.query({
                    text : "SELECT sponsor_name FROM shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND sponsor_name = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
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
                        client.query({
                            text : "DELETE FROM shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND sponsor_name = $4",
                            values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                            } else {
                                client.query("COMMIT");
                                done();
                                res.status(204).send('');
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    } else {
                        client.query("ROLLBACK");
                        done();
                        res.status(404).send(req.query.sponsor + " does not sponsor your Event");
                        log.info({
                            res : res
                        }, 'done response');
                    }
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't add sponsors to this Event");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

//TODO Verify dates
//TODO Transaction
var attachStation = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                var query = client.query({
                    text : "SELECT station_number FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.query.station]
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
                    if (result.rows.length) {
                        client.query({
                            text : "INSERT INTO capacity_for (event_name, event_start_date, event_location, tournament_name, station_number) VALUES($1, $2, $3, $4, $5)",
                            values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.query.station]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send("Oh, no! Disaster!");
                            } else {
                                client.query("COMMIT");
                                done();
                                res.status(201).send("Attached Station #" + req.query.station + " to " + req.params.tournament);
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    } else {
                        client.query("ROLLBACK");
                        done();
                        res.status(404).send("Station not found");
                        log.info({
                            res : res
                        }, 'done response');
                    }
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't attach stations to this tournament");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

//TODO Validate date
var getStationsforTournament = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            var query = client.query({
                text : "SELECT station.station_number, station.station_in_use, stream.stream_link FROM station LEFT OUTER JOIN stream ON station.event_name = stream.event_name AND station.event_start_date = stream.event_start_date AND station.event_location = stream.event_location AND station.station_number = stream.station_number JOIN capacity_for ON station.event_name = capacity_for.event_name AND station.event_start_date = capacity_for.event_start_date AND station.event_location = capacity_for.event_location AND station.station_number = capacity_for.station_number WHERE station.event_name = $1 AND station.event_start_date = $2 AND station.event_location = $3 AND capacity_for.tournament_name = $4",
                values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
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
                done();
                res.status(200).json(result.rows);
                log.info({
                    res : res
                }, 'done response');
            });
        }
    });
};

//TODO Validate date
var detachStation = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                client.query({
                    text : "DELETE FROM capacity_for WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND station_number = $5",
                    values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.query.station]
                }, function(err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        done();
                        res.status(500).send(err);
                    } else {
                        client.query("COMMIT");
                        done();
                        res.status(204).send('');
                    }
                    log.info({
                        res : res
                    }, 'done response');
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't remove stations from this tournament");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

var getAllNews = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
        } else {
            var query = client.query({
                text : "SELECT news_number, news_title, news_content, news_date_posted FROM news NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND event_active ORDER BY news_number DESC",
                values : [req.params.event, req.query.date, req.query.location]
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
                done();
                res.status(200).json(result.rows);
                log.info({
                    res : res
                }, 'done response');
            });
        }
    });
};

var getNews = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            var query = client.query({
                text : "SELECT news_number, news_title, news_content, news_date_posted FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4",
                values : [req.params.event, req.query.date, req.query.location, req.params.news]
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
                done();
                if (result.rows.length) {
                    res.json(result.rows[0]);
                } else {
                    res.status(404).send("News not found");
                }
                log.info({
                    res : res
                }, 'done response');
            });
        }
    });
};

var deleteNews = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    client.query({
                        text : "DELETE FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4",
                        values : [req.params.event, req.query.date, req.query.location, req.params.news]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send(err);
                        } else {
                            client.query("COMMIT");
                            done();
                            res.status(204).send('');
                        }
                        log.info({
                            res : res
                        }, 'done response');
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't delete news in this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var createNews = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    var query = client.query({
                        text : "SELECT max(news_number)+1 AS next_news FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
                        values : [req.params.event, req.query.date, req.query.location]
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
                        var nextNews = (!(result.rows[0].next_news) ? 1 : result.rows[0].next_news);
                        console.log(result.rows[0].next_news);
                        console.log(!result.rows[0].next_news);
                        client.query({
                            text : "INSERT INTO news (event_name, event_start_date, event_location, news_number, news_title, news_content, news_date_posted) VALUES($1, $2, $3, $7, $4, $5, $6)",
                            values : [req.params.event, req.query.date, req.query.location, req.body.title, req.body.content, (new Date()).toUTCString(), nextNews]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                            } else {
                                client.query("COMMIT");
                                done();
                                var news = new Object();
                                news.event = new Object();
                                news.event.name = req.params.event;
                                news.event.date = req.query.date;
                                news.event.location = req.query.location;
                                news.number = nextNews;
                                res.status(201).json(news);
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't post News to this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var updateNews = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        if (!(eventStartDate.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            // Check if the user is registered for this event
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    client.query({
                        text : "UPDATE news SET (news_title, news_content) = ($5, $6) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4",
                        values : [req.params.event, req.query.date, req.query.location, req.params.news, req.body.title, req.body.content]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send(err);
                        } else {
                            client.query("COMMIT");
                            done();
                            var news = new Object();
                            news.event = new Object();
                            news.event.name = req.params.event;
                            news.event.date = req.query.date;
                            news.event.location = req.query.location;
                            news.number = req.params.news;
                            res.status(200).json(news);
                        }
                        log.info({
                            res : res
                        }, 'done response');
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't update news for this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var getReviews = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            var query = client.query({
                text : "SELECT review_title, review_content, star_rating, review_date_created, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, bool_and(customer_username IN (SELECT customer_username FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4)) as is_writer FROM review NATURAL JOIN customer WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 GROUP BY review_title, review_content, star_rating, review_date_created, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic ORDER BY review_date_created DESC",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                done();
                res.status(200).json(result.rows);
                log.info({
                    res : res
                }, 'done response');
            });
        }
    });
};

var getReview = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            var query = client.query({
                text : "SELECT review_title, review_content, star_rating, review_date_created, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, bool_and(customer_username IN (SELECT customer_username FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_writer FROM review NATURAL JOIN customer WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4 GROUP BY review_title, review_content, star_rating, review_date_created, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic",
                values : [req.params.event, req.query.date, req.query.location, req.params.username, req.user.username]
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
                done();
                if (result.rows.length) {
                    res.status(200).json(result.rows[0]);
                } else {
                    res.status(404).send("Review not found");
                }
                log.info({
                    res : res
                }, 'done response');
            });
        }
    });
};

var deleteReview = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM review JOIN event ON review.event_name = event.event_name AND review.event_start_date = event.event_start_date AND review.event_location = event.event_location JOIN customer ON customer.customer_username = review.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND review.customer_username = $5 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username]
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
                    client.query({
                        text : "DELETE FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4",
                        values : [req.params.event, req.query.date, req.query.location, req.user.username]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send("Oh, no! Disaster!");
                        } else {
                            client.query("COMMIT");
                            done();
                            res.status(204).send('');
                        }
                        log.info({
                            res : res
                        }, 'done response');
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't delete this review");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var createReview = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = new Date(req.query.date);
        if (!(date.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN is_a ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location LEFT OUTER JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location LEFT OUTER JOIN customer ON customer.customer_username = pays.customer_username OR customer.customer_username = is_a.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    var today = new Date();
                    if (today.getTime() < date.getTime()) {
                        done();
                        res.status(403).send('Event not yet started');
                        log.info({
                            res : res
                        }, 'done response');
                    } else {
                        client.query({
                            text : "INSERT INTO review (event_name, event_start_date, event_location, customer_username, review_title, review_content, star_rating, review_date_created) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)",
                            values : [req.params.event, req.query.date, req.query.location, req.user.username, req.body.title, req.body.content, req.body.rating, (new Date()).toUTCString()]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                            } else {
                                client.query("COMMIT");
                                done();
                                var review = new Object();
                                review.event = new Object();
                                review.event.name = req.params.event;
                                review.event.date = req.query.date;
                                review.event.location = req.query.location;
                                review.username = req.user.username;
                                res.status(201).json(review);
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    }
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't post a review for this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var updateReview = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        if (!(eventStartDate.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            // Check if the user is registered for this event
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM review JOIN event ON review.event_name = event.event_name AND review.event_start_date = event.event_start_date AND review.event_location = event.event_location JOIN customer ON customer.customer_username = review.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND review.customer_username = $5 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username]
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
                    client.query({
                        text : "UPDATE review SET (review_title, review_content, star_rating) = ($5, $6, $7) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4",
                        values : [req.params.event, req.query.date, req.query.location, req.user.username, req.body.title, req.body.content, req.body.rating]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send(err);
                        } else {
                            client.query("COMMIT");
                            done();
                            var review = new Object();
                            review.event = new Object();
                            review.event.name = req.params.event;
                            review.event.date = req.query.date;
                            review.event.location = req.query.location;
                            review.username = req.user.username;
                            res.status(201).json(review);
                        }
                        log.info({
                            res : res
                        }, 'done response');
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't update this review");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var getMeetups = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        if (!(eventStartDate.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            var query = client.query({
                text : "SELECT meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, bool_and(customer_username IN (SELECT customer_username FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4)) as is_organizer FROM meetup NATURAL JOIN customer WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 GROUP BY meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic ORDER BY meetup_start_date DESC",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                done();
                res.status(200).json(result.rows);
                log.info({
                    res : res
                }, 'done response');
            });
        }
    });
};

var getMeetup = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        var meetupStartDate = new Date(req.query.meetup_date);
        console.log(meetupStartDate.toUTCString());
        console.log(meetupStartDate.toLocaleString());
        if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            var query = client.query({
                text : "SELECT meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, bool_and(customer_username IN (SELECT customer_username FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_organizer FROM meetup NATURAL JOIN customer WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND meetup_start_date = $6 AND meetup_location = $7 AND customer_username = $4 GROUP BY meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic",
                values : [req.params.event, req.query.date, req.query.location, req.params.username, req.user.username, req.query.meetup_date, req.query.meetup_location]
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
                done();
                if (result.rows.length) {
                    res.json(result.rows[0]);
                } else {
                    res.status(404).send("Meetup not found");
                }
                log.info({
                    res : res
                }, 'done response');
            });
        }
    });
};

var deleteMeetup = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        var meetupStartDate = new Date(req.query.meetup_date);
        if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM event JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name LEFT OUTER JOIN meetup ON meetup.event_name = event.event_name AND meetup.event_start_date = event.event_start_date AND meetup.event_location = event.event_location LEFT OUTER JOIN customer ON customer.customer_username = meetup.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND meetup.customer_username = $5 AND meetup.meetup_start_date = $6 AND meetup.meetup_location = $7 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username, req.query.meetup_date, req.query.meetup_location]
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
                    client.query({
                        text : "DELETE FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND meetup_start_date = $5 AND meetup_location = $6 AND customer_username = $4",
                        values : [req.params.event, req.query.date, req.query.location, req.params.username, req.query.meetup_date, req.query.meetup_location]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send(err);
                        } else {
                            client.query("COMMIT");
                            done();
                            res.status(204).send('');
                        }
                        log.info({
                            res : res
                        }, 'done response');
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't delete this Meetup");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var createMeetup = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        var meetupStartDate = new Date(req.body.start_date);
        var meetupEndDate = new Date(req.body.end_date);
        if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime()) || !(meetupEndDate.getTime()) || meetupStartDate.getTime() > meetupEndDate.getTime()) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            // Check if the user is registered for this event
            var query = client.query({
                text : "SELECT distinct customer.customer_username, event.event_end_date FROM event JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name LEFT OUTER JOIN is_a ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location LEFT OUTER JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location LEFT OUTER JOIN customer ON customer.customer_username = is_a.customer_username OR customer.customer_username = pays.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    var eventEndDate = new Date(result.rows[0].event_end_date);
                    if (meetupEndDate.getTime() > eventEndDate.getTime()) {
                        client.query("ROLLBACK");
                        done();
                        res.status(400).send('Invalid date');
                        log.info({
                            res : res
                        }, 'done response');
                    } else {
                        client.query({
                            text : "INSERT INTO meetup (event_name, event_start_date, event_location, meetup_location, meetup_name, meetup_start_date, meetup_end_date, meetup_description, customer_username) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                            values : [req.params.event, req.query.date, req.query.location, req.body.location, req.body.name, req.body.start_date, req.body.end_date, req.body.description, req.user.username]
                        }, function(err, result) {
                            if (err) {
                                clent.query("ROLLBACK");
                                done();
                                res.status(500).send("Oh, no! Disaster!");
                            } else {
                                client.query("COMMIT");
                                done();
                                var meetup = new Object();
                                meetup.event = new Object();
                                meetup.event.name = req.params.event;
                                meetup.event.date = req.query.date;
                                meetup.event.location = req.query.location;
                                meetup.meetup = new Object();
                                meetup.meetup.name = req.body.name;
                                meetup.meetup.location = req.body.location;
                                meetup.meetup.start_date = req.body.start_date;
                                meetup.meetup.end_date = req.body.end_date;
                                meetup.meetup.creator = req.user.username;
                                res.status(201).json(meetup);
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    }
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't create a Meetup for this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var updateMeetup = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        var meetupStartDate = new Date(req.body.start_date);
        var meetupEndDate = new Date(req.body.end_date);
        if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime()) || !(meetupEndDate.getTime()) || meetupStartDate.getTime() > meetupEndDate.getTime()) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            // Check if the user is registered for this event
            var query = client.query({
                text : "SELECT distinct customer.customer_username, event.event_end_date FROM meetup JOIN event ON meetup.event_name = event.event_name AND meetup.event_start_date = event.event_start_date AND meetup.event_location = event.event_location JOIN customer ON customer.customer_username = meetup.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND meetup.customer_username = $5 AND meetup.meetup_start_date = $6 AND meetup.meetup_location = $7 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username, req.query.meetup_date, req.query.meetup_location]
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
                    var eventEndDate = new Date(result.rows[0].event_end_date);
                    if (meetupEndDate.getTime() > eventEndDate.getTime()) {
                        client.query("ROLLBACK");
                        done();
                        res.status(400).send('Invalid date');
                        log.info({
                            res : res
                        }, 'done response');
                    } else {
                        client.query({
                            text : "UPDATE meetup SET (meetup_name, meetup_location, meetup_start_date, meetup_end_date, meetup_description) = ($7, $8, $9, $10, $11) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4 AND meetup_location = $5 AND meetup_start_date = $6",
                            values : [req.params.event, req.query.date, req.query.location, req.user.username, req.query.meetup_location, req.query.meetup_date, req.body.name, req.body.location, req.body.start_date, req.body.end_date, req.body.description]
                        }, function(err, result) {
                            if (err) {
                                client.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                            } else {
                                client.query("COMMIT");
                                done();
                                res.status(201).send("Meetup updated");
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    }
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't update this Meetup");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var addTournament = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        // Check if the user is registered for this event
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                var query = client.query({
                    text : "SELECT game_name FROM game WHERE game_name = $1",
                    values : [req.body.game]
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
                        client.query({
                            text : "INSERT INTO tournament (event_name, event_start_date, event_location, tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
                            values : [req.params.event, req.query.date, req.query.location, req.body.name, req.body.game, req.body.rules, req.body.teams, req.body.start_date, req.body.deadline, Math.floor(req.body.fee * 100) / 100, req.body.capacity, Math.floor(req.body.seed_money * 100) / 100, req.body.type, req.body.format, req.body.scoring, ((req.body.type === "Two Stage") ? req.body.group_players : 0), ((req.body.type === "Two Stage") ? req.body.group_winners : 0)]
                        }, function(err, result) {
                            if (err) {
                                clent.query("ROLLBACK");
                                done();
                                res.status(500).send(err);
                            } else {
                                client.query("COMMIT");
                                done();
                                var result = new Object();
                                result.event = new Object();
                                result.event.name = req.params.event;
                                result.event.start_date = req.query.date;
                                result.event.location = req.query.location;
                                result.tournament = req.body.name;
                                res.status(201).json(result);
                            }
                            log.info({
                                res : res
                            }, 'done response');
                        });
                    } else {
                        client.query("ROLLBACK");
                        done();
                        res.status(404).json({
                            error : "Couldn't find the game: " + tournament[0].game
                        });
                        log.info({
                            res : res
                        }, 'done response');
                    }
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).json({
                    error : "You are not an organizer or event not hosted"
                });
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

//TODO Don't leave an Event without a Tournament
var removeTournament = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        var startDate = new Date(req.body.start_date);
        var checkInDeadline = new Date(req.body.deadline);
        if (!(eventStartDate.getTime()) || !(startDate.getTime()) || !(checkInDeadline.getTime()) || checkInDeadline.getTime() > startDate.getTime() || eventStartDate.getTime() > startDate.getTime()) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            // Check if the user is registered for this event
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    client.query({
                        text : "UPDATE tournament SET tournament_active = false WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4",
                        values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send(err);
                        } else {
                            client.query("COMMIT");
                            done();
                            res.status(204).send('');
                        }
                        log.info({
                            res : res
                        }, 'done response');
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't delete this tournament");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var deleteEvent = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var eventStartDate = new Date(req.query.date);
        if (!(eventStartDate.getTime())) {
            done();
            res.status(400).send('Invalid date');
            log.info({
                res : res
            }, 'done response');
        } else {
            client.query("BEGIN");
            // Check if the user is registered for this event
            var query = client.query({
                text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;",
                values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                    client.query({
                        text : "UPDATE event SET event_active = FALSE WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
                        values : [req.params.event, req.query.date, req.query.location]
                    }, function(err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            done();
                            res.status(500).send("Oh, no! Disaster!");
                        } else {
                            client.query("COMMIT");
                            done();
                            res.status(204).send('');
                        }
                        log.info({
                            res : res
                        }, 'done response');
                    });
                } else {
                    client.query("ROLLBACK");
                    done();
                    res.status(403).send("You can't delete this event");
                    log.info({
                        res : res
                    }, 'done response');
                }
            });
        }
    });
};

var editEvent = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        // Check if the user is an organizer for this event
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                client.query({
                    text : "UPDATE event SET (event_name, event_start_date, event_location, event_venue, event_banner, event_logo, event_end_date, event_registration_deadline, event_rules, event_description, event_deduction_fee, event_is_online, event_type) = ($4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
                    values : [req.params.event, req.query.date, req.query.location, req.body.name, req.body.start_date, req.body.location, req.body.venue, req.body.banner, req.body.logo, req.body.end_date, req.body.registration_deadline, req.body.rules, req.body.description, req.body.deduction_fee, req.body.is_online, req.body.type]
                }, function(err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        done();
                        res.status(500).send("Oh, no! Disaster!");
                    } else {
                        client.query("COMMIT");
                        done();
                        var result = new Object();
                        result.name = req.body.name;
                        result.start_date = req.body.start_date;
                        result.location = req.body.location;
                        res.status(200).json(result);
                    }
                    log.info({
                        res : res
                    }, 'done response');
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't edit this event");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

var editTournament = function(req, res, pg, conString, log) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("BEGIN");
        // Check if the user is registered for this event
        var query = client.query({
            text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;",
            values : [req.params.event, req.query.date, req.query.location, req.user.username]
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
                client.query({
                    text : "UPDATE tournament SET (tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group) = ($5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4",
                    values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.body.name, req.body.game, req.body.rules, req.body.teams, req.body.start_date, req.body.deadline, Math.floor(req.body.fee * 100) / 100, req.body.capacity, Math.floor(req.body.seed_money * 100) / 100, req.body.type, req.body.format, req.body.scoring, ((req.body.type === "Two Stage") ? req.body.group_players : 0), ((req.body.type === "Two Stage") ? req.body.group_winners : 0)]
                }, function(err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        done();
                        res.status(500).send("Oh, no! Disaster!");
                    } else {
                        client.query("COMMIT");
                        done();
                        var result = new Object();
                        result.event = new Object();
                        result.event.name = req.params.event;
                        result.event.start_date = req.query.date;
                        result.event.location = req.query.location;
                        result.tournament = req.body.name;
                        res.status(200).json(result);
                    }
                    log.info({
                        res : res
                    }, 'done response');
                });
            } else {
                client.query("ROLLBACK");
                done();
                res.status(403).send("You can't edit this tournament");
                log.info({
                    res : res
                }, 'done response');
            }
        });
    });
};

module.exports.getEvents = getEvents;
module.exports.getEvent = getEvent;
module.exports.getCompetitors = getCompetitors;
module.exports.getAllNews = getAllNews;
module.exports.getNews = getNews;
module.exports.deleteNews = deleteNews;
module.exports.createNews = createNews;
module.exports.updateNews = updateNews;
module.exports.getReviews = getReviews;
module.exports.getReview = getReview;
module.exports.deleteReview = deleteReview;
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.getMeetups = getMeetups;
module.exports.getMeetup = getMeetup;
module.exports.deleteMeetup = deleteMeetup;
module.exports.createMeetup = createMeetup;
module.exports.updateMeetup = updateMeetup;
module.exports.addTournament = addTournament;
module.exports.removeTournament = removeTournament;
module.exports.deleteEvent = deleteEvent;
module.exports.editEvent = editEvent;
module.exports.editTournament = editTournament;
module.exports.getStationsForEvent = getStationsForEvent;
module.exports.addStation = addStation;
module.exports.removeStation = removeStation;
module.exports.getStation = getStation;
module.exports.addStream = addStream;
module.exports.removeStream = removeStream;
module.exports.editStation = editStation;
module.exports.getTournaments = getTournaments;
module.exports.getTournament = getTournament;
module.exports.attachStation = attachStation;
module.exports.getStationsforTournament = getStationsforTournament;
module.exports.detachStation = detachStation;
module.exports.getSponsors = getSponsors;
module.exports.addSponsorToEvent = addSponsorToEvent;
module.exports.removeSponsor = removeSponsor;
module.exports.getEventSpectators = getEventSpectators;
module.exports.checkInSpectator = checkInSpectator;
module.exports.checkInCompetitor = checkInCompetitor;
module.exports.submitScore = submitScore;

// DEPRECIATED
module.exports.getParticipants = getParticipants;
