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
			res.json({
				local : result.rows
			});
		});
	});
};

var getLiveEvents = function(res, pg, conString) {
	//TODO Give the code below to the clients. I don't need this
	// var today = new Date();
	// var todaysDate = today.getUTCFullYear()+"-"+today.getUTCMonth()+"-"+today.getUTCDay()+" "+today.getUTCHours()+":"+today.getUTCMinutes()+":"+today.getUTCSeconds();

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
			res.json({
				live : result.rows
			});
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
			res.json({
				regular : result.rows
			});
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
			res.json({
				hosted : result.rows
			});
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
							games : gamesList
						});
					});
				});
			});
		});
	});
};

module.exports.getAllEvents = getAllEvents;
module.exports.getLiveEvents = getLiveEvents;
module.exports.getRegularEvents = getRegularEvents;
module.exports.getHostedEvents = getHostedEvents;
module.exports.getHome = getHome;
