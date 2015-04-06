//TODO Register for Event
//TODO Register for Tournament

//TODO Calculate the matches won/lost for the profile pages
var getMyProfile = function(req, res, pg, conString, log) {
	var username = new Object();
	username.params = new Object();
	username.user = new Object();
	username.params.username = req.user.username;
	username.user.username = req.user.username;

	getUserProfile(username, res, pg, conString, log);
};

var getUserProfile = function(req, res, pg, conString, log) {
	// Query the DB to find the account
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the user's account
		var query = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
			values : [req.user.username, req.params.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			done();
			if (result.rows.length) {
				res.status(200).json(result.rows[0]);

			} else {
				res.status(404).send("User: " + req.params.username + " was not not found");
			}
			log.info({
				res : res
			}, 'done response');
		});
	});
};

var getSubscriptions = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the user's account
		var query = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
			values : [req.user.username, req.params.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				var query = client.query({
					text : "SELECT customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic FROM customer JOIN subscribed_to ON customer.customer_username = subscribed_to.interest WHERE subscribed_to.subscriber = $1 AND customer.customer_active",
					values : [req.params.username]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					done();
					res.status(500).send(error);
					log.info({
						res : res
					}, 'done response');
				});
				query.on("end", function(result) {
					done();
					res.status(200).send(result.rows);
					log.info({
						res : res
					}, 'done response');
				});
			} else {
				done();
				res.status(404).send("User: " + req.params.username + " was not not found");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var getTeams = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the user's account
		var query = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
			values : [req.user.username, req.params.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				var query = client.query({
					text : "SELECT team_name, team_logo, team_cover_photo FROM team NATURAL JOIN plays_for WHERE customer_username = $1 AND team_active",
					values : [req.params.username]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					done();
					res.status(500).send(error);
					log.info({
						res : res
					}, 'done response');
				});
				query.on("end", function(result) {
					done();
					res.status(200).send(result.rows);
					log.info({
						res : res
					}, 'done response');
				});
			} else {
				done();
				res.status(404).send("User: " + req.params.username + " was not not found");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var getOrganizations = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
			values : [req.user.username, req.params.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			done();
			if (result.rows.length) {
				var query = client.query({
					text : "SELECT organization_name, organization_logo, organization_cover_photo FROM organization NATURAL JOIN belongs_to WHERE customer_username = $1 AND organization_active",
					values : [req.params.username]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					done();
					res.status(500).send(error);
					log.info({
						res : res
					}, 'done response');
				});
				query.on("end", function(result) {
					done();
					res.status(200).send(result.rows);
					log.info({
						res : res
					}, 'done response');
				});
			} else {
				res.status(404).send("User: " + req.params.username + " was not not found");
			}
			log.info({
				res : res
			}, 'done response');
		});
	});
};

var getEvents = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
			values : [req.user.username, req.params.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				var query = client.query({
					text : "SELECT event_name, event_start_date, event_end_date, event_location, event_logo, event_banner FROM event WHERE customer_username = $1 AND event_active",
					values : [req.params.username]
				});
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on('error', function(error) {
					done();
					res.status(500).send(error);
					log.info({
						res : res
					}, 'done response');
				});
				query.on("end", function(result) {
					done();
					res.status(200).send(result.rows);
					log.info({
						res : res
					}, 'done response');
				});

			} else {
				done();
				res.status(404).send("User: " + req.params.username + " was not not found");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var getRegisteredEvents = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
			values : [req.user.username, req.params.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				if (!req.query.type) {
					done();
					res.status(400).send("No type specified");
					log.info({
						res : res
					}, 'done response');
				} else if (req.query.type === "spectator") {
					var query = client.query({
						text : "SELECT DISTINCT event.event_name, event.event_start_date, event.event_end_date, event.event_location, event.event_logo, event_banner FROM pays JOIN event ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location WHERE pays.customer_username = $1 AND event.event_active",
						values : [req.params.username]
					});
					query.on("row", function(row, result) {
						result.addRow(row);
					});
					query.on('error', function(error) {
						done();
						res.status(500).send(error);
						log.info({
							res : res
						}, 'done response');
					});
					query.on("end", function(result) {
						done();
						res.status(200).send(result.rows);
						log.info({
							res : res
						}, 'done response');
					});
				} else if (req.query.type === "competitor") {
					var query = client.query({
						text : "SELECT DISTINCT event.event_name, event.event_start_date, event.event_end_date, event.event_location, event.event_logo, event_banner FROM is_a JOIN event ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location WHERE is_a.customer_username = $1 AND event.event_active",
						values : [req.params.username]
					});
					query.on("row", function(row, result) {
						result.addRow(row);
					});
					query.on('error', function(error) {
						done();
						res.status(500).send(error);
						log.info({
							res : res
						}, 'done response');
					});
					query.on("end", function(result) {
						done();
						res.status(200).send(result.rows);
						log.info({
							res : res
						}, 'done response');
					});
				} else {
					done();
					res.status(400).send("No valid type specified. Posible values [spectator, competitor]");
					log.info({
						res : res
					}, 'done response');
				}

			} else {
				done();
				res.status(404).send("User: " + req.params.username + " was not not found");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var subscribe = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		if (req.user.username === req.params.username) {
			done();
			res.status(403).send("You can't subscribe to yourself");
			log.info({
				res : res
			}, 'done response');
		} else {
			var profile = new Object();
			client.query("START TRANSACTION");
			// Query the database to find the user's account
			var query = client.query({
				text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, of_email.email_address, bool_and(customer_username = $1) AS my_profile FROM customer NATURAL JOIN of_email WHERE customer_username = $2 AND customer_active GROUP BY customer_username, email_address",
				values : [req.user.username, req.params.username]
			});
			query.on("row", function(row, result) {
				result.addRow(row);
			});
			query.on('error', function(error) {
				done();
				res.status(500).send(error);
				log.info({
					res : res
				}, 'done response');
			});
			query.on("end", function(result) {
				if (result.rows.length) {
					client.query({
						text : "INSERT INTO subscribed_to (subscriber, interest) VALUES ($1, $2)",
						values : [req.user.username, req.params.username]
					}, function(err, result) {
						if (err) {
							client.query("ROLLBACK");
							done();
							res.status(500).send(err);
							log.info({
								res : res
							}, 'done response');
						} else {
							client.query("COMMIT");
							done();
							res.status(201).send("Subscribed to: " + req.params.username);
							log.info({
								res : res
							}, 'done response');
						}
					});

				} else {
					done();
					res.status(404).send("User: " + req.params.username + " was not not found");
					log.info({
						res : res
					}, 'done response');
				}
			});
		}
	});
};

var unsubscribe = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		client.query({
			text : "DELETE FROM subscribed_to WHERE subscriber = $1 AND interest = $2",
			values : [req.user.username, req.params.username]
		}, function(err, result) {
			if (err) {
				client.query("ROLLBACK");
				done();
				res.status(500).send(err);
				log.info({
					res : res
				}, 'done response');
			} else {
				client.query("COMMIT");
				done();
				res.status(204).send("Unsubscribed from: " + req.params.username);
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

//TODO Transaction
//TODO This is the correct way to implement an edit. If time allows it, you should modify the other edits (UPDATES) in the server to work like this one
var editAccount = function(req, res, pg, conString, log) {
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
			done();
			res.status(401).send("Oh no! Disaster");
			log.info({
				res : res
			}, 'done response');
		}

		queryText += " WHERE customer_username = '" + req.user.username + "' AND customer_active";
		client.query({
			text : queryText
		}, function(err, result) {
			if (err) {
				done();
				res.status(500).send(err);
				log.info({
					res : res
				}, 'done response');
			} else {
				done();
				res.status(204).send('');
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var deleteAccount = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT NOT bool_or(customer_username IN (SELECT customer_username FROM captain_for) OR customer_username IN (SELECT customer_username FROM owns)) AS can_delete FROM customer WHERE customer_username = $1",
			values : [req.user.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows[0].can_delete) {
				client.query({
					text : "UPDATE customer SET customer_active = FALSE WHERE customer_username = $1",
					values : [req.user.username]
				}, function(err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						res.status(500).send(err);
					} else {
						client.query("COMMIT");
						done();
						res.status(204).send('');
					}
					log.info({
						res : res
					}, 'done response');
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(403).send("Can't delete account. Still captain or owner");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var createAccount = function(req, res, pg, conString, jwt, secret, crypto, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var salt = crypto.randomBytes(189).toString('base64');
		crypto.pbkdf2(req.body.password, salt, 4096, 127, 'sha256', function(err, key) {
			if (err)
				throw err;
			client.query("BEGIN");
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
					client.query("ROLLBACK");
					done();
					res.status(500).send(err);
					log.info({
						res : res
					}, 'done response');
				} else {
					client.query({
						text : "INSERT INTO of_email (customer_username, email_address) VALUES ($1, $2)",
						values : [req.body.username, // customer_username*
						req.body.email // email_address*
						]
					}, function(err, result) {
						if (err) {
							client.query("ROLLBACK");
							done();
							res.status(500).send(err);
							log.info({
								res : res
							}, 'done response');
						} else {
							client.query("COMMIT");
							done();
							var response = {
								username : req.body.username
							};
							// We are sending the username inside the token
							var token = jwt.sign(response, secret);
							res.status(201).json({
								token : token
							});
							log.info({
								res : res
							}, 'done response');
						}
					});
				}
			});
		});
	});
};

var createTeam = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
			values : [req.user.username]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on('error', function(error) {
			client.query("ROLLBACK");
			done();
			res.status(500).send(error);
			log.info({
				res : res
			}, 'done response');
		});
		query.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text : "INSERT INTO team (team_name, team_logo, team_bio, team_cover_photo, team_active) VALUES ($1, $2, $3, $4, TRUE)",
					values : [req.body.name, // team_name*
					req.body.logo, // team_logo*
					req.body.bio, // team_bio*
					req.body.cover // team_cover_photo*
					]
				}, function(err, result) {
					if (err) {
						client.query("ROLLBACK");
						done();
						res.status(500).send(err);
						log.info({
							res : res
						}, 'done response');
					} else {
						client.query({
							text : "INSERT INTO plays_for (customer_username, team_name) VALUES ($1, $2)",
							values : [req.user.username, req.body.name // team_name
							]
						}, function(err, result) {
							if (err) {
								client.query("ROLLBACK");
								done();
								res.status(500).send(err);
								log.info({
									res : res
								}, 'done response');
							} else {
								client.query({
									text : "INSERT INTO captain_for (customer_username, team_name) VALUES ($1, $2)",
									values : [req.user.username, req.body.name]
								}, function(err, result) {
									if (err) {
										client.query("ROLLBACK");
										done();
										res.status(500).send(err);
									} else {
										client.query("COMMIT");
										done();
										res.status(201).json({
											team_name : req.body.name
										});
									}
									log.info({
										res : res
									}, 'done response');
								});
							}
						});
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(404).send("Couldn't find user: " + req.user.username);
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var requestOrganization = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		client.query({
			text : "INSERT INTO request (request_organization_name, customer_username, request_description) VALUES ($1, $2, $3)",
			values : [req.body.name, req.user.username, req.body.description]
		}, function(err, result) {
			if (err) {
				client.query("ROLLBACK");
				done();
				res.status(500).send("Oh, no! Disaster!");
			} else {
				client.query("COMMIT");
				done();
				res.status(202).send("Request sent");
			}
			log.info({
				res : res
			}, 'done response');
		});
	});
};

var createEvent = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var eventStartDate = new Date(req.body.event.start_date);
		var eventEndDate = new Date(req.body.event.end_date);
		var eventRegistrationDeadline = new Date(req.body.event.registration_deadline);
		if (!(eventStartDate.getTime()) || !(eventEndDate.getTime()) || !(eventRegistrationDeadline.getTime()) || eventRegistrationDeadline.getTime() > eventStartDate.getTime() || eventStartDate.getTime() > eventEndDate.getTime() || !req.body.event.name || !req.body.event.location || !req.user.username || !req.body.event.venue || !req.body.event.banner || !req.body.event.logo || !req.body.event.rules || !req.body.event.description || isNaN(req.body.event.deduction_fee) || req.body.event.deduction_fee < 0 || !req.body.event.is_online || !req.body.event.type) {
			client.query("ROLLBACK");
			done();
			res.status(400).json({
				error : "Incomplete or invalid parameters"
			});
			log.info({
				res : res
			}, 'done response');
		} else {
			client.query({
				text : "INSERT INTO event (event_name, event_start_date, event_location, customer_username, event_venue, event_banner, event_logo, event_end_date, event_registration_deadline, event_rules, event_description, event_deduction_fee, event_is_online, event_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
				values : [req.body.event.name, req.body.event.start_date, req.body.event.location, req.user.username, req.body.event.venue, req.body.event.banner, req.body.event.logo, req.body.event.end_date, req.body.event.registration_deadline, req.body.event.rules, req.body.event.description, req.body.event.deduction_fee, req.body.event.is_online, req.body.event.type]
			}, function(err, result) {
				if (err) {
					client.query("ROLLBACK");
					done();
					res.status(500).send(err);
					log.info({
						res : res
					}, 'done response');
				} else {
					if (!req.query.hosted) {
						var startDate = new Date(req.body.tournament[0].start_date);
						var checkInDeadline = new Date(req.body.tournament[0].deadline);
						if (!(startDate.getTime()) || !(checkInDeadline.getTime()) || startDate.getTime() < checkInDeadline.getTime() || startDate.getTime() < eventStartDate.getTime() || startDate.getTime() > eventEndDate.getTime() || !tournament[0].name || !tournament[0].game || !tournament[0].rules || !tournament[0].teams || isNaN(tournament[0].fee) || tournament[0].fee < 0 || isNaN(tournament[0].capacity) || tournament[0].capacity < 0 || isNaN(tournament[0].seed_money) || tournament[0].seed_money < 0 || !tournament[0].type || !tournament[0].format || !tournament[0].scoring || isNaN(tournament[0].group_players) || tournament[0].group_players < 0 || isNaN(tournament[0].group_winners) || tournament[0].group_winners < 0) {
							client.query("ROLLBACK");
							done();
							res.status(400).json({
								error : "Incomplete or invalid parameters"
							});
							log.info({
								res : res
							}, 'done response');
						} else {
							var query = client.query({
								text : "SELECT game_name FROM game WHERE game_name = $1",
								values : [tournament[0].game]
							});
							query.on("row", function(row, result) {
								result.addRow(row);
							});
							query.on('error', function(error) {
								client.query("ROLLBACK");
								done();
								res.status(500).send(error);
								log.info({
									res : res
								}, 'done response');
							});
							query.on("end", function(result) {
								if (result.rows.length) {
									client.query({
										text : "INSERT INTO tournament (event_name, event_start_date, event_location, tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
										values : [req.body.event.name, req.body.event.start_date, req.body.event.location, req.body.tournament[0].name, req.body.tournament[0].game, req.body.tournament[0].rules, req.body.tournament[0].teams, req.body.tournament[0].start_date, req.body.tournament[0].deadline, 0, 32, 0, req.body.tournament[0].type, req.body.tournament[0].format, req.body.tournament[0].scoring, ((req.body.tournament[0].type === "Two-Stage") ? req.body.tournament[0].group_players : 0), ((req.body.tournament[0].type === "Two-Stage") ? req.body.tournament[0].group_winners : 0)]
									}, function(err, result) {
										if (err) {
											client.query("ROLLBACK");
											done();
											res.status(500).send(err);
										} else {
											client.query("COMMIT");
											done();
											res.status(201).json({
												name : req.body.event.name,
												start_date : req.body.event.start_date,
												location : req.body.event.location
											});
										}
										log.info({
											res : res
										}, 'done response');
									});
								} else {
									client.query("ROLLBACK");
									done();
									res.status(404).json({
										error : "Couldn't find the game: " + tournament[0].game
									});
									log.info({
										res : res
									}, 'done response');
								}
							});
						}
					} else {
						var tournament = req.body.tournament;
						var i = 0;
						for ( i = 0; i < tournament.length; i++) {
							var startDate = new Date(req.body.tournament[i].start_date);
							var checkInDeadline = new Date(req.body.tournament[i].deadline);
							if (!(startDate.getTime()) || !(checkInDeadline.getTime()) || startDate.getTime() < checkInDeadline.getTime() || startDate.getTime() < eventStartDate.getTime() || startDate.getTime() > eventEndDate.getTime() || !tournament[i].name || !tournament[i].game || !tournament[i].rules || !tournament[i].teams || isNaN(tournament[i].fee) || tournament[i].fee < 0 || isNaN(tournament[i].capacity) || tournament[i].capacity < 0 || isNaN(tournament[i].seed_money) || tournament[i].seed_money < 0 || !tournament[i].type || !tournament[i].format || !tournament[i].scoring || isNaN(tournament[i].group_players) || tournament[i].group_players < 0 || isNaN(tournament[i].group_winners) || tournament[i].group_winners < 0) {
								client.query("ROLLBACK");
								done();
								res.status(400).json({
									error : "Incomplete or invalid parameters"
								});
								log.info({
									res : res
								}, 'done response');
							} else {
								var query = client.query({
									text : "SELECT game_name FROM game WHERE game_name = $1",
									values : [tournament[i].game]
								});
								query.on("row", function(row, result) {
									result.addRow(row);
								});
								query.on('error', function(error) {
									client.query("ROLLBACK");
									done();
									res.status(500).send(error);
									log.info({
										res : res
									}, 'done response');
								});
								query.on("end", function(result) {
									if (result.rows.length) {
										client.query({
											text : "INSERT INTO tournament (event_name, event_start_date, event_location, tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
											values : [req.body.event.name, req.body.event.start_date, req.body.event.location, tournament[i].name, tournament[i].game, tournament[i].rules, tournament[i].teams, tournament[i].start_date, tournament[i].deadline, Math.floor(tournament[i].fee * 100) / 100, tournament[i].capacity, Math.floor(tournament[i].seed_money * 100) / 100, tournament[i].type, tournament[i].format, tournament[i].scoring, ((tournament[i].type === "Two-Stage") ? tournament[i].group_players : 0), ((tournament[i].type === "Two-Stage") ? tournament[i].group_winners : 0)]
										}, function(err, result) {
											if (err) {
												client.query("ROLLBACK");
												done();
												res.status(500).send(err);
												log.info({
													res : res
												}, 'done response');
											}
										});
									} else {
										client.query("ROLLBACK");
										done();
										res.status(404).json({
											error : "Couldn't find the game: " + tournament[i].game
										});
										log.info({
											res : res
										}, 'done response');
									}
								});
							}
						}
						if (i == tournament.length) {
							var fees = req.body.fees;
							var j = 0;
							for ( j = 0; j < fees.length; j++) {
								if (!fees[j].name || isNaN(fees[j].amount) || fees[j].amount < 0 || !fees[j].description || isNaN(fees[j].available) || fees[j].available < 0) {
									client.query({
										text : "INSERT INTO spectator_fee (event_name, event_start_date, event_location, spec_fee_name, spec_fee_amount, spec_fee_description, spec_fee_amount_available) VALUES ($1, $2, $3, $4, $5, $6, $7)",
										values : [req.body.event.name, req.body.event.start_date, req.body.event.location, fees[j].name, Math.floor(fees[j].amount * 100) / 100, fees[j].description, fees[j].available]
									}, function(err, result) {
										if (err) {
											client.query("ROLLBACK");
											done();
											res.status(500).send(err);
											log.info({
												res : res
											}, 'done response');
										}
									});
								} else {
									client.query("ROLLBACK");
									done();
									res.status(400).json({
										error : "Incomplete or invalid parameters"
									});
									log.info({
										res : res
									}, 'done response');
								}
							}
							if (j == fees.length) {
								var sponsors = req.body.sponsors;
								var k = 0;
								for ( k = 0; k < sponsors.length; k++) {
									var querySponsors = client.query({
										text : "SELECT is_confirmed.sponsor_name FROM is_confirmed JOIN belongs_to ON is_confirmed.organization_name = belongs_to.organization_name WHERE customer_username = $1 AND sponsor_name = $2",
										values : [req.user.username, sponsors[k]]
									});
									querySponsors.on("row", function(row, result) {
										result.addRow(row);
									});
									query.on('error', function(error) {
										client.query("ROLLBACK");
										done();
										res.status(500).send(error);
										log.info({
											res : res
										}, 'done response');
									});
									querySponsors.on("end", function(result) {
										if (result.rows.length) {
											client.query({
												text : "INSERT INTO shows (event_name, event_start_date, event_location, sponsor_name) VALUES ($1, $2, $3, $4)",
												values : [req.body.event.name, req.body.event.start_date, req.body.event.location, result.rows[0].sponsor_name]
											}, function(err, result) {
												if (err) {
													client.query("ROLLBACK");
													done();
													res.status(500).send(err);
													log.info({
														res : res
													}, 'done response');
												}
											});
										}
									});
								}
								if (k == sponsors.length) {
									var query = client.query({
										text : "SELECT customer_username FROM customer NATURAL JOIN belongs_to NATURAL JOIN organization WHERE customer_username = $1 AND organization_name = $2 AND customer_active AND organization_active",
										values : [req.user.username, req.body.host]
									});
									query.on("row", function(row, result) {
										result.addRow(row);
									});
									query.on('error', function(error) {
										client.query("ROLLBACK");
										done();
										res.status(500).send(error);
										log.info({
											res : res
										}, 'done response');
									});
									query.on("end", function(result) {
										if (result.rows.length) {
											client.query({
												text : "INSERT INTO hosts (event_name, event_start_date, event_location, organization_name) VALUES ($1, $2, $3, $4)",
												values : [req.body.event.name, req.body.event.start_date, req.body.event.location, req.body.host]
											}, function(err, result) {
												if (err) {
													client.query("ROLLBACK");
													done();
													res.status(500).send(err);
												} else {
													client.query("COMMIT");
													done();
													res.status(201).json({
														name : req.body.event.name,
														start_date : req.body.event.start_date,
														location : req.body.event.location
													});
												}
												log.info({
													res : res
												}, 'done response');
											});
										} else {
											client.query("ROLLBACK");
											done();
											res.status(403).json({
												error : "You are not a member of: " + req.body.host
											});
											log.info({
												res : res
											}, 'done response');
										}
									});
								}
							}
						}
					}
				}
			});
		}
	});
};

module.exports.getMyProfile = getMyProfile;
module.exports.getUserProfile = getUserProfile;
module.exports.createAccount = createAccount;
module.exports.deleteAccount = deleteAccount;
module.exports.createTeam = createTeam;
module.exports.requestOrganization = requestOrganization;
module.exports.createEvent = createEvent;
module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;
module.exports.getSubscriptions = getSubscriptions;
module.exports.getTeams = getTeams;
module.exports.getOrganizations = getOrganizations;
module.exports.getEvents = getEvents;
module.exports.getRegisteredEvents = getRegisteredEvents;
