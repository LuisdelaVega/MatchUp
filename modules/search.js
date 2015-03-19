var getSearchResults = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var searchresults = new Object();
		// Query the database to find the accounts
		var usersQuery = client.query({
			text : "select * from customer where customer_first_name ||' '|| customer_last_name ilike '%" + req.params.parameter + "%' or customer_tag ilike '%" + req.params.parameter + "%'"
		});
		usersQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		usersQuery.on("end", function(result) {

			searchresults.users = result.rows;
			// Look for all the Events that are currently in progress
			var queryLive = client.query({
				text : "select * from event where event_start_date < now() at time zone 'utc' and event_end_date > now() at time zone 'utc' and event_name ilike '%" + req.params.parameter + "%' order by event_start_date desc"
			});
			queryLive.on("row", function(row, result) {
				result.addRow(row);
			});
			queryLive.on("end", function(result) {
				searchresults.events = new Object();
				searchresults.events.live = result.rows;
				// Look for all the Events that have already ended
				var queryPast = client.query({
					text : "select * from event where event_end_date < now() at time zone 'utc' and event_name ilike '%" + req.params.parameter + "%' order by event_start_date desc"
				});
				queryPast.on("row", function(row, result) {
					result.addRow(row);
				});
				queryPast.on("end", function(result) {
					searchresults.events.past = result.rows;

					// Look for all the Regular Events that have not yet started
					var queryRegular = client.query({
						text : "select event.* from event where event_name ilike '%" + req.params.parameter + "%' and event_start_date > now() at time zone 'utc' and event_id not in (select event.event_id from event natural join hosts natural join organization) order by event.event_start_date"
					});
					queryRegular.on("row", function(row, result) {
						result.addRow(row);
					});
					queryRegular.on("end", function(result) {
						searchresults.events.regular = result.rows;

						// Look for all Hosted Events that have not yet started
						var queryHosted = client.query({
							text : "select event.*, organization.organization_id, organization.organization_name from event natural join hosts natural join organization where event_name ilike '%" + req.params.parameter + "%' and event.event_start_date > now() at time zone 'utc' order by event.event_start_date"
						});
						queryHosted.on("row", function(row, result) {
							result.addRow(row);
						});
						queryHosted.on("end", function(result) {
							searchresults.events.hosted = result.rows;
							
							//TODO check for active/inactive
							// Look for all relevant Teams
							var queryTeams = client.query({
								text : "select * from team where team_name ilike '%" + req.params.parameter + "%'"
							});
							queryTeams.on("row", function(row, result) {
								result.addRow(row);
							});
							queryTeams.on("end", function(result) {
								searchresults.teams = result.rows;
								
								//TODO check for active/inactive
								// Look for all relevant Organizations
								var queryOrganizations = client.query({
									text : "select * from organization where organization_name ilike '%" + req.params.parameter + "%'"
								});
								queryOrganizations.on("row", function(row, result) {
									result.addRow(row);
								});
								queryOrganizations.on("end", function(result) {
									searchresults.organizations = result.rows;

									// Look for all relevant Games
									var queryGames = client.query({
										text : "select * from game where game_name ilike '%" + req.params.parameter + "%'"
									});
									queryGames.on("row", function(row, result) {
										result.addRow(row);
									});
									queryGames.on("end", function(result) {
										searchresults.games = result.rows;

										// Look for all relevant Genres
										var queryGenres = client.query({
											text : "select * from genre where genre_name ilike '%" + req.params.parameter + "%'"
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

module.exports.getSearchResults = getSearchResults;
