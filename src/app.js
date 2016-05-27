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
			console.log(inputTitle + " " + inputBody);
			if (err) {
				done(client);
				return;
			} else {
				done();
			}
		});
	});
	res.redirect('/messages')
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
			//console.log(messageTables);
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




app.get('/delete', function(req,res){

	res.render('delete')

})


app.post('/searching', function(req,res){
	var storeMessages = []
	var berichten = {}
	var inputText = req.body.userinput

	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			if (client) {
				done(client);
			}
			return;
		}
		client.query('select * from messages', function (err, result) {
			var pancake = result.rows
			console.log(result.rows)

			for( i=0; i < pancake.length; i++ ){
				console.log(pancake[i].id)

				var idMessage = pancake[i].id.toString()
				var titleMessage = pancake[i].title
				var bodyMessage = pancake[i].body
				var allMessage = idMessage + ' ' + titleMessage + ' ' + bodyMessage

				console.log(idMessage)

				var stringNr = idMessage.indexOf(inputText)
				var stringNr2 = titleMessage.indexOf(inputText)
				var stringNr3 = bodyMessage.indexOf(inputText)

				if( stringNr != -1 || stringNr2 != -1 || stringNr3 != -1 ){
					berichten = pancake[i]
					storeMessages.push(berichten)
				}
			}
			if(storeMessages.length > 0){
				res.send(storeMessages)
			} 

			if (err) {
				done(client);
				return;
			} else {
				done();
				//res.redirect('/messages')
			}
		});
	});	
})

app.post('/deleting', function(req,res){
	var userDelete = req.body.userinput

	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			if (client) {
				done(client);
			}
			return;
		}

		client.query('select * from messages', function (err, result) {

			if (err) {
				done(client);
				return;
			} else {

				for( i=0; i < result.rows.length; i++ ){

					var inputComplete = result.rows[i].title + " " + result.rows[i].body
					var idMessage = result.rows[i].id

					if(userDelete == inputComplete){
						client.query('delete from messages where id = $1', [idMessage], function (err, result) {
							if (err) {
								done(client);
								return;
							} else {
								done();
								res.redirect('/messages')
							}
						})
					}
				}
				done();
			}

		});
		pg.end()
	});	
})



app.post('/result', function(req, res){

	var storeUser = []
	var usersearch = req.body.userinput.toLowerCase()

	filereader.JSONreader('./resources/users.json', function (parsedJSON){
		// console.log('filereader werkt')

		for( i=0; i<parsedJSON.length; i++ ){

			var voornaam = parsedJSON[i].firstname.toLowerCase()
			var achternaam = parsedJSON[i].lastname.toLowerCase()
			var firstLastName = voornaam + " " + achternaam

			if(usersearch == voornaam || usersearch == achternaam || usersearch == firstLastName){
				storeUser.push(usersearch)
				var userFirst = parsedJSON[i].firstname
				var userLast = parsedJSON[i].lastname
				console.log('pushed')
			}
		}

		if(storeUser.length > 0){
			res.send("Name user: " + userFirst + " " + userLast)
		} else {
			res.send('No such user was found.')
		}
	} )
} );





app.listen(3000);


