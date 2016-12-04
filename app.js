var express = require('express');
var mysql = require('mysql2');
var path = require('path');
var nunjucks = require('nunjucks');
var bcrypt = require('bcrypt');
var app = express();


var connection = mysql.createConnection({host:'localhost', user:'root', password:'steviebca', database:'tacos'});
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
//app.set('views', path.join(__dirname, app.get('assets_path') + '/views'));
//app.set('view engine', 'njk');

// Setup nunjucks templating engine
nunjucks.configure('views', {
    autoescape: true,
    noCache: true,
    watch: true,
    express: app
});

app.get('/', function(req, res) {
	// connection.query('SELECT * FROM Location', function (err, results, fields) {
	// 	console.log(results);
	// });
	console.log(bcrypt.hashSync('234232fsfs', 10));
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:cityName/:neighborhoodName', function(req, res) {
	connection.query('SELECT * FROM TacoRestaurant JOIN Location ON TacoRestaurant.locationId = Location.locationId JOIN Review ON Review.storeId = TacoRestaurant.storeId JOIN Neighborhood ON Neighborhood.neighborhoodId = Location.neighborhoodId JOIN City ON City.cityId = Neighborhood.cityId WHERE Neighborhood.name = "' + req.params.neighborhoodName + '" AND City.name = "' + req.params.cityName + '";', function (err, results, fields) {
		//res.send(results);
		results = JSON.parse(JSON.stringify(results))[0];
		res.render('neighborhood.html', { results : results });
		console.log(results);
	});
	
});

app.listen(3000, function() {
	console.log("App running on port 3000.");
});