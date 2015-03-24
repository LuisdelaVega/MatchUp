//TODO Edit organization, delete organization
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
			text : "SELECT organization_name, organization_logo, organization_bio, organization_cover_photo FROM organization WHERE organization_active AND organization_name = $1",
			values : [req.params.organization]
		});
		organizationsQuery.on("row", function(row, result) {
			result.addRow(row);
		});
		organizationsQuery.on("end", function(result) {
			if (result.rows.length > 0) {
				var organization = new Object();
				organization.info = new Object();
				organization.info = result.rows[0];
				var membersQuery = client.query({
					text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic" + 
					" FROM customer NATURAL JOIN belongs_to WHERE customer.customer_username NOT IN (SELECT customer.customer_username" + 
					" FROM customer NATURAL JOIN owns WHERE organization_name = $1)" + 
					" AND customer_active AND organization_name = $1",
					values : [req.params.organization]
				});
				membersQuery.on("row", function(row, result) {
					result.addRow(row);
				});
				membersQuery.on("end", function(result) {
					organization.members = new Object();
					organization.members = result.rows;
					var ownersQuery = client.query({
						text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic" + 
						" FROM customer NATURAL JOIN owns WHERE customer_active AND organization_name = $1",
						values : [req.params.organization]
					});
					ownersQuery.on("row", function(row, result) {
						result.addRow(row);
					});
					ownersQuery.on("end", function(result) {
						organization.owners = new Object();
						organization.owners = result.rows;
						var eventsQuery = client.query({
							text : "SELECT event.event_name, event.event_location, event.event_venue, event.event_logo" + 
							" FROM event NATURAL JOIN hosts WHERE event_visibility AND organization_name = $1",
							values : [req.params.organization]
						});
						eventsQuery.on("row", function(row, result) {
							result.addRow(row);
						});
						eventsQuery.on("end", function(result) {
							organization.events = new Object();
							organization.events = result.rows;
							res.json(organization);
							client.end();
						});
					});
				});
			} else {
				client.end();
				return res.status(404).send('Oh, no! This organization does not exist');
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
			return res.status(401).send("Tu mai");
		}

		queryText += " WHERE organization_name = '" + req.params.organization + "'";
		var organizationsQuery = client.query({
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

var deleteOrganization = function(req, res, pg, conString) {
	//DELETE FROM organization
};

module.exports.getOrganizations = getOrganizations;
module.exports.getOrganization = getOrganization;
module.exports.editOrganization = editOrganization;
