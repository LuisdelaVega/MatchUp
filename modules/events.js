var getEventsParams = {
	type : ["regular", "hosted"],
	filter : ["game", "genre"],
	time : ["live", "past", "upcoming"]
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
		var queryGroupBy = " GROUP BY";
		switch (req.query.type) {
		case getEventsParams.type[0]:
			queryText += "event.*, organization_name FROM event WHERE event_name NOT IN (SELECT event.event_name FROM event NATURAL JOIN hosts)";
			console.log(queryText);
			where = true;
			break;
		case getEventsParams.type[1]:
			queryText += "event.*, organization_name FROM event NATURAL JOIN hosts";
			queryGroupBy += " event_name, organization_name";
			console.log(queryText);
			break;
		default:
			queryText += "* FROM event";
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
			queryText += "event_name IN (SELECT event.event_name FROM event NATURAL JOIN has NATURAL JOIN tournament NATURAL JOIN game WHERE game_name = " + ((!req.query.game) ? 0 : req.query.game) + ")";
			if (queryGroupBy === " GROUP BY") {
				queryGroupBy += " event_name";
			}
			console.log(queryText);
			break;
		case getEventsParams.filter[1]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_name IN (SELECT event.event_name FROM event NATURAL JOIN has NATURAL JOIN tournament NATURAL JOIN game NATURAL JOIN is_of NATURAL JOIN genre WHERE genre_name = " + ((!req.query.genre) ? 0 : req.query.genre) + ")";
			if (queryGroupBy === " GROUP BY") {
				queryGroupBy += " event_name";
			}
			console.log(queryText);
			break;
		}
		switch (req.query.time) {
		case getEventsParams.time[0]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_start_date < now() at time zone 'utc' AND event_end_date > now() at time zone 'utc'";
			console.log(queryText);
			break;
		case getEventsParams.time[1]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_end_date < now() at time zone 'utc'";
			console.log(queryText);
			break;
		case getEventsParams.time[2]:
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
			queryText += " AND event_visibility";
		} else {
			queryText += " WHERE event_visibility";
			where = true;
		}
		
		if (queryGroupBy != " GROUP BY") {
			queryText += queryGroupBy;
		}
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

// /events/:event - Get a specific Event
var getEvent = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "SELECT * FROM event WHERE event_name = $1 AND event_visibility",
			values : [req.params.event]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			if (result.rows.length > 0) {
				res.json(result.rows[0]);
			} else {
				return res.status(404).send('Oh, no! This event does not exist');
			}
			client.end();
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
			text : "SELECT event_name, event_location, event_venue, event_logo FROM event WHERE event_start_date < now() at time zone 'utc' and event_end_date > now() at time zone 'utc' AND event_visibility ORDER BY event_start_date"
		});
		queryLive.on("row", function(row, result) {
			result.addRow(row);
		});
		queryLive.on("end", function(result) {
			eventList.live = result.rows;

			// Look for all the Regular Events that have not yet started
			var queryRegular = client.query({
				text : "SELECT event_name, event_location, event_venue, event_logo FROM event WHERE event_start_date > now() at time zone 'utc' and event_name NOT IN (SELECT event.event_name FROM event NATURAL JOIN hosts) AND event_visibility ORDER BY event.event_start_date"
			});
			queryRegular.on("row", function(row, result) {
				result.addRow(row);
			});
			queryRegular.on("end", function(result) {
				eventList.regular = result.rows;

				// Look for all Hosted Events that have not yet started
				var queryHosted = client.query({
					text : "SELECT event_name, event_location, event_venue, event_logo, organization_name FROM event NATURAL JOIN hosts WHERE event.event_start_date > now() at time zone 'utc' AND event_visibility ORDER BY event.event_start_date"
				});
				queryHosted.on("row", function(row, result) {
					result.addRow(row);
				});
				queryHosted.on("end", function(result) {
					eventList.hosted = result.rows;

					// Look for most Popular Games
					var gamesList = new Object();
					var queryPopularGames = client.query({
						text : "SELECT game.*, count(game.game_name) as popularity FROM event NATURAL JOIN tournament NATURAL JOIN game WHERE event_visibility GROUP BY game.game_name ORDER BY popularity DESC"
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