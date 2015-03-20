//TODO Implement offsets like in Spruce
//TODO Filter by games and genres featured in tournaments
var getAllEvents = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "select * from event order by event_start_date"
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

var getEvent = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "select * from event where event_id = $1",
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

var getEventFeaturingGame = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "select * from event where event_id IN (select event.event_id from event natural join has natural join tournament natural join features natural join game where game_id = $1) group by event_id",
			values : [req.params.game]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			if (result.rows.length > 0) {
				res.json(result.rows);
			} else {
				return res.status(404).send('Oh, no! This event does not exist');
			}
			client.end();
		});
	});
};

var getEventFeaturingGenre = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "select * from event where event_id IN (select event.event_id from event natural join has natural join tournament natural join features natural join game natural join is_of natural join genre where genre_id = $1) group by event_id",
			values : [req.params.genre]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			if (result.rows.length > 0) {
				res.json(result.rows);
			} else {
				return res.status(404).send('Oh, no! This event does not exist');
			}
			client.end();
		});
	});
};

var getLiveEvents = function(res, pg, conString) {
	// Query the DB to find the live Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		// Query the database to find the account
		var query = client.query({
			text : "select * from event where event_start_date < now() at time zone 'utc' and event_end_date > now() at time zone 'utc' order by event_start_date"
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

var getRegularEvents = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "select event.* from event where event_id not in (select event.event_id from event natural join hosts natural join organization) order by event.event_start_date"
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

var getHostedEvents = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "select event.*, organization.organization_id, organization.organization_name from event natural join hosts natural join organization order by event.event_start_date"
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

var getHome = function(res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventList = new Object();
		// Look for all the Events that are currently in progress
		var queryLive = client.query({
			text : "select * from event where event_start_date < now() at time zone 'utc' and event_end_date > now() at time zone 'utc' order by event_start_date"
		});
		queryLive.on("row", function(row, result) {
			result.addRow(row);
		});
		queryLive.on("end", function(result) {
			eventList.live = result.rows;

			// Look for all the Regular Events that have not yet started
			var queryRegular = client.query({
				text : "select event.* from event where event_start_date > now() at time zone 'utc' and event_id not in (select event.event_id from event natural join hosts natural join organization) order by event.event_start_date"
			});
			queryRegular.on("row", function(row, result) {
				result.addRow(row);
			});
			queryRegular.on("end", function(result) {
				eventList.regular = result.rows;

				// Look for all Hosted Events that have not yet started
				var queryHosted = client.query({
					text : "select event.*, organization.organization_id, organization.organization_name from event natural join hosts natural join organization where event.event_start_date > now() at time zone 'utc' order by event.event_start_date"
				});
				queryHosted.on("row", function(row, result) {
					result.addRow(row);
				});
				queryHosted.on("end", function(result) {
					eventList.hosted = result.rows;

					// Look for most Popular Games
					var gamesList = new Object();
					var queryPopularGames = client.query({
						text : "select game.*, count(game.game_id) as popularity from tournament natural join game group by game.game_id order by popularity desc"
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

module.exports.getAllEvents = getAllEvents;
module.exports.getEvent = getEvent;
module.exports.getEventFeaturingGame = getEventFeaturingGame;
module.exports.getEventFeaturingGenre = getEventFeaturingGenre;
module.exports.getLiveEvents = getLiveEvents;
module.exports.getRegularEvents = getRegularEvents;
module.exports.getHostedEvents = getHostedEvents;
module.exports.getHome = getHome;
