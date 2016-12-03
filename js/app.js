var express = require('express');
var app = express();
var mysql = require('mysql2');

var connection = mysql.createConnection({host:'localhost', user:'root', password:'steviebca', database:'tacos'});

app.get('/', function(req, res) {
	connection.query('SELECT * FROM TacoRestaurant', function (err, results, fields) {
		console.log(results);
	});
	res.sendFile('/Users/smckinless/cs3200-project/index.html');
});

app.listen(3000, function() {
	console.log("App running on port 3000.");
});