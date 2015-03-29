//TODO Add Tournamet
//TODO Add Station
//TODO Add Sponsor
//TODO Edit Event details
//TODO Edit Tournament details
//TODO Edit Station details
//TODO Edit Sponsors details
//TODO Delete Event
//TODO Delete Tournament
//TODO Delete Sponsor
//TODO Register for Event
//TODO Register for Tournament

var getEventsParams = {
	type : ["regular", "hosted"],
	filter : ["game", "genre"],
	state : ["live", "past", "upcoming"]
};

//TODO Implement limit and offsets like in Spruce
// /events - Get a list of Events filtered by given parameters
var getEvents = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var where = false;
		var queryText = "SELECT ";
		var queryGroupBy = " GROUP BY event_name, event_start_date, event_location";
		switch (req.query.type) {
		case getEventsParams.type[0]:
			queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE concat(event_name, event_location, event_start_date) NOT IN (SELECT concat(event_name, event_location, event_start_date) FROM hosts)";
			console.log(queryText);
			where = true;
			break;
		case getEventsParams.type[1]:
			queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo, organization_name, organization_logo FROM event NATURAL JOIN hosts NATURAL JOIN organization";
			queryGroupBy += ", organization_name, organization_logo";
			console.log(queryText);
			break;
		default:
			queryText += "event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event";
			console.log(queryText);
		}
		switch (req.query.filter) {
		case getEventsParams.filter[0]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game WHERE game_name ILIKE '" + ((!req.query.value) ? 0 : req.query.value) + "')";
			console.log(queryText);
			break;
		case getEventsParams.filter[1]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game NATURAL JOIN is_of NATURAL JOIN genre WHERE genre_name ILIKE '" + ((!req.query.value) ? 0 : req.query.value) + "')";
			console.log(queryText);
			break;
		}
		switch (req.query.state) {
		case getEventsParams.state[0]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_start_date < now() at time zone 'utc' AND event_end_date > now() at time zone 'utc'";
			console.log(queryText);
			break;
		case getEventsParams.state[1]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_end_date < now() at time zone 'utc'";
			console.log(queryText);
			break;
		case getEventsParams.state[2]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "event_start_date > now() at time zone 'utc'";
			console.log(queryText);
			break;
		}

		if (where) {
			queryText += " AND event_active";
		} else {
			queryText += " WHERE event_active";
			where = true;
		}

		queryText += queryGroupBy;
		queryText += " ORDER BY event_start_date";
		console.log(queryText);
		// Query the database to find the account
		var query = client.query({
			text : queryText
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.json(result.rows);
			client.end();
		});
	});
};

//TODO Send if I am an organizer
var getEvent = function(req, res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		// Query the database to find the account
		var event = new Object();
		var queryEvent = client.query({
			text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_banner, event_logo, event_max_capacity, event_end_date, event_registration_deadline, event_rules, event_description, event_deduction_fee, event_is_online, event_type, bool_and(concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM hosts)) as is_hosted FROM event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND event_active GROUP BY event_name, event_start_date, event_location",
			values : [req.params.event, (!(date.getTime()) ? "1991-11-11T00:00:00.000Z" : req.query.date), req.query.location]
		});
		queryEvent.on("row", function(row, result) {
			result.addRow(row);
		});
		queryEvent.on("end", function(result) {
			if (result.rows.length > 0) {
				event.info = result.rows[0];
				var queryMeetup = client.query({
					text : "SELECT meetup_name, meetup_sart_date, meetup_end_date, meetup_location, meetup_description, customer_username FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
					values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
				});
				queryMeetup.on("row", function(row, result) {
					result.addRow(row);
				});
				queryMeetup.on("end", function(result) {
					event.meetups = result.rows;
					var queryTournament = client.query({
						text : "SELECT tournament_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, game.* FROM tournament NATURAL JOIN game WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
						values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
					});
					queryTournament.on("row", function(row, result) {
						result.addRow(row);
					});
					queryTournament.on("end", function(result) {
						event.tournaments = result.rows;
						var queryNews = client.query({
							text : "SELECT news_number, news_title, news_content, news_date_posted FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
							values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
						});
						queryNews.on("row", function(row, result) {
							result.addRow(row);
						});
						queryNews.on("end", function(result) {
							event.news = result.rows;
							var querySponsor = client.query({
								text : "SELECT sponsor_name, sponsor_logo, sponsor_link FROM sponsors NATURAL JOIN shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
								values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
							});
							querySponsor.on("row", function(row, result) {
								result.addRow(row);
							});
							querySponsor.on("end", function(result) {
								event.sponsors = result.rows;
								var querySpectatorFee = client.query({
									text : "SELECT spec_fee_name, spec_fee_amount, spec_fee_description FROM spectator_fee WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
									values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
								});
								querySpectatorFee.on("row", function(row, result) {
									result.addRow(row);
								});
								querySpectatorFee.on("end", function(result) {
									event.spectator_fees = result.rows;
									var queryReview = client.query({
										text : "SELECT review_title, review_content, star_rating, review_date_created, customer_username FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
										values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
									});
									queryReview.on("row", function(row, result) {
										result.addRow(row);
									});
									queryReview.on("end", function(result) {
										event.reviews = result.rows;
										if (event.info.is_hosted) {
											var queryHost = client.query({
												text : "SELECT organization_name, organization_logo, organization_active FROM organization NATURAL JOIN hosts WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
												values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
											});
											queryHost.on("row", function(row, result) {
												result.addRow(row);
											});
											queryHost.on("end", function(result) {
												event.host = result.rows[0];
												res.json(event);
												client.end();
											});
										} else {
											var queryCreator = client.query({
												text : "SELECT customer_username, customer_first_name, customer_last_name, customer_tag, customer_active FROM customer NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
												values : [event.info.event_name, event.info.event_start_date, event.info.event_location]
											});
											queryCreator.on("row", function(row, result) {
												result.addRow(row);
											});
											queryCreator.on("end", function(result) {
												event.creator = result.rows[0];
												res.json(event);
												client.end();
											});
										}
									});
								});
							});
						});
					});
				});
			} else {
				client.end();
				res.status(404).send('Oh, no! This event does not exist');
			}
		});
	});
};

var getNews = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryNews = client.query({
				text : "SELECT news_number, news_title, news_content, news_date_posted, bool_or(customer_username IN (SELECT customer_username FROM event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5) OR customer_username IN (SELECT customer_username FROM hosts NATURAL JOIN belongs_to WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_organizer FROM news NATURAL JOIN belongs_to WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4 GROUP BY news_number, news_title, news_content, news_date_posted",
				values : [req.params.event, req.query.date, req.query.location, req.params.news, req.user.username]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				if (result.rows.length > 0) {
					client.end();
					res.json(result.rows[0]);
				} else {
					client.end();
					res.status(404).send("News not found");
				}
			});
		}
	});
};

var deleteNews = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryNews = client.query({
				text : "SELECT bool_or(customer_username IN (SELECT customer_username FROM event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5) OR customer_username IN (SELECT customer_username FROM hosts NATURAL JOIN belongs_to WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_organizer FROM news NATURAL JOIN belongs_to WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4",
				values : [req.params.event, req.query.date, req.query.location, req.params.news, req.user.username]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				if (result.rows.length > 0) {
					if (result.rows[0].is_organizer) {
						client.query({
							text : "DELETE FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4",
							values : [req.params.event, req.query.date, req.query.location, req.params.news]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.end();
								res.status(204).send('');
							}
						});
					} else {
						client.end();
						res.status(403).send('');
					}
				} else {
					client.end();
					res.status(404).send("News not found");
				}
			});
		}
	});
};

var createNews = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryNews = client.query({
				text : "SELECT bool_or(customer_username IN (SELECT customer_username FROM event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4) OR customer_username IN (SELECT customer_username FROM hosts NATURAL JOIN belongs_to WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4)) as is_organizer FROM hosts NATURAL JOIN belongs_to WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				if (result.rows.length > 0) {
					if (result.rows[0].is_organizer) {
						var date = new Date(req.body.date);
						if (!(date.getTime())) {
							client.end();
							res.status(400).send('Invalid date');
						} else {
							var queryNews = client.query({
								text : "SELECT max(news_number)+1 AS next_news FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
								values : [req.params.event, req.query.date, req.query.location]
							});
							queryNews.on("row", function(row, result) {
								result.addRow(row);
							});
							queryNews.on("end", function(result) {
								client.query({
									text : "INSERT INTO news (event_name, event_start_date, event_location, news_number, news_title, news_content, news_date_posted) VALUES($1, $2, $3, $7, $4, $5, $6)",
									values : [req.params.event, req.query.date, req.query.location, req.body.title, req.body.content, req.body.date, result.rows[0].next_news]
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
						}
					} else {
						client.end();
						res.status(403).send('');
					}
				} else {
					client.end();
					res.status(404).send("News not found");
				}
			});
		}
	});
};

var updateNews = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {

		}
	});
};

var getReview = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryReview = client.query({
				text : "SELECT review_title, review_content, star_rating, review_date_created, customer_username, bool_and(customer_username IN (SELECT customer_username FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_writer FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4 GROUP BY review_title, review_content, star_rating, review_date_created, customer_username;",
				values : [req.params.event, req.query.date, req.query.location, req.params.username, req.user.username]
			});
			queryReview.on("row", function(row, result) {
				result.addRow(row);
			});
			queryReview.on("end", function(result) {
				if (result.rows.length > 0) {
					client.end();
					res.json(result.rows[0]);
				} else {
					client.end();
					res.status(404).send("Review not found");
				}
			});
		}
	});
};

var deleteReview = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryReview = client.query({
				text : "SELECT bool_and(customer_username IN (SELECT customer_username FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_writer FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4",
				values : [req.params.event, req.query.date, req.query.location, req.params.username, req.user.username]
			});
			queryReview.on("row", function(row, result) {
				result.addRow(row);
			});
			queryReview.on("end", function(result) {
				if (result.rows.length > 0) {
					if (result.rows[0].is_writer) {
						client.query({
							text : "DELETE FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4",
							values : [req.params.event, req.query.date, req.query.location, req.params.username]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.end();
								res.status(204).send('');
							}
						});
					} else {
						client.end();
						res.status(403).send('');
					}
				} else {
					client.end();
					res.status(404).send("News not found");
				}
			});
		}
	});
};

//TODO In progress
var createReview = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryReview = client.query({
				text : "SELECT bool_and(customer_username IN (SELECT customer_username FROM pays WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3) OR customer_username IN (SELECT DISTINCT customer_username FROM is_a WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3)) AS participates FROM customer WHERE customer_username = $4",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryReview.on("row", function(row, result) {
				result.addRow(row);
			});
			queryReview.on("end", function(result) {
				if (result.rows.length > 0) {
					if (result.rows[0].participates) {
						var date = new Date(req.body.date);
						if (!(date.getTime())) {
							client.end();
							res.status(400).send('Invalid date');
						} else {
							client.query({
								text : "INSERT INTO review (event_name, event_start_date, event_location, customer_username, review_title, review_content, star_rating, review_date_created) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)",
								values : [req.params.event, req.query.date, req.query.location, req.user.username, req.body.title, req.body.content, req.body.rating, req.body.date]
							}, function(err, result) {
								if (err) {
									res.status(500).send("Oh, no! Disaster!");
									client.end();
								} else {
									client.end();
									res.status(204).send('');
								}
							});
						}
					} else {
						client.end();
						res.status(403).send('');
					}
				} else {
					client.end();
					res.status(404).send("News not found");
				}
			});
		}
	});
};

var updateReview = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {

		}
	});
};

var getMeetup = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryReview = client.query({
				text : "SELECT meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username, bool_and(customer_username IN (SELECT customer_username FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_organizer FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND meetup_start_date = $6 AND meetup_location = $7 AND customer_username = $4 GROUP BY meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username",
				values : [req.params.event, req.query.date, req.query.location, req.params.username, req.user.username, req.query.mdate, req.query.mlocation]
			});
			queryReview.on("row", function(row, result) {
				result.addRow(row);
			});
			queryReview.on("end", function(result) {
				if (result.rows.length > 0) {
					client.end();
					res.json(result.rows[0]);
				} else {
					client.end();
					res.status(404).send("Meetup not found");
				}
			});
		}
	});
};

var deleteMeetup = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryNews = client.query({
				text : "SELECT bool_and(customer_username IN (SELECT customer_username FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_organizer FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND meetup_start_date = $6 AND meetup_location = $7 AND customer_username = $4",
				values : [req.params.event, req.query.date, req.query.location, req.params.username, req.user.username, req.query.mdate, req.query.mlocation]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				if (result.rows.length > 0) {
					if (result.rows[0].is_organizer) {
						client.query({
							text : "DELETE FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND meetup_start_date = $5 AND meetup_location = $6 AND customer_username = $4",
							values : [req.params.event, req.query.date, req.query.location, req.params.username, req.query.mdate, req.query.mlocation]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.end();
								res.status(204).send('');
							}
						});
					} else {
						client.end();
						res.status(403).send('');
					}
				} else {
					client.end();
					res.status(404).send("News not found");
				}
			});
		}
	});
};

var createMeetup = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {

		}
	});
};

var updateMeetup = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {

		}
	});
};

//TODO Limit the result to a maximum of 3 or something
// /home - Get everything MatchUp's home view needs
var getHome = function(res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventList = new Object();
		// Look for all the Events that are currently in progress
		var queryLive = client.query({
			text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE event_start_date < now() at time zone 'utc' and event_end_date > now() at time zone 'utc' AND event_active GROUP BY event_name, event_location, event_start_date ORDER BY event_start_date"
		});
		queryLive.on("row", function(row, result) {
			result.addRow(row);
		});
		queryLive.on("end", function(result) {
			eventList.live = result.rows;

			// Look for all the Regular Events that have not yet started
			var queryRegular = client.query({
				text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event WHERE event_start_date > now() at time zone 'utc' AND event_name NOT IN (SELECT event.event_name FROM event NATURAL JOIN hosts) AND event_active GROUP BY event_name, event_location, event_start_date ORDER BY event_start_date"
			});
			queryRegular.on("row", function(row, result) {
				result.addRow(row);
			});
			queryRegular.on("end", function(result) {
				eventList.regular = result.rows;

				// Look for all Hosted Events that have not yet started
				var queryHosted = client.query({
					text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_logo FROM event NATURAL JOIN hosts WHERE event.event_start_date > now() at time zone 'utc' AND event_active GROUP BY event_name, event_location, event_start_date ORDER BY event_start_date"
				});
				queryHosted.on("row", function(row, result) {
					result.addRow(row);
				});
				queryHosted.on("end", function(result) {
					eventList.hosted = result.rows;

					// Look for most Popular Games
					var gamesList = new Object();
					var queryPopularGames = client.query({
						text : "SELECT game.*, count(game.game_name) as popularity FROM event NATURAL JOIN tournament NATURAL JOIN game WHERE event_active GROUP BY game.game_name ORDER BY popularity DESC"
					});
					queryPopularGames.on("row", function(row, result) {
						result.addRow(row);
					});
					queryPopularGames.on("end", function(result) {
						gamesList.popular_games = result.rows;

						res.json({
							events : eventList,
							popular_games : gamesList.popular_games
						});
						client.end();
					});
				});
			});
		});
	});
};

module.exports.getEvents = getEvents;
module.exports.getEvent = getEvent;
module.exports.getHome = getHome;
module.exports.getNews = getNews;
module.exports.deleteNews = deleteNews;
module.exports.createNews = createNews;
module.exports.getReview = getReview;
module.exports.deleteReview = deleteReview;
module.exports.createReview = createReview;
module.exports.getMeetup = getMeetup;
module.exports.deleteMeetup = deleteMeetup;
