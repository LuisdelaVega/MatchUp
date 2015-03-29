//TODO Create Organization
//TODO Create Event
//TODO Subscribe to user
//TODO Unsubscribe to user

//TODO Calculate the matches won/lost for the profile pages
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
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
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
					text : "SELECT team_name, team_logo, team_bio, team_cover_photo FROM team NATURAL JOIN plays_for WHERE customer_username = $1 AND team_active",
					values : [req.params.username]
				});
				teamsQuery.on("row", function(row, result) {
					result.addRow(row);
				});
				teamsQuery.on("end", function(result) {
					profile.teams = result.rows;

					// Query the database to find the user's Organizations
					var organizationsQuery = client.query({
						text : "SELECT organization_name, organization_logo FROM organization NATURAL JOIN belongs_to WHERE customer_username = $1 AND organization_active",
						values : [req.params.username]
					});
					organizationsQuery.on("row", function(row, result) {
						result.addRow(row);
					});
					organizationsQuery.on("end", function(result) {
						profile.organizations = result.rows;

						// Query the database to find the user's created Events
						var eventsQuery = client.query({
							text : "SELECT event_name, event_start_date, event_location, event_venue FROM event WHERE customer_username = $1 AND event_active",
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
				res.status(404).send('Oh, no! This user does not exist');
				client.end();
			};
		});
	});
};

var editAccount = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryText = "UPDATE customer SET";
		if (req.body.firstname) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_first_name = '" + req.body.firstname + "'";
		}
		if (req.body.lastname) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_last_name = '" + req.body.lastname + "'";
		}
		if (req.body.tag) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_tag = '" + req.body.tag + "'";
		}
		if (req.body.paypal) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_paypal_info = '" + req.body.paypal + "'";
		}
		if (req.body.profilepic) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_profile_pic = '" + req.body.profilepic + "'";
		}
		if (req.body.cover) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_cover_photo = '" + req.body.cover + "'";
		}
		if (req.body.bio) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_bio = '" + req.body.bio + "'";
		}
		if (req.body.country) {
			queryText += ((queryText === "UPDATE customer SET") ? "" : ",") + " customer_country = '" + req.body.country + "'";
		}

		if (!req.body.firstname && !req.body.lastname && !req.body.tag && !req.body.paypal && !req.body.profilepic && !req.body.cover && !req.body.bio && !req.body.country) {
			client.end();
			return res.status(401).send("Oh no! Disaster");
		}

		queryText += " WHERE customer_username = '" + req.user.username + "' AND customer_active";
		console.log(queryText);
		client.query({
			text : queryText
		}, function(err, result) {
			if (err) {
				res.status(500).send("Oh, no! Disaster!");
				client.end();
			} else {
				client.end();
				res.status(204).send('');
			}
		});
	});
};

var deleteAccount = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var profileQuery = client.query({
			text : "SELECT customer_username FROM captain_for NATURAL JOIN owns WHERE customer_username = $1 AND customer_active",
			values : [req.user.username]
		});
		profileQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		profileQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				client.query({
					text : "UPDATE customer SET customer_active = FALSE WHERE customer_username = $1",
					values : [req.user.username]
				}, function(err, result) {
					if (err) {
						res.status(500).send("Oh, no! Disaster!");
						client.end();
					} else {
						res.status(204).send('');
					}
				});
			} else {
				res.status(403).send("Oh, no! Relinquish your captain/owner titles before deleting dummy");
				client.end();
			}
		});
	});
};

// /create/account - Create a new user account
var createAccount = function(req, res, pg, conString, jwt, secret, crypto) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		//TODO Create the salt and hash the password before starting this transaction
		var salt = crypto.randomBytes(189).toString('base64');
		crypto.pbkdf2(req.body.password, salt, 4096, 127, 'sha256', function(err, key) {
			if (err)
				throw err;
			// var password = key.toString('hex');
			// console.log("password: " + key.toString('hex'));
			client.query("START TRANSACTION");
			client.query({
				text : "INSERT INTO customer (customer_username, customer_first_name, customer_last_name, customer_tag, customer_password, customer_salt, customer_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE)",
				values : [req.body.username, // customer_username*
				req.body.firstname, // customer_first_name*
				req.body.lastname, // customer_last_name*
				req.body.tag, // customer_tag*
				key.toString('hex'), // customer_password*
				salt] // customer_salt
			}, function(err, result) {
				if (err) {
					res.status(500).send("Oh, no! Disaster!");
					client.end();
				} else {
					client.query({
						text : "INSERT INTO of_email (customer_username, email_address) VALUES ($1, $2)",
						values : [req.body.username, // customer_username*
						req.body.email // email_address*
						]
					}, function(err, result) {
						if (err) {
							res.status(400).send("Oh, no! Disaster!");
							client.end();
						} else {
							var response = {
								username : req.body.username
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
	});
};

var createTeam = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		console.log(req.body.info);
		client.query("START TRANSACTION");

		var profileQuery = client.query({
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
			values : [req.user.username]
		});
		profileQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		profileQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				client.query({
					text : "INSERT INTO team (team_name, team_logo, team_bio, team_cover_photo, team_active) VALUES ($1, $2, $3, $4, TRUE)",
					values : [req.body.name, // team_name*
					req.body.logo, // team_logo*
					req.body.bio, // team_bio*
					req.body.cover // team_cover_photo*
					]
				}, function(err, result) {
					if (err) {
						res.status(400).send("Oh, no! Disaster!");
						client.end();
					} else {
						client.query({
							text : "INSERT INTO plays_for (customer_username, team_name) VALUES ($1, $2)",
							values : [req.user.username, req.body.name // team_name
							]
						}, function(err, result) {
							if (err) {
								res.status(400).send("Oh, no! Disaster in INSERT INTO plays_for!");
								client.end();
							} else {
								client.query({
									text : "INSERT INTO captain_for (customer_username, team_name) VALUES ($1, $2)",
									values : [req.user.username, req.body.name]
								}, function(err, result) {
									if (err) {
										res.status(400).send("Oh, no! Disaster in INSERT INTO captain_for!");
										client.end();
									} else {
										res.status(201).send("HELLOOOOOO!");
										//TODO Send something here if needed
										client.query("COMMIT");
										client.end();
									}
								});
							}
						});
					}
				});
			} else {
				res.status(401).send("Oh, no! It seems this user does not exist");
				client.end();
			}
		});
	});
};

module.exports.getMyProfile = getMyProfile;
module.exports.getUserProfile = getUserProfile;
module.exports.createAccount = createAccount;
module.exports.deleteAccount = deleteAccount;
module.exports.createTeam = createTeam;
