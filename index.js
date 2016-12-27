var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//var request = require('request');
var syncrequest = require('sync-request');
var path = require('path');

// app initialization params
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//Rest of the initialziation
var zoom_key = process.env['ZOOM_API_KEY'];
var zoom_sec = process.env['ZOOM_API_SEC'];
var router = express.Router();

//Set the routes
router.get('/', function(req, res) {
  res.render('home', {title: 'Welcome'});
});

router.get('/users', function(req, res) {
  res.render('users', {title: 'User Management'});
});

router.post('/users', function(req, res) {
  console.log(req.body);
  console.log("email:", req.body.email);
  //make a REST call to Zoom to create the Users
  var options = {
    qs: {api_key: zoom_key, api_secret: zoom_sec, data_type: "JSON", email: req.body.email , type: 1}
  };

  // make a synchronous request to zoom to create a meeting
  var syncres = syncrequest('POST',"https://api.zoom.us/v1/user/create",options);
  var response=JSON.parse(syncres.getBody('utf8'));

  console.log(response);

  res.redirect('/');
});

router.get('/meetings', function(req, res) {
  res.render('Meetings', {title: 'Manage Meetings'});
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', router);
app.listen(3000);

console.log("Node has started");
