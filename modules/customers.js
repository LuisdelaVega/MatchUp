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
			text : "SELECT customer.customer_id, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_username, customer.customer_email, customer.customer_profile_pic, customer.customer_cover_photo, customer.customer_bio, customer.customer_country, customer.customer_region FROM customer WHERE customer_username = $1",
			values : [req.params.username]
		});
		profileQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		profileQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				profile.info = result.rows[0];

				// Query the database to find the user's Teams
				var teamsQuery = client.query({
					text : "SELECT team.* FROM customer natural join plays_for natural join team WHERE customer_username = $1",
					values : [req.params.username]
				});
				teamsQuery.on("row", function(row, result) {
					result.addRow(row);
				});
				teamsQuery.on("end", function(result) {
					profile.teams = result.rows;

					// Query the database to find the user's Organizations
					var organizationsQuery = client.query({
						text : "SELECT organization.* FROM customer natural join belongs_to natural join organization WHERE customer_username = $1",
						values : [req.params.username]
					});
					organizationsQuery.on("row", function(row, result) {
						result.addRow(row);
					});
					organizationsQuery.on("end", function(result) {
						profile.organizations = result.rows;

						// Query the database to find the user's created Events
						var eventsQuery = client.query({
							text : "select event.* from customer natural join creates natural join event where customer_username = $1",
							values : [req.params.username]
						});
						eventsQuery.on("row", function(row, result) {
							result.addRow(row);
						});
						eventsQuery.on("end", function(result) {
							profile.events = result.rows;

							if (req.params.username === req.user.username) {
								res.json({
									my_profile : true,
									info : profile.info,
									teams : profile.teams,
									origanizations : profile.organizations,
									events : profile.events
								});
							} else {
								res.json({
									my_profile : false,
									info : profile.info,
									teams : profile.teams,
									origanizations : profile.organizations,
									events : profile.events
								});
							}
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
var createAccount = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		console.log(req.body.acc_info);
		
		//TODO Modify this a bit. The ones that have an * are required. The others can be filled out later so they dont really have to be here
		// Query the database to find the account
		client.query({
			text : "INSERT INTO customer"+
			" (customer_first_name, customer_last_name, customer_tag, customer_username, customer_email, customer_password, customer_salt,"+
			" customer_paypal_info, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, customer_region)"+
			" VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
			values : [req.body.acc_info[0], // customer_first_name*  
			req.body.acc_info[1], // customer_last_name*
			req.body.acc_info[2], // customer_tag*  
			req.body.acc_info[3], // customer_username //TODO Borrar este. username no creo que sea necesario
			req.body.acc_info[4], // customer_email*
			req.body.acc_info[5], // customer_password*
			req.body.acc_info[6], // customer_salt*
			req.body.acc_info[7], // customer_paypal_info
			req.body.acc_info[8], // customer_profile_pic
			req.body.acc_info[9], // customer_cover_photo
			req.body.acc_info[10], // customer_bio
			req.body.acc_info[11], // customer_country
			req.body.acc_info[12] // customer_region
			]
		}, function(err, result) {
			if (err) {
				res.status(400).send("Disaster!");
				client.end();
			} else {
				res.status(201).json(result);
				client.end();
			}
		});
	});
};

//TODO This is not complete at all. 
var createTeam = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
				
		client.query("START TRANSACTION;");
		client.query({
			text : "INSERT INTO customer"+
			" (customer_first_name, customer_last_name, customer_tag, customer_username, customer_email, customer_password, customer_salt,"+
			" customer_paypal_info, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, customer_region)"+
			" VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
			values : [req.body.acc_info[0], // customer_first_name*  
			req.body.acc_info[1], // customer_last_name*
			req.body.acc_info[2], // customer_tag*  
			req.body.acc_info[3], // customer_username //TODO Borrar este. username no creo que sea necesario
			req.body.acc_info[4], // customer_email*
			req.body.acc_info[5], // customer_password*
			req.body.acc_info[6], // customer_salt*
			req.body.acc_info[7], // customer_paypal_info
			req.body.acc_info[8], // customer_profile_pic
			req.body.acc_info[9], // customer_cover_photo
			req.body.acc_info[10], // customer_bio
			req.body.acc_info[11], // customer_country
			req.body.acc_info[12] // customer_region
			]
		}, function(err, result) {
			if (err) {
				res.status(400).send("Disaster!");
				client.end();
			} else {
				res.status(201).json(result);
				client.end();
			}
		});
	});
};

module.exports.getMyProfile = getMyProfile;
module.exports.getUserProfile = getUserProfile;
module.exports.createAccount = createAccount;
