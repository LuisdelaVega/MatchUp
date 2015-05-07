//TODO Register Team to Event

var getTeams = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT team_name, team_logo, team_bio, team_cover_photo FROM team WHERE team_active"
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
			res.status(200).json(result.rows);
			log.info({
				res : res
			}, 'done response');
		});
	});
};

//TODO Look for Tournaments the team has participated and calculate their matches won/lost
var getTeam = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT team_name, team_logo, team_bio, team_cover_photo, bool_and(team_name IN (SELECT team_name FROM plays_for WHERE customer_username = $2)) AS is_member FROM team WHERE team_active AND team_name = $1 GROUP BY team_name, team_logo, team_bio, team_cover_photo",
			values : [req.params.team, req.user.username]
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
				log.info({
					res : res
				}, 'done response');
			} else {
				res.status(404).send("Couldn't find team: " + req.params.team);
				log.info({
					res : res
				}, 'done response');
			};
		});
	});
};

var editTeam = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		if (!req.body.logo && !req.body.bio && !req.body.cover) {
			done();
			res.status(400).json({
				error : "Incomplete or invalid parameters"
			});
			log.info({
				res : res
			}, 'done response');
		} else {
			client.query("BEGIN");
			var query = client.query({
				text: "SELECT team_name, team_logo, team_bio, team_cover_photo, bool_and(team_name IN (SELECT team_name FROM plays_for WHERE customer_username = $2)) AS is_member FROM team WHERE team_active AND team_name = $1 GROUP BY team_name, team_logo, team_bio, team_cover_photo",
				values: [req.params.team, req.user.username]
			});
			query.on("row", function (row, result) {
				result.addRow(row);
			});
			query.on('error', function (error) {
				done();
				res.status(500).send(error);
				log.info({
					res: res
				}, 'done response');
			});
			query.on("end", function (result) {
				if (result.rows.length && result.rows[0].is_member) {
					client.query({
						text: "UPDATE team SET (team_logo, team_bio, team_cover_photo, team_paypal_info) = ('$1', '$2', '$3', '$5') WHERE team_name = $4",
						values: [req.body.logo, req.body.bio, req.body.cover, req.params.team, req.body.team_paypal_info]
					}, function (err, result) {
						if (err) {
							client.query("ROLLBACK");
							done();
							res.status(500).send(err);
						} else {
							client.query("COMMIT");
							done();
							res.status(200).send("Team info updated");
						}
						log.info({
							res: res
						}, 'done response');
					});
				} else {
					done();
					res.status(404).send("Couldn't find team: " + req.params.team);
					log.info({
						res: res
					}, 'done response');
				}
			});
		}
	});
};

var deleteTeam = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		client.query({
			text : "UPDATE team SET team_active = FALSE WHERE team_name = $1 AND team_name IN (SELECT team_name FROM captain_for WHERE customer_username = $2)",
			values : [req.params.team, req.user.username]
		}, function(err, result) {
			if (err) {
				client.query("ROLLBACK");
				done();
				res.status(500).send("Oh, no! Disaster!");
			} else {
				client.query("COMMIT");
				done();
				res.status(204).send('');
			}
			log.info({
				res : res
			}, 'done response');
		});
	});
};

var getTeamMembers = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query({
			text : "SELECT team_name FROM team WHERE team_active AND team_name = $1",
			values : [req.params.team]
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
					text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_profile_pic, bool_and(customer_username IN (SELECT customer_username FROM captain_for WHERE team_name = $1)) AS is_captain FROM customer NATURAL JOIN plays_for NATURAL JOIN team WHERE team_name = $1 AND team_active GROUP BY customer_username ORDER BY is_captain DESC",
					values : [req.params.team]
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
					res.status(200).json(result.rows);
					log.info({
						res : res
					}, 'done response');
				});
			} else {
				done();
				res.status(404).send("Couldn't find team: " + req.params.team);
				log.info({
					res : res
				}, 'done response');
			};
		});
	});
};

var getStandings = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Query the database to find the user's account
		var query = client.query({
			text : "SELECT team_name FROM team WHERE team_name = $1 AND team_active",
			values : [req.params.team]
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
					text : "SELECT event_name, event_start_date, event_location, tournament_name, competitor_standing AS standing FROM competitor NATURAL JOIN competes_for WHERE team_name = $1 AND competitor_standing > 0",
					values : [req.params.team]
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
				res.status(404).send("Team: " + req.params.team + " was not not found");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var addTeamMember = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT team_name FROM plays_for NATURAL JOIN team WHERE customer_username = $1 AND team_active AND team_name = $2",
			values : [req.user.username, req.params.team]
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
				var query = client.query({
					text : "SELECT customer_username FROM customer WHERE customer_username = $1 AND customer_active",
					values : [req.query.username]
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
							text : "INSERT INTO plays_for (customer_username, team_name) VALUES ($1, $2)",
							values : [req.query.username, req.params.team]
						}, function(err, result) {
							if (err) {
								client.query("ROLLBACK");
								done();
								res.status(500).send(err);
							} else {
								client.query("COMMIT");
								done();
								res.status(201).send("User: " + req.query.username + " has been added");
							}
							log.info({
								res : res
							}, 'done response');
						});
					} else {
						client.query("ROLLBACK");
						done();
						res.status(404).send("Couldn't find user: " + req.query.username);
						log.info({
							res : res
						}, 'done response');
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(403).send("You are not a member of this team");
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var removeTeamMember = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		// Look for whether or not the user that issued the request belongs to this team and if he/she captains the team
		var query = client.query({
			text : "SELECT customer_username, bool_and(customer_username IN (SELECT customer_username FROM captain_for WHERE team_name = $1)) AS is_captain FROM customer NATURAL JOIN plays_for NATURAL JOIN team WHERE team_name = $1 AND customer_username = $2 AND team_active AND customer_active GROUP BY customer_username",
			values : [req.params.team, req.user.username]
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
				var reqMember = result.rows[0];
				// Do the same for the user that is to be removed
				var query = client.query({
					text : "SELECT customer_username, bool_and(customer_username IN (SELECT customer_username FROM captain_for WHERE team_name = $1)) AS is_captain FROM customer NATURAL JOIN plays_for NATURAL JOIN team WHERE team_name = $1 AND customer_username = $2 AND team_active AND customer_active GROUP BY customer_username",
					values : [req.params.team, req.query.username]
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
						var member = result.rows[0];
						// A member can't remove the captain, so if you're the captain make someone else captain, then try again
						if (!member.is_captain) {
							client.query({
								text : "DELETE FROM plays_for WHERE customer_username = $1 AND team_name = $2",
								values : [member.customer_username, req.params.team]
							}, function(err, result) {
								if (err) {
									client.query("ROLLBACK");
									done();
									res.status(500).send("Oh, no! Disaster!");
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
							res.status(403).send("You can't remove user: " + req.query.username);
							log.info({
								res : res
							}, 'done response');
						}
					} else {
						client.query("ROLLBACK");
						done();
						res.status(403).send("User: " + req.query.username + " is not a member of " + req.params.team);
						log.info({
							res : res
						}, 'done response');
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(403).send("You are not a member of " + req.params.team);
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

var makeCaptain = function(req, res, pg, conString, log) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("BEGIN");
		var query = client.query({
			text : "SELECT customer_username FROM customer NATURAL JOIN captain_for NATURAL JOIN team WHERE team_name = $1 AND customer_username = $2 AND team_active AND customer_active GROUP BY customer_username",
			values : [req.params.team, req.user.username]
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
				var reqMember = result.rows[0];
				var query = client.query({
					text : "SELECT customer_username FROM customer NATURAL JOIN plays_for NATURAL JOIN team WHERE team_name = $1 AND customer_username = $2 AND team_active AND customer_active GROUP BY customer_username",
					values : [req.params.team, req.query.username]
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
						// var member = result.rows[0];
						client.query({
							text : "DELETE FROM captain_for WHERE customer_username = $1 AND team_name = $2",
							values : [reqMember.customer_username, req.params.team]
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
									values : [req.query.username, req.params.team]
								}, function(err, result) {
									if (err) {
										client.query("ROLLBACK");
										done();
										res.status(500).send(err);
									} else {
										client.query("COMMIT");
										done();
										res.status(201).send("User: " + req.query.username + " has beed made captain");
									}
									log.info({
										res : res
									}, 'done response');
								});
							}
						});
					} else {
						client.query("ROLLBACK");
						done();
						res.status(403).send("User: " + req.query.username + " is not a member of " + req.params.team);
						log.info({
							res : res
						}, 'done response');
					}
				});
			} else {
				client.query("ROLLBACK");
				done();
				res.status(403).send("You are not the captain of " + req.params.team);
				log.info({
					res : res
				}, 'done response');
			}
		});
	});
};

module.exports.getTeams = getTeams;
module.exports.getTeam = getTeam;
module.exports.editTeam = editTeam;
module.exports.deleteTeam = deleteTeam;
module.exports.getTeamMembers = getTeamMembers;
module.exports.addTeamMember = addTeamMember;
module.exports.removeTeamMember = removeTeamMember;
module.exports.makeCaptain = makeCaptain;
module.exports.getStandings = getStandings;
