var express = require('express');
var app = express();
var mysql = require('mysql2');
var path = require('path');

var connection = mysql.createConnection({host:'localhost', user:'root', password:'steviebca', database:'tacos'});
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));

app.get('/', function(req, res) {
	connection.query('SELECT * FROM Location', function (err, results, fields) {
		console.log(results);
	});
	res.sendFile('/Users/smckinless/cs3200-project/index.html');
	console.log(__dirname);
});

app.listen(3000, function() {
	console.log("App running on port 3000.");
});