//TODO Implement offsets like in Spruce
var getPopularGames = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Look for most Popular Games
		var queryPopularGames = client.query({
			text : "select game.*, count(game.game_id) as popularity from tournament natural join game group by game.game_id order by popularity desc"
		});
		queryPopularGames.on("row", function(row, result) {
			result.addRow(row);
		});
		queryPopularGames.on("end", function(result) {
			res.json(result.rows);
			client.end();
		});
	});
};

var getPopularGenres = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Look for most Popular Genres
		var queryPopularGenre = client.query({
			text : "select genre.*, count(game.game_id) as popularity from tournament natural join game natural join genre group by genre.genre_id order by popularity desc"
		});
		queryPopularGenre.on("row", function(row, result) {
			result.addRow(row);
		});
		queryPopularGenre.on("end", function(result) {
			res.json(result.rows);
			client.end();
		});
	});
};

var getPopularStuff = function(res, pg, conString) {
	// Query the DB to find the local Events
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		// Look for most Popular Games
		var gamesList = new Object();
		var queryPopularGames = client.query({
			text : "select game.*, count(game.game_id) as popularity from tournament natural join game group by game.game_id order by popularity desc"
		});
		queryPopularGames.on("row", function(row, result) {
			result.addRow(row);
		});
		queryPopularGames.on("end", function(result) {
			gamesList.popular_games = result.rows;

			// Look for most Popular Games
			var genreList = new Object();
			var queryPopularGenre = client.query({
				text : "select genre.*, count(game.game_id) as popularity from tournament natural join game natural join genre group by genre.genre_id order by popularity desc"
			});
			queryPopularGenre.on("row", function(row, result) {
				result.addRow(row);
			});
			queryPopularGenre.on("end", function(result) {
				genreList.genres = result.rows;

				res.json({
					popular_games : gamesList.popular_games,
					genres : genreList.genres
				});
				client.end();
			});
		});
	});
};

module.exports.getPopularGames = getPopularGames;
module.exports.getPopularGenres = getPopularGenres;
module.exports.getPopularStuff = getPopularStuff;