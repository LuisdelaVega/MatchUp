var getOrganizations = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizations = client.query({
			text : "SELECT organization_name, organization_logo, organization_bio, organization_cover_photo FROM organization WHERE organization_active"
		});
		queryOrganizations.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizations.on("end", function(result) {
			res.status(200).json(result.rows);
			done();
			
		});
	});
};

var getOrganization = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganization = client.query({
			text : "SELECT organization_name, organization_logo, organization_bio, organization_cover_photo, bool_and(customer_username = $1) AS is_member FROM organization NATURAL JOIN belongs_to NATURAL JOIN customer WHERE organization_active AND customer_active AND organization_name = $2 GROUP BY organization_name",
			values : [req.user.username, req.params.organization]
		});
		queryOrganization.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganization.on("end", function(result) {
			if (result.rows.length) {
				done();
				
				res.status(200).json(result.rows[0]);
			} else {
				done();
				
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
			done();
			
			return res.status(401).send('');
		}

		queryText += " WHERE organization_name = $1 AND organization_name IN (SELECT organization_name FROM belongs_to NATURAL JOIN customer WHERE customer_username = $2 AND customer_active) AND organization_active";
		var editQuery = client.query({
			text : queryText,
			values : [req.params.organization, req.user.username]
		}, function(err, result) {
			if (err) {
				res.status(400).send("Oh, no! Disaster!");
				done();
				
			} else {
				res.status(204).send('');
			}
		});
	});
};

// Turn an Organization inactive
var deleteOrganization = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var deleteQuery = client.query({
			text : "UPDATE organization SET organization_active = FALSE WHERE organization_name = $1 AND organization_name IN (SELECT organization_name FROM owns NATURAL JOIN customer WHERE customer_username = $2 AND customer_active)",
			values : [req.params.organization, req.user.username]
		}, function(err, result) {
			if (err) {
				res.status(400).send("Oh, no! Disaster!");
				done();
				
			} else {
				res.status(204).send('');
			}
		});
	});
};

var getOrganizationMembers = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, bool_and(customer_username IN (SELECT customer_username FROM owns WHERE organization_name = $1)) AS is_owner FROM belongs_to NATURAL JOIN customer WHERE organization_name = $1 GROUP BY customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic",
			values : [req.params.organization]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.status(200).json(result.rows);
			done();
			
		});
	});
};

var getOrganizationEvents = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT event_name, event_location, event_venue, event_start_date, event_end_date, event_logo FROM event NATURAL JOIN hosts WHERE event_active AND organization_name = $1 ORDER BY event_start_date DESC",
			values : [req.params.organization]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.status(200).json(result.rows);
			done();
			
		});
	});
};

var addOrganizationMember = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		var queryMe = client.query({
			text : "SELECT organization_name FROM customer NATURAL JOIN belongs_to NATURAL JOIN organization" + (!(req.query.owner) ? "" : " NATURAL JOIN owns") + " WHERE customer_username = $1 AND organization_active AND customer_active AND organization_name = $2",
			values : [req.user.username, req.params.organization]
		});
		queryMe.on("row", function(row, result) {
			result.addRow(row);
		});
		queryMe.on("end", function(result) {
			if (result.rows.length > 0) {
				if (req.query.owner) {
					var queryMember = client.query({
						text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
						values : [req.query.username]
					});
					queryMember.on("row", function(row, result) {
						result.addRow(row);
					});
					queryMember.on("end", function(result) {
						if (result.rows.length > 0) {
							client.query({
								text : "INSERT INTO owns (customer_username, organization_name) VALUES ($1, $2)",
								values : [req.query.username, req.params.organization]
							}, function(err, result) {
								if (err) {
									res.status(400).send("Oh, no! This user is already an owner of this organization dummy");
									done();
									
								} else {
									var queryMember = client.query({
										text : "SELECT organization_name FROM belongs_to NATURAL JOIN organization WHERE customer_username = $1 AND organization_active AND organization_name = $2",
										values : [req.query.username, req.params.organization]
									});
									queryMember.on("row", function(row, result) {
										result.addRow(row);
									});
									queryMember.on("end", function(result) {
										// Add the user as a member if he/she wasn't a member already
										if (!result.rows.length) {
											client.query({
												text : "INSERT INTO belongs_to (customer_username, organization_name) VALUES ($1, $2)",
												values : [req.query.username, req.params.organization]
											}, function(err, result) {
												if (err) {
													res.status(500).send("Oh, no! Disaster!");
													done();
													
												} else {
													client.query("COMMIT");
													res.status(201).send('This user has been added! Yay!');
													done();
													
												}
											});
										} else {
											client.query("COMMIT");
											res.status(201).send("This member has been promoted! Yay!");
											done();
											
										}
									});
								}
							});
						} else {
							res.status(400).send("Oh, no! This user does not exist");
							done();
							
						}
					});
				} else {
					client.query({
						text : "INSERT INTO belongs_to (customer_username, organization_name) VALUES ($1, $2)",
						values : [req.query.username, req.params.organization]
					}, function(err, result) {
						if (err) {
							res.status(400).send("Oh, no! This user is already a member of this organization dummy");
							done();
							
						} else {
							client.query("COMMIT");
							res.status(201).send("This member has been promoted! Yay!");
						}
					});
				}
			} else {
				done();
				
				res.status(401).send('Oh, no! It seems you are do not have enough privileges to do this');
			}
		});
	});
};

var getSponsors = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		//select * from sponsors natural join shows where event_name = 'Event 01'
		var queryOrganizers = client.query({
			text : "SELECT sponsor_name, sponsor_logo, sponsor_link FROM sponsors NATURAL JOIN is_confirmed WHERE organization_name = $1",
			values : [req.params.organization]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			done();
			
			res.status(200).json(result.rows);
		});
	});
};

var requestSponsor = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		var queryOrganizers = client.query({
			text : "SELECT customer_username FROM belongs_to NATURAL JOIN organization WHERE organization_name = $1 AND customer_username = $2 AND organization_active",
			values : [req.params.organization]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text : "INSERT INTO request_sponsor (request_sponsor_name, organization_name, request_sponsor_link, request_sponsor_description) VALUES ($1, $2, $3, $4)",
					values : [req.body.name, req.params.organization, req.body.link, req.body.description]
				}, function(err, result) {
					if (err) {
						res.status(500).send("Oh, no! Disaster!");
						done();
						
					} else {
						client.query("COMMIT");
						done();
						
						res.status(202).send("Request sent");
					}
				});
			} else {
				done();
				
				res.status(403).send("You are not part of this organization");
			}
		});
	});
};

var removeSponsor = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		var queryOrganizers = client.query({
			text : "SELECT customer_username FROM belongs_to NATURAL JOIN organization WHERE organization_name = $1 AND customer_username = $2 AND organization_active",
			values : [req.params.organization, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				console.log("Gonna delete from is_confirmed now");
				client.query({
					text : "DELETE FROM is_confirmed WHERE organization_name = $1 AND sponsor_name = $2",
					values : [req.params.organization, req.query.sponsor]
				}, function(err, result) {
					if (err) {
						res.status(500).send("Oh, no! Disaster!");
						done();
						
					} else {
						client.query("COMMIT");
						done();
						
						res.status(204).send('');
					}
				});
			} else {
				done();
				
				res.status(403).send("You are not part of this organization");
			}
		});
	});
};

var removeOrganizationMember = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		// Look for whether or not the user that issued the request belongs to this organization and if he/she owns the organization
		var queryMe = client.query({
			text : "SELECT customer_username, bool_and(customer_username IN (SELECT customer_username FROM owns WHERE organization_name = $1)) AS is_owner FROM customer NATURAL JOIN belongs_to NATURAL JOIN organization WHERE organization_name = $1 AND customer_username = $2 AND organization_active AND customer_active GROUP BY customer_username",
			values : [req.params.organization, req.user.username]
		});
		queryMe.on("row", function(row, result) {
			result.addRow(row);
		});
		queryMe.on("end", function(result) {
			if (result.rows.length > 0) {
				var reqMember = result.rows[0];
				// Do the same for the user that is to be removed
				var queryMember = client.query({
					text : "SELECT customer_username, bool_and(customer_username IN (SELECT customer_username FROM owns WHERE organization_name = $1)) AS is_owner FROM customer NATURAL JOIN belongs_to NATURAL JOIN organization WHERE organization_name = $1 AND customer_username = $2 AND organization_active AND customer_active GROUP BY customer_username",
					values : [req.params.organization, req.query.username]
				});
				queryMember.on("row", function(row, result) {
					result.addRow(row);
				});
				queryMember.on("end", function(result) {
					if (result.rows.length > 0) {
						var member = result.rows[0];
						if (member.customer_username === reqMember.customer_username && reqMember.is_owner) {
							var queryMember = client.query({
								text : "SELECT customer_username FROM owns NATURAL JOIN organization WHERE organization_name = $1 AND customer_username <> $2 AND organization_active GROUP BY customer_username",
								values : [req.params.organization, reqMember.customer_username]
							});
							queryMember.on("row", function(row, result) {
								result.addRow(row);
							});
							queryMember.on("end", function(result) {
								if (!result.rows.length) {
									res.status(403).send("Oh, no! You can't leave an organization without an owner dummy");
									done();
									
								} else {
									client.query({
										text : "DELETE FROM owns WHERE customer_username = $1 AND organization_name = $2",
										values : [member.customer_username, req.params.organization]
									}, function(err, result) {
										if (err) {
											res.status(500).send("Oh, no! Disaster!");
											done();
											
										} else {
											client.query({
												text : "DELETE FROM belongs_to WHERE customer_username = $1 AND organization_name = $2",
												values : [member.customer_username, req.params.organization]
											}, function(err, result) {
												if (err) {
													res.status(500).send("Oh, no! Disaster!");
													done();
													
												} else {
													client.query("COMMIT");
													res.status(204).send('');
												}
											});
										}
									});
								}
							});
						} else {
							// A member can't remove owners. Owners can remove who they want
							if (member.is_owner && reqMember.is_owner) {
								client.query({
									text : "DELETE FROM owns WHERE customer_username = $1 AND organization_name = $2",
									values : [member.customer_username, req.params.organization]
								}, function(err, result) {
									if (err) {
										res.status(400).send("Oh, no! Disaster");
										done();
										
									} else {
										client.query({
											text : "DELETE FROM belongs_to WHERE customer_username = $1 AND organization_name = $2",
											values : [member.customer_username, req.params.organization]
										}, function(err, result) {
											if (err) {
												res.status(400).send("Oh, no! Disaster!");
												done();
												
											} else {
												client.query("COMMIT");
												res.status(204).send('');
											}
										});
									}
								});
							} else if (!member.is_owner) {
								client.query({
									text : "DELETE FROM belongs_to WHERE customer_username = $1 AND organization_name = $2",
									values : [member.customer_username, req.params.organization]
								}, function(err, result) {
									if (err) {
										res.status(400).send("Oh, no! Disaster!");
										done();
										
									} else {
										client.query("COMMIT");
										res.status(204).send('');
									}
								});
							} else {
								done();
								
								res.status(401).send('Oh, no! It seems you are do not have enough privileges to do this');
							}
						}
					} else {
						done();
						
						res.status(401).send('Oh, no! It seems this user is not a member of this organization');
					}
				});
			} else {
				done();
				
				res.status(401).send('Oh, no! It seems you are not a member of this organization');
			}
		});
	});
};

module.exports.getOrganizations = getOrganizations;
module.exports.getOrganization = getOrganization;
module.exports.editOrganization = editOrganization;
module.exports.deleteOrganization = deleteOrganization;
module.exports.getOrganizationMembers = getOrganizationMembers;
module.exports.getOrganizationEvents = getOrganizationEvents;
module.exports.addOrganizationMember = addOrganizationMember;
module.exports.removeOrganizationMember = removeOrganizationMember;
module.exports.getSponsors = getSponsors;
module.exports.requestSponsor = requestSponsor;
module.exports.removeSponsor = removeSponsor;
