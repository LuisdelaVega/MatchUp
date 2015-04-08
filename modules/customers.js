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
			text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, customer_email, bool_and(customer_username = $1) AS my_profile FROM customer WHERE customer_username = $2 AND customer_active GROUP BY customer_username",
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
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
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
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
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
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
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
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
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
			text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
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
			client.query("BEGIN");
			// Query the database to find the user's account
			var query = client.query({
				text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
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

		client.query("BEGIN");
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
				res.status(204).send('');
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var editAccount = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		client.query({
			text : "UPDATE customer SET (customer_first_name, customer_last_name, customer_tag, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, customer_email) = ($1, $2, $3, $4, $5, $6, $7, $8) WHERE customer_username = $9",
			values : [req.body.first_name, req.body.last_name, req.body.tag, req.body.profile_pic, req.body.cover, req.body.bio, req.body.country, req.body.email, req.user.username]
		}, function(err, result) {
			if (err) {
				client.query("ROLLBACK");
				done();
				res.status(500).send(err);
			} else {
				client.query("COMMIT");
				done();
				res.status(200).send("Your account has been updated");
			}
			log.info({
				res : res
			}, 'done response');
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
					text : "UPDATE customer SET customer_active = false WHERE customer_username = $1",
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
				text : "INSERT INTO customer (customer_username, customer_first_name, customer_last_name, customer_tag, customer_password, customer_salt, customer_email, customer_active) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)",
				values : [req.body.username, // customer_username
				req.body.first_name, // customer_first_name
				req.body.last_name, // customer_last_name
				req.body.tag, // customer_tag
				key.toString('hex'), // customer_password
				salt, // customer_salt
				req.body.email] // customer_email
			}, function(err, result) {
				if (err) {
					client.query("ROLLBACK");
					done();
					res.status(500).send(err);
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
				}
				log.info({
					res : res
				}, 'done response');
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
			text : "SELECT team_name FROM team WHERE team_name = $1",
			values : [req.body.name]
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
			if (!result.rows.length) {
				client.query({
					text : "INSERT INTO team (team_name, team_logo, team_bio, team_cover_photo, team_active) VALUES ($1, $2, $3, $4, TRUE)",
					values : [req.body.name, // team_name
					req.body.logo, // team_logo
					req.body.bio, // team_bio
					req.body.cover // team_cover_photo
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
				res.status(403).send("Team: " + req.body.name + " already exists");
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
				res.status(500).send(err);
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

function addTournament(req, res, tournament, client, done, log) {
	var query = client.query({
		text : "SELECT game_name FROM game WHERE game_name = $1",
		values : [tournament.game]
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
				values : [req.body.event.name, req.body.event.start_date, req.body.event.location, tournament.name, tournament.game, tournament.rules, tournament.teams, tournament.start_date, tournament.deadline, Math.floor(tournament.fee * 100) / 100, tournament.capacity, Math.floor(tournament.seed_money * 100) / 100, tournament.type, tournament.format, tournament.scoring, ((tournament.type === "Two-Stage") ? tournament.group_players : 0), ((tournament.type === "Two-Stage") ? tournament.group_winners : 0)]
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
				error : "Couldn't find the game: " + tournament.game
			});
			log.info({
				res : res
			}, 'done response');
		}
	});
}

var createEvent = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var eventStartDate = new Date(req.body.event.start_date);
		var eventEndDate = new Date(req.body.event.end_date);
		var eventRegistrationDeadline = new Date(req.body.event.registration_deadline);
		if (!(eventStartDate.getTime()) || !(eventEndDate.getTime()) || !(eventRegistrationDeadline.getTime()) || eventRegistrationDeadline.getTime() > eventStartDate.getTime() || eventStartDate.getTime() > eventEndDate.getTime() || !req.body.event.name || !req.body.event.location || !req.user.username || !req.body.event.venue || !req.body.event.banner || !req.body.event.logo || !req.body.event.rules || !req.body.event.description || isNaN(req.body.event.deduction_fee) || req.body.event.deduction_fee < 0 || !req.body.event.type) {
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
						if (!(startDate.getTime()) || !(checkInDeadline.getTime()) || startDate.getTime() < checkInDeadline.getTime() || startDate.getTime() < eventStartDate.getTime() || startDate.getTime() > eventEndDate.getTime() || !req.body.tournament[0].name || !req.body.tournament[0].game || !req.body.tournament[0].rules || isNaN(req.body.tournament[0].fee) || req.body.tournament[0].fee < 0 || isNaN(req.body.tournament[0].capacity) || req.body.tournament[0].capacity < 0 || isNaN(req.body.tournament[0].seed_money) || req.body.tournament[0].seed_money < 0 || !req.body.tournament[0].type || !req.body.tournament[0].format || !req.body.tournament[0].scoring || isNaN(req.body.tournament[0].group_players) || req.body.tournament[0].group_players < 0 || isNaN(req.body.tournament[0].group_winners) || req.body.tournament[0].group_winners < 0) {
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
								values : [req.body.tournament[0].game]
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
						console.log(req.body.tournament);
						var tournament = req.body.tournament;
						var i = 0;
						for ( i = 0; i < tournament.length; i++) {
							console.log(tournament[i].name);
							var startDate = new Date(req.body.tournament[i].start_date);
							var checkInDeadline = new Date(req.body.tournament[i].deadline);
							if (!(startDate.getTime()) || !(checkInDeadline.getTime()) || startDate.getTime() < checkInDeadline.getTime() || startDate.getTime() < eventStartDate.getTime() || startDate.getTime() > eventEndDate.getTime() || !tournament[i].name || !tournament[i].game || !tournament[i].rules || isNaN(tournament[i].fee) || tournament[i].fee < 0 || isNaN(tournament[i].capacity) || tournament[i].capacity < 0 || isNaN(tournament[i].seed_money) || tournament[i].seed_money < 0 || !tournament[i].type || !tournament[i].format || !tournament[i].scoring || isNaN(tournament[i].group_players) || tournament[i].group_players < 0 || isNaN(tournament[i].group_winners) || tournament[i].group_winners < 0) {
								client.query("ROLLBACK");
								done();
								res.status(400).json({
									error : "Incomplete or invalid parameters"
								});
								log.info({
									res : res
								}, 'done response');
							} else {
								/* 
								 * We have to perform this part in another function.
								 * This is because of node's asynchronous nature.
								 * Before we add a Tournament to the Event we created, we must check if the game exists in our DB.
								 * While this query is happening, node will continue to execute the rest of the code, which in this case is to iterate again (We are in a for loop).
								 * This means that by the time the Game query ends, i could have a value higher than it had when the query started.
								 * Sending the tournament we want to this function takes care of this problem and we don't have to perform a blocking action on node. :-)
								 */
								addTournament(req, res, tournament[i], client, done, log);
							}
						}
						if (i == tournament.length) {
							var fees = req.body.fees;
							var j = 0;
							for ( j = 0; j < fees.length; j++) {
								if (!fees[j].name || isNaN(fees[j].amount) || fees[j].amount < 0 || !fees[j].description || isNaN(fees[j].available) || fees[j].available < 0) {
									client.query("ROLLBACK");
									done();
									console.log("\n3\n");
									res.status(400).json({
										error : "Incomplete or invalid parameters"
									});
									log.info({
										res : res
									}, 'done response');
								} else {
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
								}
							}
							if (j == fees.length) {
								var sponsors = req.body.sponsors;
								var k = 0;
								for ( k = 0; k < sponsors.length; k++) {
									var query = client.query({
										text : "SELECT is_confirmed.sponsor_name FROM is_confirmed JOIN belongs_to ON is_confirmed.organization_name = belongs_to.organization_name WHERE customer_username = $1 AND sponsor_name = $2",
										values : [req.user.username, sponsors[k]]
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
module.exports.editAccount = editAccount;
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
