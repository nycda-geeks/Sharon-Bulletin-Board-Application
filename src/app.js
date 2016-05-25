//Start in git bash with: $ export POSTGRES_PASSWORD=... & $ export POSTGRES_USER=postgres so you can use these commands in your node app.

var pg = require('pg');
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', './src/views');
app.set('view engine', 'jade')

app.use(express.static('./public/js'))
app.use(express.static('./public/css'))

app.get('/', function(req, res){
	res.render('index')
} );

var connectionString = "postgres://" + process.env.POSTGRES_USER + ":" + process.env.POSTGRES_PASSWORD + "@localhost/bulletinboard";

app.post('/submit', function(req, res){

	var inputTitle = req.body.titleSubject;
	var inputBody = req.body.bodyMessage;

	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			if (client) {
				done(client);
			}
			return;
		}
		client.query('insert into messages (title, body) values ($1, $2)', [inputTitle, inputBody], function (err, result) {
			if (err) {
				done(client);
				return;
			} else {
				done();
			}
			console.log(inputTitle + " " + inputBody);

		});
		pg.end();
	});
});


app.get('/messages', function(req,res){
	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			if (client) {
				done(client);
			}
			return;
		}
		client.query('select * from messages', function (err, result) {
			var messageTables = result.rows
			console.log(messageTables);
			if (err) {
				done(client);
				return;
			} else {
				done();
				res.render('messages', {messages: messageTables})
			}
		});
	});	
});


app.listen(3000);


