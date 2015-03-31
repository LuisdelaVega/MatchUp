var getSearchResults = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var searchresults = new Object();
		// Query the database to find the accounts
		var usersQuery = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_country FROM customer WHERE customer_first_name ||' '|| customer_last_name ILIKE '%" + req.params.parameter + "%' OR customer_tag ILIKE '%" + req.params.parameter + "%' AND customer_active"
		});
		usersQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		usersQuery.on("end", function(result) {
			searchresults.users = result.rows;

			// Look for all the Events that are currently in progress
			var queryLive = client.query({
				text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE event_start_date < now() at time zone 'utc' AND event_end_date > now() at time zone 'utc' AND event_name ILIKE '%" + req.params.parameter + "%' AND event_active ORDER BY event_start_date DESC"
			});
			queryLive.on("row", function(row, result) {
				result.addRow(row);
			});
			queryLive.on("end", function(result) {
				searchresults.events = new Object();
				searchresults.events.live = result.rows;

				// Look for all the Events that have already ended
				var queryPast = client.query({
					text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE event_end_date < now() at time zone 'utc' AND event_name ILIKE '%" + req.params.parameter + "%' AND event_active ORDER BY event_start_date DESC"
				});
				queryPast.on("row", function(row, result) {
					result.addRow(row);
				});
				queryPast.on("end", function(result) {
					searchresults.events.past = result.rows;

					// Look for all the Regular Events that have not yet started
					var queryRegular = client.query({
						text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE event_name ILIKE '%" + req.params.parameter + "%' AND event_start_date > now() at time zone 'utc' AND event_name NOT IN (SELECT event_name FROM event NATURAL JOIN hosts) AND event_active ORDER BY event_start_date"
					});
					queryRegular.on("row", function(row, result) {
						result.addRow(row);
					});
					queryRegular.on("end", function(result) {
						searchresults.events.regular = result.rows;

						// Look for all Hosted Events that have not yet started
						var queryHosted = client.query({
							text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event NATURAL JOIN hosts WHERE event_name ILIKE '%" + req.params.parameter + "%' AND event_start_date > now() at time zone 'utc' AND event_active ORDER BY event_start_date"
						});
						queryHosted.on("row", function(row, result) {
							result.addRow(row);
						});
						queryHosted.on("end", function(result) {
							searchresults.events.hosted = result.rows;

							// Look for all relevant Teams
							var queryTeams = client.query({
								text : "SELECT team_name, team_logo, team_bio, team_cover_photo FROM team WHERE team_name ILIKE '%" + req.params.parameter + "%' AND team_active"
							});
							queryTeams.on("row", function(row, result) {
								result.addRow(row);
							});
							queryTeams.on("end", function(result) {
								searchresults.teams = result.rows;

								// Look for all relevant Organizations
								var queryOrganizations = client.query({
									text : "SELECT organization_name, organization_logo FROM organization WHERE organization_name ILIKE '%" + req.params.parameter + "%' AND organization_active"
								});
								queryOrganizations.on("row", function(row, result) {
									result.addRow(row);
								});
								queryOrganizations.on("end", function(result) {
									searchresults.organizations = result.rows;

									// Look for all relevant Games
									var queryGames = client.query({
										text : "SELECT * FROM game WHERE game_name ILIKE '%" + req.params.parameter + "%'"
									});
									queryGames.on("row", function(row, result) {
										result.addRow(row);
									});
									queryGames.on("end", function(result) {
										searchresults.games = result.rows;

										// Look for all relevant Genres
										var queryGenres = client.query({
											text : "SELECT * FROM genre WHERE genre_name ILIKE '%" + req.params.parameter + "%'"
										});
										queryGenres.on("row", function(row, result) {
											result.addRow(row);
										});
										queryGenres.on("end", function(result) {
											searchresults.genres = result.rows;

											res.json({
												users : searchresults.users,
												events : searchresults.events,
												teams : searchresults.teams,
												organizations : searchresults.organizations,
												games : searchresults.games,
												genres : searchresults.genres
											});
											client.end();
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
};

var searchSponsors = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryGenres = client.query({
			text : "SELECT * FROM genre WHERE genre_name ILIKE '%" + req.params.parameter + "%'"
		});
		queryGenres.on("row", function(row, result) {
			result.addRow(row);
		});
		queryGenres.on("end", function(result) {
			searchresults.genres = result.rows;

			res.json({
				users : searchresults.users,
				events : searchresults.events,
				teams : searchresults.teams,
				organizations : searchresults.organizations,
				games : searchresults.games,
				genres : searchresults.genres
			});
			client.end();
		});
	});
};

/*
 // Look for all relevant Genres
 var queryGenres = client.query({
 text : "SELECT * FROM genre WHERE genre_name ILIKE '%" + req.params.parameter + "%'"
 });
 queryGenres.on("row", function(row, result) {
 result.addRow(row);
 });
 queryGenres.on("end", function(result) {
 searchresults.genres = result.rows;

 res.json({
 users : searchresults.users,
 events : searchresults.events,
 teams : searchresults.teams,
 organizations : searchresults.organizations,
 games : searchresults.games,
 genres : searchresults.genres
 });
 client.end();
 });
 */

module.exports.getSearchResults = getSearchResults;
