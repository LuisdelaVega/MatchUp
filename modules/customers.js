//TODO Calculate the matches won/lost for the profile pages
//TODO Edit profile
//TODO Delete profile
var getMyProfile = function(req, res, pg, conString) {

	var username = new Object();
	username.params = new Object();
	username.user = new Object();
	username.params.username = req.user.username;
	username.user.username = req.user.username;

	getUserProfile(username, res, pg, conString);
};

var getUserProfile = function(req, res, pg, conString) {
	// Query the DB to find the account
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var profile = new Object();
		// Query the database to find the user's account
		var profileQuery = client.query({
			text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag," + 
			" customer.customer_profile_pic, customer.customer_cover_photo, customer.customer_bio, customer.customer_country,"+
			" of_email.email_address, bool_and(customer_username = $1) AS my_profile" + 
			" FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer.customer_active GROUP BY customer_username, email_address",
			values : [req.user.username, req.params.username]
		});
		profileQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		profileQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				profile.info = result.rows[0];

				// Query the database to find the user's Teams
				var teamsQuery = client.query({
					text : "SELECT team.team_name, team.team_logo, team.team_bio, team.team_cover_photo" + 
					" FROM team NATURAL JOIN plays_for WHERE customer_username = $1 AND team.team_active",
					values : [req.params.username]
				});
				teamsQuery.on("row", function(row, result) {
					result.addRow(row);
				});
				teamsQuery.on("end", function(result) {
					profile.teams = result.rows;

					// Query the database to find the user's Organizations
					var organizationsQuery = client.query({
						text : "SELECT organization.organization_name, organization.organization_logo" + 
						" FROM organization NATURAL JOIN belongs_to WHERE customer_username = $1 AND organization.organization_active",
						values : [req.params.username]
					});
					organizationsQuery.on("row", function(row, result) {
						result.addRow(row);
					});
					organizationsQuery.on("end", function(result) {
						profile.organizations = result.rows;

						// Query the database to find the user's created Events
						var eventsQuery = client.query({
							text : "SELECT event_name, event_start_date, event_location, event_venue FROM event WHERE customer_username = $1 AND event_visibility",
							values : [req.params.username]
						});
						eventsQuery.on("row", function(row, result) {
							result.addRow(row);
						});
						eventsQuery.on("end", function(result) {
							profile.events = result.rows;

							res.json({
								info : profile.info,
								teams : profile.teams,
								origanizations : profile.organizations,
								events : profile.events
							});
							client.end();
						});
					});
				});
			} else {
				client.end();
				return res.status(404).send('Oh, no! This user does not exist');
			};
		});
	});
};

// /create/account - Create a new user account
var createAccount = function(req, res, pg, conString, jwt, secret) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		//TODO Create the salt and hash the password before starting this transaction
		client.query("START TRANSACTION");
		client.query({
			text : "INSERT INTO customer" + 
			" (customer_username, customer_first_name, customer_last_name, customer_tag, customer_password, customer_salt, customer_active)" + 
			" VALUES ($1, $2, $3, $4, $5, $6, TRUE)",
			values : [req.body.info[0], // customer_username*
			req.body.info[1], // customer_first_name*
			req.body.info[2], // customer_last_name*
			req.body.info[3], // customer_tag*
			req.body.info[4], // customer_password*
			"somesalt"]
		}, function(err, result) {
			if (err) {
				res.status(400).send("Oh, no! Disaster!");
				client.end();
			} else {
				client.query({
					text : "INSERT INTO of_email (customer_username, email_address) VALUES ($1, $2)",
					values : [req.body.info[0], // customer_username*
					req.body.info[5] // email_address*
					]
				}, function(err, result) {
					if (err) {
						res.status(400).send("Oh, no! Disaster!");
						client.end();
					} else {
						var response = {
							username : req.body.info[0]
						};
						// We are sending the username inside the token
						var token = jwt.sign(response, secret);

						res.status(201).json({
							token : token
						});
						client.query("COMMIT");
						client.end();
					}
				});
			}
		});
	});
};

var createTeam = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		console.log(req.body.info);
		client.query("START TRANSACTION");
		client.query({
			text : "INSERT INTO team (team_name, team_logo, team_bio, team_cover_photo, team_active) VALUES ($1, $2, $3, $4, TRUE)",
			values : [req.body.info[0], // team_name*
			req.body.info[1], // team_logo*
			req.body.info[2], // team_bio*
			req.body.info[3] // team_cover_photo*
			]
		}, function(err, result) {
			if (err) {
				res.status(400).send("Oh, no! Disaster!");
				client.end();
			} else {
				client.query({
					text : "INSERT INTO plays_for (customer_username, team_name) VALUES ($1, $2)",
					values : [req.user.username,
					req.body.info[0] // team_name
					]
				}, function(err, result) {
					if (err) {
						res.status(400).send("Oh, no! Disaster in INSERT INTO plays_for!");
						client.end();
					} else {
						client.query({
							text : "INSERT INTO captain_for (customer_username, team_name) VALUES ($1, $2)",
							values : [req.user.username,
							req.body.info[0] // team_name
							]
						}, function(err, result) {
							if (err) {
								res.status(400).send("Oh, no! Disaster in INSERT INTO captain_for!");
								client.end();
							} else {
								res.status(201).send("HELLOOOOOO!"); //TODO Send something here if needed
								client.query("COMMIT");
								client.end();
							}
						});
					}
				});
			}
		});
	});
};

module.exports.getMyProfile = getMyProfile;
module.exports.getUserProfile = getUserProfile;
module.exports.createAccount = createAccount;
module.exports.createTeam = createTeam;
