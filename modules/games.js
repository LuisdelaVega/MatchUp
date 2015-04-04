//TODO Implement offsets like in Spruce
//TODO Implement all games and popular games in separate routes/queries. Same for genres
var getPopularGames = function(res, pg, conString) {
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
			console.log(error);
			res.status(500).send(error);
		});
		query.on("end", function(result) {
			done();
			res.json(result.rows);
		});
	});
	//pg.end();
};

var getPopularGenres = function(res, pg, conString) {
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
			console.log(error);
			res.status(500).send(error);
		});
		query.on("end", function(result) {
			done();
			res.json(result.rows);
		});
	});
	//pg.end();
};

// *Depreciated*
var getPopularStuff = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Look for most Popular Games
		var gamesList = new Object();
		var query = client.query({
			text : "select game.*, count(tournament.game_name) AS popularity from tournament RIGHT OUTER JOIN game ON tournament.game_name = game.game_name GROUP BY game.game_name ORDER BY popularity DESC"
		});
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			gamesList.popular_games = result.rows;
			// Look for most Popular Games
			var genreList = new Object();
			var query = client.query({
				text : "select genre.*, count(tournament.game_name) AS popularity from tournament RIGHT OUTER JOIN is_of ON tournament.game_name = is_of.game_name JOIN genre ON genre.genre_name = is_of.genre_name GROUP BY genre.genre_name ORDER BY popularity DESC"
			});
			query.on("row", function(row, result) {
				result.addRow(row);
			});
			query.on('error', function(error) {
				done();
				console.log(error);
				res.status(500).send(error);
			});
			query.on("end", function(result) {
				genreList.genres = result.rows;
				done();
				res.status(202).json({
					popular_games : gamesList.popular_games,
					genres : genreList.genres
				});
			});
		});
	});
	//pg.end();
};

module.exports.getPopularGames = getPopularGames;
module.exports.getPopularGenres = getPopularGenres;
module.exports.getPopularStuff = getPopularStuff;
