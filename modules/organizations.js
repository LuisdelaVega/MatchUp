var getOrganizations = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var organizationsQuery = client.query({
			text : "SELECT organization_name, organization_logo, organization_bio, organization_cover_photo FROM organization WHERE organization_active"
		});
		organizationsQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		organizationsQuery.on("end", function(result) {
			res.json(result.rows);
			client.end();
		});
	});
};

var getOrganization = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var organizationsQuery = client.query({
			text : "SELECT organization_name, organization_logo, organization_bio, organization_cover_photo, bool_and(customer_username = $1) AS my_organization" + 
			" FROM organization NATURAL JOIN belongs_to WHERE organization_active AND organization_name = $2 GROUP BY organization_name",
			values : [req.user.username, req.params.organization]
		});
		organizationsQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		organizationsQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				var organization = new Object();
				// organization.info = new Object();
				organization.info = result.rows[0];
				var membersQuery = client.query({
					text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag," + 
					" customer.customer_profile_pic, bool_and(customer.customer_username IN (SELECT customer_username FROM owns WHERE organization_name = $1)) as is_owner" + 
					" FROM customer NATURAL JOIN belongs_to WHERE customer_active AND organization_name = $1 GROUP BY customer.customer_username",
					values : [req.params.organization]
				});
				membersQuery.on("row", function(row, result) {
					result.addRow(row);
				});
				membersQuery.on("end", function(result) {
					// organization.members = new Object();
					organization.members = result.rows;
					var eventsQuery = client.query({
						text : "SELECT event.event_name, event.event_location, event.event_venue, event.event_logo" + 
						" FROM event NATURAL JOIN hosts WHERE event_visibility AND organization_name = $1",
						values : [req.params.organization]
					});
					eventsQuery.on("row", function(row, result) {
						result.addRow(row);
					});
					eventsQuery.on("end", function(result) {
						// organization.events = new Object();
						organization.events = result.rows;
						res.json(organization);
						client.end();
					});
				});
			} else {
				client.end();
				res.status(404).send('Oh, no! This organization does not exist');
			};
		});
	});
};

var editOrganization = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryText = "UPDATE organization SET";
		if (req.body.logo) {
			queryText += " organization_logo = '" + req.body.logo + "'";
		}
		if (req.body.bio) {
			queryText += " organization_bio = '" + req.body.bio + "'";
		}
		if (req.body.cover) {
			queryText += " organization_cover = '" + req.body.cover + "'";
		}

		if (!req.body.logo && !req.body.bio && !req.body.cover) {
			client.end();
			return res.status(401).send('');
		}

		queryText += " WHERE organization_name = $1 AND organization_name IN (SELECT organization_name FROM belongs_to WHERE customer_username = $2) AND organization_active";
		var organizationsQuery = client.query({
			text : queryText,
			values : [req.params.organization, req.user.username]
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

// /organizations/:organization - Turn an Organization inactive
var deleteOrganization = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var organizationsQuery = client.query({
			text : "UPDATE organization SET organization_active = FALSE" + 
			" WHERE organization_name = $1 AND organization_name IN (SELECT organization_name FROM owns WHERE customer_username = $2)",
			values : [req.params.organization, req.user.username]
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

var addOrganizationMember = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		var memberQuery = client.query({
			text : "SELECT organization.organization_name FROM belongs_to NATURAL JOIN organization" + 
			(!(req.query.owner) ? "" : " NATURAL JOIN owns") + " WHERE customer_username = $1 AND organization_active AND organization_name = $2",
			values : [req.user.username, req.params.organization]
		});
		memberQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		memberQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				if (req.query.owner) {
					client.query({
						text : "INSERT INTO owns (customer_username, organization_name) VALUES ($1, $2)",
						values : [req.params.username, req.params.organization]
					}, function(err, result) {
						if (err) {
							res.status(400).send("Oh, no! This user is already an owner of this organization dummy");
							client.end();
						} else {
							var memberQuery = client.query({
								text : "SELECT organization.organization_name FROM belongs_to NATURAL JOIN organization WHERE customer_username = $1 AND organization_active AND organization_name = $2",
								values : [req.params.username, req.params.organization]
							});
							memberQuery.on("row", function(row, result) {
								result.addRow(row);
							});
							memberQuery.on("end", function(result) {
								if (result.rows.length < 0) {
									client.query({
										text : "INSERT INTO belongs_to (customer_username, organization_name) VALUES ($1, $2)",
										values : [req.params.username, req.params.organization]
									}, function(err, result) {
										if (err) {
											res.status(401).send("Oh, no! Disaster!");
											client.end();
										} else {
											client.query("COMMIT");
											res.status(204).send('');
											client.end();
										}
									});
								} else {
									client.query("COMMIT");
									res.status(201).send("This member has been promoted! Yay!");
									client.end();
								}
							});
						}
					});
				} else {
					client.query({
						text : "INSERT INTO belongs_to (customer_username, organization_name) VALUES ($1, $2)",
						values : [req.params.username, req.params.organization]
					}, function(err, result) {
						if (err) {
							res.status(400).send("Oh, no! This user is already a member of this organization dummy");
							client.end();
						} else {
							client.query("COMMIT");
							res.status(204).send('');
						}
					});
				}
			} else {
				client.end();
				return res.status(401).send('Oh, no! It seems you are do not have enough privileges to do this');
			}
		});
	});
};

var removeMember = function(req, res, pg, conString) {

};

module.exports.getOrganizations = getOrganizations;
module.exports.getOrganization = getOrganization;
module.exports.editOrganization = editOrganization;
module.exports.deleteOrganization = deleteOrganization;
module.exports.addOrganizationMember = addOrganizationMember;
