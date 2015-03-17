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

var getHome = function(res, eventList, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
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

					//TODO Look for Popular Games
					res.json({
						events : eventList
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
