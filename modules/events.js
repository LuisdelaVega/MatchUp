var getEventsParams = {
	type : ["regular", "hosted"],
	filter : ["game", "genre"],
	state : ["live", "past", "upcoming"]
};

//TODO Implement limit and offsets like in Spruce
var getEvents = function(req, res, pg, conString) {

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
			queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game WHERE game_name ILIKE '%" + ((!req.query.value) ? 0 : req.query.value) + "%')";
			console.log(queryText);
			break;
		case getEventsParams.filter[1]:
			if (where) {
				queryText += " AND ";
			} else {
				queryText += " WHERE ";
				where = true;
			}
			queryText += "concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM event NATURAL JOIN tournament NATURAL JOIN game NATURAL JOIN is_of NATURAL JOIN genre WHERE genre_name ILIKE '%" + ((!req.query.value) ? 0 : req.query.value) + "%')";
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
			res.status(200).json(result.rows);
			client.end();
		});
	});
};

var getEvent = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var event = new Object();
			var queryEvent = client.query({
				text : "SELECT event_name, event_start_date, event_end_date, event_location, event_venue, event_banner, event_logo, event_end_date, event_registration_deadline, event_rules, event_description, event_deduction_fee, event_is_online, event_type, bool_and(concat(event_name, event_location, event_start_date) IN (SELECT concat(event_name, event_location, event_start_date) FROM hosts)) as is_hosted FROM event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND event_active GROUP BY event_name, event_start_date, event_location",
				values : [req.params.event, req.query.date, req.query.location]
			});
			queryEvent.on("row", function(row, result) {
				result.addRow(row);
			});
			queryEvent.on("end", function(result) {
				if (result.rows.length > 0) {
					event = result.rows[0];
					// Check if user is organizer
					var queryEvent = client.query({
						text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;",
						values : [req.params.event, req.query.date, req.query.location, req.user.username]
					});
					queryEvent.on("row", function(row, result) {
						result.addRow(row);
					});
					queryEvent.on("end", function(result) {
						event.is_organizer = (result.rows.length > 0);
						client.end();
						res.status(200).json(event);
					});
				} else {
					client.end();
					res.status(404).send('Oh, no! This event does not exist');
				}
			});
		}
	});
};

var getParticipants = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var queryText = "SELECT distinct customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic FROM event ";
		var queryJoinCustomer = "JOIN customer ON ";

		if (req.query.competitors) {
			queryText += "JOIN is_a ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location ";
			queryJoinCustomer += "customer.customer_username = is_a.customer_username ";
			if (req.query.spectators) {
				queryJoinCustomer += "OR ";
			}
		}
		if (req.query.spectators) {
			queryText += "JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location ";
			queryJoinCustomer += "customer.customer_username = pays.customer_username ";
		}
		if (!req.query.competitors && !req.query.spectators) {
			queryText += "JOIN is_a ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location ";
			queryJoinCustomer += "customer.customer_username = is_a.customer_username OR customer.customer_username = pays.customer_username ";
		}

		queryText += (queryJoinCustomer + "WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3");
		console.log(queryText);
		var query = client.query({
			text : queryText,
			values : [req.params.event, req.query.date, req.query.location]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.status(200).json(result.rows);
			client.end();
		});
	});
};

var getParticipants = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		console.log(queryText);
		var query = client.query({
			text : queryText,
			values : [req.params.event, req.query.date, req.query.location]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.status(200).json(result.rows);
			client.end();
		});
	});
};

var getCompetitors = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		console.log(req.params.event, req.query.date, req.query.location, req.params.tournament);
		var query = client.query({
			text : "SELECT distinct customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic, tournament.competitor_fee, competitor.competitor_check_in, competitor.competitor_seed, competitor.competitor_number FROM tournament JOIN is_a ON is_a.event_name = tournament.event_name AND is_a.event_start_date = tournament.event_start_date AND is_a.event_location = tournament.event_location AND is_a.tournament_name = tournament.tournament_name JOIN competitor ON is_a.event_name = competitor.event_name AND is_a.event_start_date = competitor.event_start_date AND is_a.event_location = competitor.event_location AND is_a.tournament_name = competitor.tournament_name AND is_a.competitor_number = competitor.competitor_number JOIN customer ON customer.customer_username = is_a.customer_username WHERE tournament.event_name = $1 AND tournament.event_start_date = $2 AND tournament.event_location = $3 AND tournament.tournament_name = $4",
			values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.status(200).json(result.rows);
			client.end();
		});
	});
};

var getEventSpectators = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		console.log(req.params.event, req.query.date, req.query.location, req.params.tournament);
		var query = client.query({
			text : "SELECT distinct customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic, pays.spec_fee_name, pays.check_in FROM event JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location JOIN customer ON customer.customer_username = pays.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3",
			values : [req.params.event, req.query.date, req.query.location]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.status(200).json(result.rows);
			client.end();
		});
	});
};

var getEventCompetitors = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		console.log(req.params.event, req.query.date, req.query.location, req.params.tournament);
		var query = client.query({
			text : "SELECT distinct customer.customer_username, customer.customer_first_name, customer.customer_last_name, customer.customer_tag, customer.customer_profile_pic, tournament.competitor_fee FROM event JOIN is_a ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN tournament ON tournament.event_name = event.event_name AND tournament.event_start_date = event.event_start_date AND tournament.event_location = event.event_location AND is_a.tournament_name = tournament.tournament_name JOIN customer ON customer.customer_username = is_a.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3",
			values : [req.params.event, req.query.date, req.query.location]
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			res.status(200).json(result.rows);
			client.end();
		});
	});
};

var getStationsForEvent = function(req, res, pg, conString) {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var event = new Object();
		var queryEvent = client.query({
			text : "SELECT station.station_number, station.station_in_use, stream.stream_link FROM station LEFT OUTER JOIN stream ON station.event_name = stream.event_name AND station.event_start_date = stream.event_start_date AND station.event_location = stream.event_location AND station.station_number = stream.station_number WHERE station.event_name = $1 AND station.event_start_date = $2 AND station.event_location = $3",
			values : [req.params.event, req.query.date, req.query.location]
		});
		queryEvent.on("row", function(row, result) {
			result.addRow(row);
		});
		queryEvent.on("end", function(result) {
			client.end();
			res.status(200).json(result.rows);
		});
	});
};

var checkInSpectator = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryOrganizers = client.query({
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, date.toUTCString(), req.query.location, req.user.username]
			});
			queryOrganizers.on("row", function(row, result) {
				result.addRow(row);
			});
			queryOrganizers.on("end", function(result) {
				if (result.rows.length) {
					client.query({
						text : "UPDATE pays SET check_in = NOT check_in WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4",
						values : [req.params.event, req.query.date, req.query.location, req.params.username]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.end();
							res.status(201).send("Updated");
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't check-in people for this event");
				}
			});
		}
	});
};

var checkInCompetitor = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryOrganizers = client.query({
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, date.toUTCString(), req.query.location, req.user.username]
			});
			queryOrganizers.on("row", function(row, result) {
				result.addRow(row);
			});
			queryOrganizers.on("end", function(result) {
				if (result.rows.length) {
					client.query({
						text : "UPDATE competitor SET competitor_check_in = NOT competitor_check_in WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND competitor_number = $5",
						values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.params.competitor]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.end();
							res.status(201).send("Updated");
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't check-in people for this event");
				}
			});
		}
	});
};

var addStation = function(req, res, pg, conString) {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var date = new Date(req.query.date);
		if (!(date.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryOrganizers = client.query({//
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, date.toUTCString(), req.query.location, req.user.username]
			});
			queryOrganizers.on("row", function(row, result) {
				result.addRow(row);
			});
			queryOrganizers.on("end", function(result) {
				if (result.rows.length) {
					var queryNews = client.query({
						text : "SELECT max(station_number)+1 AS next_station FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
						values : [req.params.event, req.query.date, req.query.location]
					});
					queryNews.on("row", function(row, result) {
						result.addRow(row);
					});
					queryNews.on("end", function(result) {
						var next_station = result.rows[0].next_station;
						client.query({
							text : "INSERT INTO station (event_name, event_start_date, event_location, station_number) VALUES($1, $2, $3, $4)",
							values : [req.params.event, req.query.date, req.query.location, next_station]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.end();
								res.status(201).send("Created new station");
							}
						});
					});
				} else {
					client.end();
					res.status(403).send("You can't add stations to this event");
				}
			});
		}
	});
};

var removeStation = function(req, res, pg, conString) {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({//
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text : "DELETE FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
					values : [req.params.event, req.query.date, req.query.location, req.query.station]
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
				res.status(403).send("You can't add stations to this event");
			}
		});
	});
};

var getStation = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var station = new Object();
		var queryStation = client.query({
			text : "SELECT station.station_number, station.station_in_use, stream.stream_link FROM station LEFT OUTER JOIN stream ON station.event_name = stream.event_name AND station.event_start_date = stream.event_start_date AND station.event_location = stream.event_location AND station.station_number = stream.station_number WHERE station.event_name = $1 AND station.event_start_date = $2 AND station.event_location = $3 AND station.station_number = $4",
			values : [req.params.event, req.query.date, req.query.location, req.params.station]
		});
		queryStation.on("row", function(row, result) {
			result.addRow(row);
		});
		queryStation.on("end", function(result) {
			if (result.rows.length) {
				station.info = result.rows[0];
				station.tournaments = new Array();
				var queryStation = client.query({
					text : "SELECT tournament_name FROM capacity_for WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
					values : [req.params.event, req.query.date, req.query.location, req.params.station]
				});
				queryStation.on("row", function(row, result) {
					// result.addRow(row);
					station.tournaments.push(row.tournament_name);
				});
				queryStation.on("end", function(result) {
					// station.tournaments = result.rows;
					client.end();
					res.status(200).json(station);
				});
			} else {
				client.end();
				res.status(404).send("Station not found");
			}
		});
	});
};

var addStream = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				var queryStation = client.query({
					text : "SELECT station_number FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
					values : [req.params.event, req.query.date, req.query.location, req.params.station]
				});
				queryStation.on("row", function(row, result) {
					result.addRow(row);
				});
				queryStation.on("end", function(result) {
					if (result.rows.length) {
						client.query({
							text : "INSERT INTO stream (event_name, event_start_date, event_location, station_number, stream_link) VALUES($1, $2, $3, $4, $5)",
							values : [req.params.event, req.query.date, req.query.location, req.params.station, req.body.stream]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.end();
								res.status(201).send("Stream link: " + req.body.stream + " added to Station #" + req.params.station);
							}
						});
					}
				});
			} else {
				client.end();
				res.status(403).send("You can't edit stations in this event");
			}
		});
	});
};

var editStation = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text : "UPDATE stream SET stream_link = $5 WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
					values : [req.params.event, req.query.date, req.query.location, req.params.station, req.body.stream]
				}, function(err, result) {
					if (err) {
						res.status(500).send("Oh, no! Disaster!");
						client.end();
					} else {
						client.end();
						res.status(201).send("Changed the stream link to " + req.body.stream + " on Station #" + req.params.station);
					}
				});
			} else {
				client.end();
				res.status(403).send("You can't edit stations in this event");
			}
		});
	});
};

//TODO Verify event_start_date
var removeStream = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text : "DELETE FROM stream WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
					values : [req.params.event, req.query.date, req.query.location, req.params.station]
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
				res.status(403).send("You can't edit stations in this event");
			}
		});
	});
};

//TODO Verify event_start_date
var getTournaments = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({
			text : "SELECT tournament_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, game.* FROM tournament NATURAL JOIN game WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
			values : [req.params.event, req.query.date, req.query.location]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				client.end();
				res.status(200).json(result.rows);
			} else {
				client.end();
				res.status(500).send("Oh no! Disaster!");
			}
		});
	});
};

var getTournament = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({
			text : "SELECT tournament_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, game.* FROM tournament NATURAL JOIN game WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4",
			values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				client.end();
				res.status(200).json(result.rows[0]);
			} else {
				client.end();
				res.status(404).send("Tournament not found");
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
			text : "SELECT sponsor_name, sponsor_logo, sponsor_link FROM sponsors NATURAL JOIN shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
			values : [req.params.event, req.query.date, req.query.location]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			client.end();
			res.status(200).json(result.rows);
		});
	});
};

var addSponsorToEvent = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("START TRANSACTION");
		var queryOrganizers = client.query({
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				var queryOrganizers = client.query({
					text : "SELECT sponsor_name FROM is_confirmed JOIN hosts ON is_confirmed.organization_name = hosts.organization_name JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND sponsor_name = $4",
					values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
				});
				queryOrganizers.on("row", function(row, result) {
					result.addRow(row);
				});
				queryOrganizers.on("end", function(result) {
					if (result.rows.length) {
						client.query({
							text : "INSERT INTO shows (event_name, event_start_date, event_location, sponsor_name) VALUES ($1, $2, $3, $4)",
							values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.query("COMMIT");
								client.end();
								res.status(201).send("Sponsor: " + req.query.sponsor + " added");
							}
						});
					} else {
						client.end();
						res.status(403).send(req.query.sponsor + " does not sponsor your Organization");
					}
				});
			} else {
				client.end();
				res.status(403).send("You can't add sponsors to this Event");
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
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				var queryOrganizers = client.query({
					text : "SELECT sponsor_name FROM shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND sponsor_name = $4",
					values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
				});
				queryOrganizers.on("row", function(row, result) {
					result.addRow(row);
				});
				queryOrganizers.on("end", function(result) {
					if (result.rows.length) {
						client.query({
							text : "DELETE FROM shows WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND sponsor_name = $4",
							values : [req.params.event, req.query.date, req.query.location, req.query.sponsor]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.query("COMMIT");
								client.end();
								res.status(204).send('');
							}
						});
					} else {
						client.end();
						res.status(403).send(req.query.sponsor + " does not sponsor your Event");
					}
				});
			} else {
				client.end();
				res.status(403).send("You can't add sponsors to this Event");
			}
		});
	});
};

var attachStation = function(req, res, pg, conString) {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				var queryNews = client.query({
					text : "SELECT station_number FROM station WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND station_number = $4",
					values : [req.params.event, req.query.date, req.query.location, req.query.station]
				});
				queryNews.on("row", function(row, result) {
					result.addRow(row);
				});
				queryNews.on("end", function(result) {
					if (result.rows.length) {
						client.query({
							text : "INSERT INTO capacity_for (event_name, event_start_date, event_location, tournament_name, station_number) VALUES($1, $2, $3, $4, $5)",
							values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.query.station]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.end();
								res.status(201).send("Attached Station #" + req.query.station + " to " + req.params.tournament);
							}
						});
					} else {
						res.status(403).send("Invalid station");
						client.end();
					}
				});
			} else {
				client.end();
				res.status(403).send("You can't attach stations to this tournament");
			}
		});
	});
};

var getStationsforTournament = function(req, res, pg, conString) {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var queryEvent = client.query({
			text : "SELECT station.station_number, station.station_in_use, stream.stream_link FROM station LEFT OUTER JOIN stream ON station.event_name = stream.event_name AND station.event_start_date = stream.event_start_date AND station.event_location = stream.event_location AND station.station_number = stream.station_number JOIN capacity_for ON station.event_name = capacity_for.event_name AND station.event_start_date = capacity_for.event_start_date AND station.event_location = capacity_for.event_location AND station.station_number = capacity_for.station_number WHERE station.event_name = $1 AND station.event_start_date = $2 AND station.event_location = $3 AND capacity_for.tournament_name = $4",
			values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
		});
		queryEvent.on("row", function(row, result) {
			result.addRow(row);
		});
		queryEvent.on("end", function(result) {
			client.end();
			res.status(200).json(result.rows);
		});
	});
};

var detachStation = function(req, res, pg, conString) {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var queryOrganizers = client.query({
			text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
			values : [req.params.event, req.query.date, req.query.location, req.user.username]
		});
		queryOrganizers.on("row", function(row, result) {
			result.addRow(row);
		});
		queryOrganizers.on("end", function(result) {
			if (result.rows.length) {
				client.query({
					text : "DELETE FROM capacity_for WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4 AND station_number = $5",
					values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.query.station]
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
				res.status(403).send("You can't remove stations from this tournament");
			}
		});
	});
};

var getAllNews = function(req, res, pg, conString) {
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
				text : "SELECT news_number, news_title, news_content, news_date_posted FROM news NATURAL JOIN event WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND event_active ORDER BY news_number",
				values : [req.params.event, req.query.date, req.query.location]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				client.end();
				res.status(200).json(result.rows);
			});
		}
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
				text : "SELECT news_number, news_title, news_content, news_date_posted FROM news WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4",
				values : [req.params.event, req.query.date, req.query.location, req.params.news]
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
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				if (result.rows.length > 0) {
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
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				if (result.rows.length > 0) {
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
							values : [req.params.event, req.query.date, req.query.location, req.body.title, req.body.content, (new Date()).toUTCString(), result.rows[0].next_news]
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
				} else {
					client.end();
					res.status(403).send("You can't post News to this event");
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

		var eventStartDate = new Date(req.query.date);
		if (!(eventStartDate.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					console.log(req.body);
					client.query({
						text : "UPDATE news SET (news_title, news_content) = ($5, $6) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND news_number = $4",
						values : [req.params.event, req.query.date, req.query.location, req.params.news, req.body.title, req.body.content]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.query("COMMIT");
							client.end();
							res.status(201).send("News updated");
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't create a Meetup for this event");
				}
			});
		}
	});
};

var getReviews = function(req, res, pg, conString) {
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
				text : "SELECT review_title, review_content, star_rating, review_date_created, customer_username, bool_and(customer_username IN (SELECT customer_username FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4)) as is_writer FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 GROUP BY review_title, review_content, star_rating, review_date_created, customer_username ORDER BY review_date_created",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryReview.on("row", function(row, result) {
				result.addRow(row);
			});
			queryReview.on("end", function(result) {
				client.end();
				res.status(200).json(result.rows);
			});
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
				text : "SELECT review_title, review_content, star_rating, review_date_created, customer_username, bool_and(customer_username IN (SELECT customer_username FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_writer FROM review WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4 GROUP BY review_title, review_content, star_rating, review_date_created, customer_username",
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
				text : "SELECT distinct customer.customer_username FROM review JOIN event ON review.event_name = event.event_name AND review.event_start_date = event.event_start_date AND review.event_location = event.event_location JOIN customer ON customer.customer_username = review.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND review.customer_username = $5 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username]
			});
			queryReview.on("row", function(row, result) {
				result.addRow(row);
			});
			queryReview.on("end", function(result) {
				if (result.rows.length > 0) {
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
					res.status(404).send("Review not found");
				}
			});
		}
	});
};

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
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username, event.event_end_date FROM is_a JOIN event ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN customer ON customer.customer_username = pays.customer_username OR customer.customer_username = is_a.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					var today = new Date();
					if (today.getTime() < date.getTime()) {
						client.end();
						res.status(403).send('Event not yet started');
					} else {
						client.query({
							text : "INSERT INTO review (event_name, event_start_date, event_location, customer_username, review_title, review_content, star_rating, review_date_created) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)",
							values : [req.params.event, req.query.date, req.query.location, req.user.username, req.body.title, req.body.content, req.body.rating, (new Date()).toUTCString()]
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
					res.status(403).send("You can't post a review for this event");
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

		var eventStartDate = new Date(req.query.date);
		if (!(eventStartDate.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username FROM review JOIN event ON review.event_name = event.event_name AND review.event_start_date = event.event_start_date AND review.event_location = event.event_location JOIN customer ON customer.customer_username = review.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND review.customer_username = $5 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					console.log(req.body);
					client.query({
						text : "UPDATE review SET (review_title, review_content, star_rating) = ($5, $6, $7) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4",
						values : [req.params.event, req.query.date, req.query.location, req.params.username, req.body.title, req.body.content, req.body.rating]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.query("COMMIT");
							client.end();
							res.status(201).send("Review updated");
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't update this review");
				}
			});
		}
	});
};

var getMeetups = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		if (!(eventStartDate.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryReview = client.query({
				text : "SELECT meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username, bool_and(customer_username IN (SELECT customer_username FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4)) as is_organizer FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 GROUP BY meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username ORDER BY meetup_start_date DESC",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryReview.on("row", function(row, result) {
				result.addRow(row);
			});
			queryReview.on("end", function(result) {
				client.end();
				res.status(200).json(result.rows);
			});
		}
	});
};

var getMeetup = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		var meetupStartDate = new Date(req.body.start_date);
		if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryReview = client.query({
				text : "SELECT meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username, bool_and(customer_username IN (SELECT customer_username FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $5)) as is_organizer FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND meetup_start_date = $6 AND meetup_location = $7 AND customer_username = $4 GROUP BY meetup_name, meetup_start_date, meetup_end_date, meetup_location, meetup_description, customer_username",
				values : [req.params.event, req.query.date, req.query.location, req.params.username, req.user.username, req.query.meetup_date, req.query.meetup_location]
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

		var eventStartDate = new Date(req.query.date);
		var meetupStartDate = new Date(req.query.meetup_date);
		if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			var queryNews = client.query({
				text : "SELECT distinct customer.customer_username FROM meetup JOIN event ON meetup.event_name = event.event_name AND meetup.event_start_date = event.event_start_date AND meetup.event_location = event.event_location join hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username OR customer.customer_username = meetup.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND meetup.customer_username = $5 AND meetup.meetup_start_date = $6 AND meetup.meetup_location = $7 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username, req.query.meetup_date, req.query.meetup_location]
			});
			queryNews.on("row", function(row, result) {
				result.addRow(row);
			});
			queryNews.on("end", function(result) {
				if (result.rows.length > 0) {
					client.query({
						text : "DELETE FROM meetup WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND meetup_start_date = $5 AND meetup_location = $6 AND customer_username = $4",
						values : [req.params.event, req.query.date, req.query.location, req.params.username, req.query.meetup_date, req.query.meetup_location]
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
					res.status(403).send("You can't delete this Meetup");
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

		var eventStartDate = new Date(req.query.date);
		var meetupStartDate = new Date(req.body.start_date);
		var meetupEndDate = new Date(req.body.end_date);
		if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime()) || !(meetupEndDate.getTime()) || meetupStartDate.getTime() > meetupEndDate.getTime()) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username, event.event_end_date FROM is_a JOIN event ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = pays.customer_username OR customer.customer_username = is_a.customer_username OR customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					var eventEndDate = new Date(result.rows[0].event_end_date);
					if (meetupEndDate.getTime() > eventEndDate.getTime()) {
						client.end();
						res.status(400).send('Invalid date');
					} else {
						client.query({
							text : "INSERT INTO meetup (event_name, event_start_date, event_location, meetup_location, meetup_name, meetup_start_date, meetup_end_date, meetup_description, customer_username) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
							values : [req.params.event, req.query.date, req.query.location, req.body.location, req.body.name, req.body.start_date, req.body.end_date, req.body.description, req.user.username]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.query("COMMIT");
								client.end();
								res.status(201).send("Meetup Created");
							}
						});
					}
				} else {
					client.end();
					res.status(403).send("You can't create a Meetup for this event");
				}
			});
		}
	});
};

var updateMeetup = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		var meetupStartDate = new Date(req.body.start_date);
		var meetupEndDate = new Date(req.body.end_date);
		if (!(eventStartDate.getTime()) || !(meetupStartDate.getTime()) || !(meetupEndDate.getTime()) || meetupStartDate.getTime() > meetupEndDate.getTime()) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username, event.event_end_date FROM meetup JOIN event ON meetup.event_name = event.event_name AND meetup.event_start_date = event.event_start_date AND meetup.event_location = event.event_location JOIN customer ON customer.customer_username = meetup.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND meetup.customer_username = $5 AND meetup.meetup_start_date = $6 AND meetup.meetup_location = $7 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username, req.params.username, req.query.meetup_date, req.query.meetup_location]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					var eventEndDate = new Date(result.rows[0].event_end_date);
					if (meetupEndDate.getTime() > eventEndDate.getTime()) {
						client.end();
						res.status(400).send('Invalid date');
					} else {
						console.log(req.body);
						client.query({
							text : "UPDATE meetup SET (meetup_name, meetup_location, meetup_start_date, meetup_end_date, meetup_description) = ($7, $8, $9, $10, $11) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND customer_username = $4 AND meetup_location = $5 AND meetup_start_date = $6",
							values : [req.params.event, req.query.date, req.query.location, req.user.username, req.query.meetup_location, req.query.meetup_date, req.body.name, req.body.location, req.body.start_date, req.body.end_date, req.body.description]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								client.query("COMMIT");
								client.end();
								res.status(201).send("Meetup updated");
							}
						});
					}
				} else {
					client.end();
					res.status(403).send("You can't update this review");
				}
			});
		}
	});
};

var addTournament = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		var startDate = new Date(req.body.start_date);
		var checkInDeadline = new Date(req.body.deadline);
		if (!(eventStartDate.getTime()) || !(startDate.getTime()) || !(checkInDeadline.getTime()) || checkInDeadline.getTime() > startDate.getTime() || eventStartDate.getTime() > startDate.getTime()) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					client.query({
						text : "INSERT INTO tournament (event_name, event_start_date, event_location, tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
						values : [req.params.event, req.query.date, req.query.location, req.body.name, req.body.game, req.body.rules, req.body.teams, req.body.start_date, req.body.deadline, Math.floor(req.body.fee * 100) / 100, req.body.capacity, Math.floor(req.body.seed_money * 100) / 100, req.body.type, req.body.format, req.body.scoring, ((req.body.type === "Two-Stage") ? req.body.group_players : 0), ((req.body.type === "Two-Stage") ? req.body.group_winners : 0)]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.query("COMMIT");
							client.end();
							var result = new Object();
							result.event = new Object();
							result.event.name = req.params.event;
							result.event.start_date = req.query.date;
							result.event.location = req.query.location;
							result.event.tournament = req.body.name;
							res.status(201).json(result);
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't add this tournament");
				}
			});
		}
	});
};

//TODO Don't leave an Event without a Tournament
var removeTournament = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		var startDate = new Date(req.body.start_date);
		var checkInDeadline = new Date(req.body.deadline);
		if (!(eventStartDate.getTime()) || !(startDate.getTime()) || !(checkInDeadline.getTime()) || checkInDeadline.getTime() > startDate.getTime() || eventStartDate.getTime() > startDate.getTime()) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					client.query({
						text : "DELETE FROM tournament WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4",
						values : [req.params.event, req.query.date, req.query.location, req.params.tournament]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.query("COMMIT");
							client.end();
							res.status(204).send('');
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't delete this tournament");
				}
			});
		}
	});
};

var deleteEvent = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		if (!(eventStartDate.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					client.query({
						text : "UPDATE event SET event_active = FALSE WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
						values : [req.params.event, req.query.date, req.query.location]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.query("COMMIT");
							client.end();
							res.status(204).send('');
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't delete this tournament");
				}
			});
		}
	});
};

var editEvent = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		if (!(eventStartDate.getTime())) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is an organizer for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					var eventStartDate = new Date(req.body.event.start_date);
					var eventEndDate = new Date(req.body.event.end_date);
					var eventRegistrationDeadline = new Date(req.body.event.registration_deadline);
					if (!(eventStartDate.getTime()) || !(eventEndDate.getTime()) || !(eventRegistrationDeadline.getTime()) || eventRegistrationDeadline.getTime() > eventStartDate.getTime() || eventStartDate.getTime() > eventEndDate.getTime()) {
						client.end();
						res.status(400).send('Invalid date');
					} else {
						client.query({
							text : "UPDATE event SET (event_name, event_start_date, event_location, event_venue, event_banner, event_logo, event_end_date, event_registration_deadline, event_rules, event_description, event_deduction_fee, event_is_online, event_type) = ($4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3",
							values : [req.params.event, req.query.date, req.query.location, req.body.name, req.body.start_date, req.body.location, req.body.venue, req.body.banner, req.body.logo, req.body.end_date, req.body.registration_deadline, req.body.rules, req.body.description, req.body.deduction_fee, req.body.is_online, req.body.type]
						}, function(err, result) {
							if (err) {
								res.status(500).send("Oh, no! Disaster!");
								client.end();
							} else {
								var result = new Object();
								result.event = new Object();
								result.event.name = req.body.name;
								result.event.start_date = req.body.start_date;
								result.event.location = req.body.location;
								client.query("COMMIT");
								client.end();
								res.status(201).json(result);
							}
						});
					}
				} else {
					client.end();
					res.status(403).send("You can't edit this event");
				}
			});
		}
	});
};

var editTournament = function(req, res, pg, conString) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var eventStartDate = new Date(req.query.date);
		var startDate = new Date(req.body.start_date);
		var checkInDeadline = new Date(req.body.deadline);
		if (!(eventStartDate.getTime()) || !(startDate.getTime()) || !(checkInDeadline.getTime()) || checkInDeadline.getTime() > startDate.getTime() || eventStartDate.getTime() > startDate.getTime()) {
			client.end();
			res.status(400).send('Invalid date');
		} else {
			client.query("START TRANSACTION");
			// Check if the user is registered for this event
			var queryCustomer = client.query({
				text : "SELECT distinct customer.customer_username FROM event LEFT OUTER JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location LEFT OUTER JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;",
				values : [req.params.event, req.query.date, req.query.location, req.user.username]
			});
			queryCustomer.on("row", function(row, result) {
				result.addRow(row);
			});
			queryCustomer.on("end", function(result) {
				if (result.rows.length > 0) {
					client.query({
						text : "UPDATE tournament SET (tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group) = ($5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) WHERE event_name = $1 AND event_start_date = $2 AND event_location = $3 AND tournament_name = $4",
						values : [req.params.event, req.query.date, req.query.location, req.params.tournament, req.body.name, req.body.game, req.body.rules, req.body.teams, req.body.start_date, req.body.deadline, Math.floor(req.body.fee * 100) / 100, req.body.capacity, Math.floor(req.body.seed_money * 100) / 100, req.body.type, req.body.format, req.body.scoring, ((req.body.type === "Two-Stage") ? req.body.group_players : 0), ((req.body.type === "Two-Stage") ? req.body.group_winners : 0)]
					}, function(err, result) {
						if (err) {
							res.status(500).send("Oh, no! Disaster!");
							client.end();
						} else {
							client.query("COMMIT");
							client.end();
							var result = new Object();
							result.event = new Object();
							result.event.name = req.params.event;
							result.event.start_date = req.query.date;
							result.event.location = req.query.location;
							result.event.tournament = req.body.name;
							res.status(201).json(result);
						}
					});
				} else {
					client.end();
					res.status(403).send("You can't edit this tournament");
				}
			});
		}
	});
};

//TODO Limit the result to a maximum of 3 or something
// *Depreciated*
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
module.exports.getParticipants = getParticipants;
module.exports.getCompetitors = getCompetitors;
module.exports.getAllNews = getAllNews;
module.exports.getNews = getNews;
module.exports.deleteNews = deleteNews;
module.exports.createNews = createNews;
module.exports.updateNews = updateNews;
module.exports.getReviews = getReviews;
module.exports.getReview = getReview;
module.exports.deleteReview = deleteReview;
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.getMeetups = getMeetups;
module.exports.getMeetup = getMeetup;
module.exports.deleteMeetup = deleteMeetup;
module.exports.createMeetup = createMeetup;
module.exports.updateMeetup = updateMeetup;
module.exports.addTournament = addTournament;
module.exports.removeTournament = removeTournament;
module.exports.deleteEvent = deleteEvent;
module.exports.editEvent = editEvent;
module.exports.editTournament = editTournament;
module.exports.getStationsForEvent = getStationsForEvent;
module.exports.addStation = addStation;
module.exports.removeStation = removeStation;
module.exports.getStation = getStation;
module.exports.addStream = addStream;
module.exports.removeStream = removeStream;
module.exports.editStation = editStation;
module.exports.getTournaments = getTournaments;
module.exports.getTournament = getTournament;
module.exports.attachStation = attachStation;
module.exports.getStationsforTournament = getStationsforTournament;
module.exports.detachStation = detachStation;
module.exports.getSponsors = getSponsors;
module.exports.addSponsorToEvent = addSponsorToEvent;
module.exports.removeSponsor = removeSponsor;
module.exports.getEventSpectators = getEventSpectators;
module.exports.checkInSpectator = checkInSpectator;
module.exports.checkInCompetitor = checkInCompetitor;

//** DEPRECIATED **
module.exports.getHome = getHome;
module.exports.getEventCompetitors = getEventCompetitors;
