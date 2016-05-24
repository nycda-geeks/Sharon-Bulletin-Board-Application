//Start in git bash with: $ export POSTGRES_PASSWORD=... & $ export POSTGRES_USER=postgres so you can use these commands in your node app.

var pg = require('pg');

var connectionString = "postgres://" + process.env.POSTGRES_USER + ":" + process.env.POSTGRES_PASSWORD + "@localhost/bulletinboard";
pg.connect(connectionString, function (err, client, done) {
	if (err) {
		if (client) {
			done(client);
		}
		return;
	}
	client.query('select * from hats', function (err, result) {
		if (err) {
			done(client);
			return;
		} else {
			done();
		}
		console.log(result.rows);
		
	});
});
