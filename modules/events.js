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
			text : "select * from event where event_start_date < now() at time zone 'utc'"
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

var getLocalEvents = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the account
		var query = client.query({
			text : "select * from event"
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

var getHome = function(res, eventList, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		// Query the database to find the account
		var queryLive = client.query({
			text : "select * from event where event_start_date < now() at time zone 'utc'"
		});
		queryLive.on("row", function(row, result) {
			result.addRow(row);
		});
		queryLive.on("end", function(result) {
			eventList.live = result.rows;
			var queryLocal = client.query({
				text : "select * from event"
			});
			queryLocal.on("row", function(row, result) {
				result.addRow(row);
			});
			queryLocal.on("end", function(result) {
				eventList.local = result.rows;
				res.json({
					events : eventList
				});
			});
		});
	});
};

module.exports.getLiveEvents = getLiveEvents;
module.exports.getLocalEvents = getLocalEvents;
module.exports.getHome = getHome; 