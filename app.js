var express = require('express');
var app = express();
var mysql = require('mysql2');
var path = require('path');
var nunjucks = require('nunjucks');

var connection = mysql.createConnection({host:'localhost', user:'root', password:'steviebca', database:'tacos'});
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
app.set('views', path.join(__dirname, app.get('assets_path') + '/views'));

// Setup nunjucks templating engine
nunjucks.configure(app.get('views'), {
    autoescape: true,
    noCache: true,
    watch: true,
    express: app
});

app.get('/', function(req, res) {
	// connection.query('SELECT * FROM Location', function (err, results, fields) {
	// 	console.log(results);
	// });
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:cityName/:neighborhoodName', function(req, res) {
	connection.query('SELECT * FROM TacoRestaurant JOIN Location ON TacoRestaurant.locationId = Location.locationId JOIN Review ON Review.storeId = TacoRestaurant.storeId JOIN Neighborhood ON Neighborhood.neighborhoodId = Location.neighborhoodId JOIN City ON City.cityId = Neighborhood.cityId WHERE Neighborhood.name = "' + req.params.neighborhoodName + '" AND City.name = "' + req.params.cityName + '";', function (err, results, fields) {
		res.send(results);
		console.log(results);
	});
});

app.listen(3000, function() {
	console.log("App running on port 3000.");
});