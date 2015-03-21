var getEventsParams = {
	type : ["regular", "hosted"],
	filter : ["game", "genre"],
	time : ["live", "past", "upcoming"]
};

//TODO Implement offsets like in Spruce and also limit
// /events - Get a list of Events filtered by given parameters
var getEvents = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var where = false;
		var queryText = "SELECT ";
		var queryGroupBy = " group by";
		switch (req.query.type) {
		case getEventsParams.type[0]:
			queryText += "* FROM event WHERE event_id NOT IN (SELECT event.event_id FROM event NATURAL JOIN hosts NATURAL JOIN organization)";
			console.log(queryText);
			where = true;
			break;
		case getEventsParams.type[1]:
			queryText += "event.*, organization.organization_id, organization.organization_name FROM event NATURAL JOIN hosts NATURAL JOIN organization";
			queryGroupBy += " event_id, organization.organization_id";
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
			queryText += "event_id IN (select event.event_id from event NATURAL JOIN has NATURAL JOIN tournament NATURAL JOIN features NATURAL JOIN game WHERE game_id = " + ((!req.query.game) ? 0 : req.query.game) + ")";
			if (queryGroupBy === " group by") {
				queryGroupBy += " event_id";
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
			queryText += "event_id IN (select event.event_id from event NATURAL JOIN has NATURAL JOIN tournament NATURAL JOIN features NATURAL JOIN game NATURAL JOIN is_of NATURAL JOIN genre WHERE genre_id = " + ((!req.query.genre) ? 0 : req.query.genre) + ")";
			if (queryGroupBy === " group by") {
				queryGroupBy += " event_id";
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
		if (queryGroupBy != " group by") {
			queryText += queryGroupBy;
		}
		queryText += " order by event_start_date";
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
			text : "select * from event WHERE event_id = $1",
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
			text : "select * from event WHERE event_start_date < now() at time zone 'utc' and event_end_date > now() at time zone 'utc' order by event_start_date"
		});
		queryLive.on("row", function(row, result) {
			result.addRow(row);
		});
		queryLive.on("end", function(result) {
			eventList.live = result.rows;

			// Look for all the Regular Events that have not yet started
			var queryRegular = client.query({
				text : "select event.* from event WHERE event_start_date > now() at time zone 'utc' and event_id not in (select event.event_id from event NATURAL JOIN hosts NATURAL JOIN organization) order by event.event_start_date"
			});
			queryRegular.on("row", function(row, result) {
				result.addRow(row);
			});
			queryRegular.on("end", function(result) {
				eventList.regular = result.rows;

				// Look for all Hosted Events that have not yet started
				var queryHosted = client.query({
					text : "select event.*, organization.organization_id, organization.organization_name from event NATURAL JOIN hosts NATURAL JOIN organization WHERE event.event_start_date > now() at time zone 'utc' order by event.event_start_date"
				});
				queryHosted.on("row", function(row, result) {
					result.addRow(row);
				});
				queryHosted.on("end", function(result) {
					eventList.hosted = result.rows;

					// Look for most Popular Games
					var gamesList = new Object();
					var queryPopularGames = client.query({
						text : "select game.*, count(game.game_id) as popularity from tournament NATURAL JOIN game group by game.game_id order by popularity desc"
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
