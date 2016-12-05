var express = require('express');
var mysql = require('mysql2');
var path = require('path');
var nunjucks = require('nunjucks');
var bcrypt = require('bcrypt');
var app = express();
var session = require('client-sessions');


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

app.use(session({
  cookieName: 'session',
  secret: 'asndfioinf3fn394f34fqwkprq3wq_QWR_WERQWr3r032rubfjjbf23839282edbeubdb',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

function requireLogin (req, res, next) {
	console.log(req.session.user);
	if (!req.session.user) {
		res.redirect('/signin');
	} else {
		next();
	}
};

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:cityName/:neighborhoodName', function(req, res) {
	connection.query('SELECT * FROM TacoRestaurant JOIN Location ON TacoRestaurant.locationId = Location.locationId JOIN Review ON Review.storeId = TacoRestaurant.storeId JOIN Neighborhood ON Neighborhood.neighborhoodId = Location.neighborhoodId JOIN City ON City.cityId = Neighborhood.cityId WHERE Neighborhood.neighborhood = "' + req.params.neighborhoodName + '" AND City.city = "' + req.params.cityName + '";', function (err, results, fields) {
		//res.send(results);
        console.log(results);    //
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

app.get('/signin', function(req, res) {
	res.render('signin.html');
})

app.post('/signin', function(req, res) {
	connection.query('SELECT * FROM User WHERE username = "' + req.body.username + '";', function(err, results, fields) {
		if (results.length > 0) {
			results = JSON.parse(JSON.stringify(results));
			if (bcrypt.compareSync(req.body.password, results[0]['password'])) {
				req.session.user = results[0];
				delete req.session.user.password;
				res.redirect('/');
			}
			else {
				res.render('signin.html', { error : 'Invalid username or password' });
			}
		}
	});
});

app.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});

app.get('/review', requireLogin, function(req, res) {
	res.render("createReview.html");
});

app.post('/:storeid/review', requireLogin, function(req, res) {
	connection.execute('INSERT INTO Review (storeId, reviewText, username) VALUES (' + req.params.storeId + '"' + req.body.review + '", "' + req.session.user['username'] + '";', function(err, results, fields) {
		res.send('Your review is posted!');
	});
})

app.listen(3000, function() {
	console.log("App running on port 3000.");
});