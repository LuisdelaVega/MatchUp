//TODO Edit team, delete team
var getTeams = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var teamsQuery = client.query({
			text : "SELECT team_name, team_logo, team_bio, team_cover_photo FROM team WHERE team_active"
		});
		teamsQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		teamsQuery.on("end", function(result) {
			res.json(result.rows);
			client.end();
		});
	});
};

//TODO Look for Tournaments the team has participated and calculate their standing
var getTeam = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var teamsQuery = client.query({
			text : "SELECT team_name, team_logo, team_bio, team_cover_photo FROM team WHERE team_active AND team_name = $1",
			values : [req.params.team]
		});
		teamsQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		teamsQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				var team = new Object();
				team.info = new Object();
				team.info = result.rows[0];
				var playersQuery = client.query({
					text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic" + 
					" FROM customer NATURAL JOIN plays_for WHERE customer.customer_username NOT IN (SELECT customer.customer_username"+
					" FROM customer NATURAL JOIN captain_for WHERE team_name = $1)"+
					" AND customer_active AND team_name = $1",
					values : [req.params.team]
				});
				playersQuery.on("row", function(row, result) {
					result.addRow(row);
				});
				playersQuery.on("end", function(result) {
					team.players = new Object();
					team.players = result.rows;
					var playersQuery = client.query({
						text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic" + 
						" FROM customer NATURAL JOIN captain_for WHERE customer_active AND team_name = $1",
						values : [req.params.team]
					});
					playersQuery.on("row", function(row, result) {
						result.addRow(row);
					});
					playersQuery.on("end", function(result) {
						team.captain = new Object();
						team.captain = result.rows[0];
						res.json(team);
						client.end();
					});
				});
			} else {
				client.end();
				return res.status(404).send('Oh, no! This team does not exist');
			};
		});
	});
};

module.exports.getTeams = getTeams;
module.exports.getTeam = getTeam;
