//TODO Get specific News for an event
//TODO Get specific Review for an event
//TODO Add Tournamet
//TODO Add Station
//TODO Add News
//TODO Add Sponsor
//TODO Edit Event details
//TODO Edit Tournament details
//TODO Edit Station details
//TODO Edit Sponsors details
//TODO Edit News details
//TODO Delete Event
//TODO Delete Tournament
//TODO Delete Sponsor
//TODO Delete Meetup
//TODO Delete Review
//TODO Delete News
//TODO Register for Event
//TODO Register for Tournament
//TODO Create Meetup
//TODO Create Review

var getEventsParams = {
	type : ["regular", "hosted"],
	filter : ["game", "genre"],
	state : ["live", "past", "upcoming"]
};

//TODO Implement limit and offsets like in Spruce
// /events - Get a list of Events filtered by given parameters
var getEvents = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var where = false;
		var queryText = "SELECT ";
		var queryGroupBy = " GROUP BY event_name, event_start_date, event_location";
		switch (req.query.type) {
		case getEventsParams.type[0]:
			queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE concat(event_name, event_location, event_start_date) NOT IN (SELECT concat(event_name, event_location, event_start_date) FROM hosts)";
			console.log(queryText);
			where = true;
			break;
		case getEventsParams.type[1]:
			queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event NATURAL JOIN hosts";
			// queryGroupBy += ", organization_name";
			console.log(queryText);
			break;
		default:
			queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event";
			console.log(queryText);
		}
		switch (req.query.filter) {
		case getEventsParams.filter[0]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game WHERE game_name = '" + ((!req.query.value) ? 0 : req.query.value) + "')";
			console.log(queryText);
			break;
		case getEventsParams.filter[1]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game NATURAL JOIN is_of NATURAL JOIN genre WHERE genre_name = '" + ((!req.query.value) ? 0 : req.query.value) + "')";
			console.log(queryText);
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
			console.log(queryText);
			break;
		case getEventsParams.state[1]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_end_date < now() at time zone 'utc'";
			console.log(queryText);
			break;
		case getEventsParams.state[2]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_start_date > now() at time zone 'utc'";
			console.log(queryText);
			break;
		}

		if (where) {
			queryText += " AND event_active";
		} else {
			queryText += " WHERE event_active";
			where = true;
		}

		queryText += queryGroupBy;
		queryText += " ORDER BY event_start_date";
		console.log(queryText);
		// Query the database to find the account
		var query = client.query({
			text : queryText
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.json(result.rows);
			client.end();
		});
	});
};

//TODO Send if I am an organizer
var getEvent = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		var date = new Date(req.query.date);
		// Query the database to find the account
		var event = new Object();
		var queryEvent = client.query({
			text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_banner, event_logo, event_max_capacity, event_end_date, event_registration_deadline, event_rules, event_description, event_deduction_fee, event_is_online, event_type, bool_and(concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM hosts)) as is_hosted FROM event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND event_active GROUP BY event_name, event_start_date, event_location",
			values : [req.params.event, (!(date.getTime()) ? "0000-00-00T00:00:00.000Z" : req.query.date), req.query.location] //TODO REGEX this shit
		});
		queryEvent.on("row", function(row, result) {
			result.addRow(row);
		});
		queryEvent.on("end", function(result) {
			if (result.rows.length > 0) {
				event.info = result.rows[0];
				var queryMeetup = client.query({
					text : "SELECT meetup_name, meetup_start_date, meetup_description FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
					values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
				});
				queryMeetup.on("row", function(row, result) {
					result.addRow(row);
				});
				queryMeetup.on("end", function(result) {
					event.meetups = result.rows;
					var queryTournament = client.query({
						text : "SELECT tournament_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, game.* FROM tournament NATURAL JOIN game WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
						values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
					});
					queryTournament.on("row", function(row, result) {
						result.addRow(row);
					});
					queryTournament.on("end", function(result) {
						event.tournaments = result.rows;
						var queryNews = client.query({
							text : "SELECT news_number, news_title, news_content, news_date_posted FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
							values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
						});
						queryNews.on("row", function(row, result) {
							result.addRow(row);
						});
						queryNews.on("end", function(result) {
							event.news = result.rows;
							var querySponsor = client.query({
								text : "SELECT sponsor_name, sponsor_logo, sponsor_link FROM sponsors NATURAL JOIN shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
								values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
							});
							querySponsor.on("row", function(row, result) {
								result.addRow(row);
							});
							querySponsor.on("end", function(result) {
								event.sponsors = result.rows;
								var querySpectatorFee = client.query({
									text : "SELECT spec_fee_name, spec_fee_amount, spec_fee_description FROM spectator_fee WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
									values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
								});
								querySpectatorFee.on("row", function(row, result) {
									result.addRow(row);
								});
								querySpectatorFee.on("end", function(result) {
									event.spectator_fees = result.rows;
									var queryReview = client.query({
										text : "SELECT review_number, review_title, review_content, star_rating, review_date_created FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
										values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
									});
									queryReview.on("row", function(row, result) {
										result.addRow(row);
									});
									queryReview.on("end", function(result) {
										event.reviews = result.rows;
										if (event.info.is_hosted) {
											var queryHost = client.query({
												text : "SELECT organization_name, organization_logo, organization_active FROM organization NATURAL JOIN hosts WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
												values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
											});
											queryHost.on("row", function(row, result) {
												result.addRow(row);
											});
											queryHost.on("end", function(result) {
												event.host = result.rows[0];
												res.json(event);
												client.end();
											});
										} else {//TODO If not hosted by an organization, send the creator of the event as the 'host'
											res.json(event);
											client.end();
										}
									});
								});
							});
						});
					});
				});
			} else {
				client.end();
				res.status(404).send('Oh, no! This event does not exist');
			}
		});
	});
};

//TODO Limit the result to a maximum of 3 or something
// /home - Get everything MatchUp's home view needs
var getHome = function(res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventList = new Object();
		// Look for all the Events that are currently in progress
		var queryLive = client.query({
			text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE event_start_date < now() at time zone 'utc' and event_end_date > now() at time zone 'utc' AND event_active GROUP BY event_name, event_location, event_start_date ORDER BY event_start_date"
		});
		queryLive.on("row", function(row, result) {
			result.addRow(row);
		});
		queryLive.on("end", function(result) {
			eventList.live = result.rows;

			// Look for all the Regular Events that have not yet started
			var queryRegular = client.query({
				text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE event_start_date > now() at time zone 'utc' AND event_name NOT IN (SELECT event.event_name FROM event NATURAL JOIN hosts) AND event_active GROUP BY event_name, event_location, event_start_date ORDER BY event_start_date"
			});
			queryRegular.on("row", function(row, result) {
				result.addRow(row);
			});
			queryRegular.on("end", function(result) {
				eventList.regular = result.rows;

				// Look for all Hosted Events that have not yet started
				var queryHosted = client.query({
					text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event NATURAL JOIN hosts WHERE event.event_start_date > now() at time zone 'utc' AND event_active GROUP BY event_name, event_location, event_start_date ORDER BY event_start_date"
				});
				queryHosted.on("row", function(row, result) {
					result.addRow(row);
				});
				queryHosted.on("end", function(result) {
					eventList.hosted = result.rows;

					// Look for most Popular Games
					var gamesList = new Object();
					var queryPopularGames = client.query({
						text : "SELECT game.*, count(game.game_name) as popularity FROM event NATURAL JOIN tournament NATURAL JOIN game WHERE event_active GROUP BY game.game_name ORDER BY popularity DESC"
					});
					queryPopularGames.on("row", function(row, result) {
						result.addRow(row);
					});
					queryPopularGames.on("end", function(result) {
						gamesList.popular_games = result.rows;

						res.json({
							events : eventList,
							popular_games : gamesList.popular_games
						});
						client.end();
					});
				});
			});
		});
	});
};

module.exports.getEvents = getEvents;
module.exports.getEvent = getEvent;
module.exports.getHome = getHome;
