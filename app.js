var express = require('express');
var mysql = require('mysql2');
var path = require('path');
var nunjucks = require('nunjucks');
var bcrypt = require('bcrypt');
var app = express();


var connection = mysql.createConnection({host:'localhost', user:'root', password:'steviebca', database:'tacos'});
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup nunjucks templating engine
nunjucks.configure('views', {
    autoescape: true,
    noCache: true,
    watch: true,
    express: app
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:cityName/:neighborhoodName', function(req, res) {
	connection.query('SELECT * FROM TacoRestaurant JOIN Location ON TacoRestaurant.locationId = Location.locationId JOIN Review ON Review.storeId = TacoRestaurant.storeId JOIN Neighborhood ON Neighborhood.neighborhoodId = Location.neighborhoodId JOIN City ON City.cityId = Neighborhood.cityId WHERE Neighborhood.neighborhood = "' + req.params.neighborhoodName + '" AND City.city = "' + req.params.cityName + '";', function (err, results, fields) {
		//res.send(results);
		results = JSON.parse(JSON.stringify(results));
		res.render('neighborhood.html', { results : results });
		console.log(results);
	});
	
});

app.get('/signup', function(req, res) {
	res.render('signup.html');
});

app.post('/signup', function(req, res) {
	var username = req.body.username;
	var email = req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM User WHERE username = "' + username + '" OR email = "' + email + '";', function(err, results, fields) {
    	if (results.length > 0) {
    		res.redirect('/signup');

    	}
    	else {
    		connection.execute('INSERT INTO User (username, password, email) VALUES ("'+username+'", "'+bcrypt.hashSync(password, 10)+'", "'+email+'");', function(err, results, fields) {
    			res.send("You are signed up!");
   			});
    	}
    });
    
	
});

app.listen(3000, function() {
	console.log("App running on port 3000.");
});