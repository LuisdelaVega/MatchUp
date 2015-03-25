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
				team.info = result.rows[0];
				var playersQuery = client.query({
					text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag," + 
					" customer.customer_profile_pic, bool_and(customer.customer_username IN (SELECT customer_username FROM captain_for WHERE team_name = $1)) AS is_captain" + 
					" FROM customer NATURAL JOIN plays_for WHERE customer_active AND team_name = $1 GROUP BY customer.customer_username",
					values : [req.params.team]
				});
				playersQuery.on("row", function(row, result) {
					result.addRow(row);
				});
				playersQuery.on("end", function(result) {
					team.players = result.rows;
					res.json(team);
					client.end();
				});
			} else {
				client.end();
				return res.status(404).send('Oh, no! This team does not exist');
			};
		});
	});
};

//TODO Check if user that wants to edit is part of this team
var editTeam = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryText = "UPDATE team SET";
		if (req.body.logo) {
			queryText += " team_logo = '" + req.body.logo + "'";
		}
		if (req.body.bio) {
			queryText += " team_bio = '" + req.body.bio + "'";
		}
		if (req.body.cover) {
			queryText += " team_cover = '" + req.body.cover + "'";
		}

		if (!req.body.logo && !req.body.bio && !req.body.cover) {
			client.end();
			return res.status(401).send('');
		}

		queryText += " WHERE team_name = '" + req.params.team + "' AND team_active";
		var teamsQuery = client.query({
			text : queryText
		}, function(err, result) {
			if (err) {
				res.status(400).send("Oh, no! Disaster!");
				client.end();
			} else {
				res.status(204).send('');
			}
		});
	});
};

var deleteTeam = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var teamsQuery = client.query({
			text : "UPDATE team SET team_active = FALSE WHERE team_name = $1 AND team_name IN (SELECT team_name FROM captain_for WHERE customer_username = $2)",
			values : [req.params.team, req.user.username]
		}, function(err, result) {
			if (err) {
				res.status(400).send("Oh, no! Disaster!");
				client.end();
			} else {
				res.status(204).send('');
			}
		});
	});
};

var addTeamMember = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		var memberQuery = client.query({
			text : "SELECT team.team_name FROM plays_for NATURAL JOIN team WHERE customer_username = $1 AND team_active AND team_name = $2",
			values : [req.user.username, req.params.team]
		});
		memberQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		memberQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				client.query({
					text : "INSERT INTO plays_for (customer_username, team_name) VALUES ($1, $2)",
					values : [req.params.username, req.params.team]
				}, function(err, result) {
					if (err) {
						res.status(400).send("Oh, no! This user already plays for this team dummy");
						client.end();
					} else {
						client.query("COMMIT");
						res.status(204).send('');
					}
				});
			} else {
				client.end();
				return res.status(401).send('Oh, no! It seems you are not part of this team');
			}
		});
	});
};

var removeTeamMember = function(req, res, pg, conString) {

};

var makeCaptain = function(req, res, pg, conString) {

};

module.exports.getTeams = getTeams;
module.exports.getTeam = getTeam;
module.exports.editTeam = editTeam;
module.exports.deleteTeam = deleteTeam;
module.exports.addTeamMember = addTeamMember;
