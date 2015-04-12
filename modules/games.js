var getPopularGames = function(res, pg, conString, log) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Look for most Popular Games
		var query = client.query({
			text : "SELECT game.*, count(tournament.game_name) AS popularity FROM tournament RIGHT OUTER JOIN game ON tournament.game_name = game.game_name GROUP BY game.game_name ORDER BY popularity DESC"
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

var getPopularGenres = function(res, pg, conString, log) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Look for most Popular Genres
		var query = client.query({
			text : "SELECT genre.*, count(tournament.game_name) AS popularity FROM tournament RIGHT OUTER JOIN is_of ON tournament.game_name = is_of.game_name JOIN genre ON genre.genre_name = is_of.genre_name GROUP BY genre.genre_name ORDER BY popularity DESC"
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

module.exports.getPopularGames = getPopularGames;
module.exports.getPopularGenres = getPopularGenres;
