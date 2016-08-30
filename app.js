var express					= require('express');
var morgan					= require('morgan');
var bodyParser			= require('body-parser');
var methodOverride	= require('method-override');
var env							= process.env.NODE_ENV || 'development';
var mongoose				= require('mongoose');
var app							= express();
var router					= express.Router();
var fs							= require('fs');
var passport				= require('passport');
var config					= require('./config/config')[env];
var LocalStrategy		= require('passport-local').Strategy;
var server					= require('http').Server(app);
var io							= require('socket.io')(server);
var socket					= require('./routes/socket.js');
var log							= require('./config/logger.js');
var errorHandler		= require('./utils/errorHandler.js').errorHandler;
var expressJwt			= require('express-jwt');
var useragent 			= require('express-useragent');

GLOBAL.config				= config;

//Connecting to a database -- See config/config.js
mongoose.connect(config.db, function(err, res, callback) {
	if(err) { 
		log.error('ERROR: connecting to Database.' + err);
	}else{
		log.console('Connected to Database', config.db);
	}
});

/** Passport cofig  -- Module that encrypts passwords **/
var Account = require('./models/AccountsModel');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//configuring app.use()
app.use(function (req, res, next) {
	// Allow to do requests to other domains
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Allow methods
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// Set header for authorization
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.env = env;
app.config = config;
app.secret = "$3cR3tK3Y-3f1m3d4pp.";

require('./config/express')(app);

io.sockets.on('connection', socket);

app.use(morgan('dev')); 															// log every request to the console
app.use(bodyParser.urlencoded({ extended: false })) 	// parse application/x-www-form-urlencoded
app.use(bodyParser.json())    												// parse application/json
app.use(methodOverride()); 														// simulate DELETE and PUT

//Middleware to handle user-agent
app.use(useragent.express());
/** Reads alls routes **/
routes_path = __dirname + '/routes';
fs.readdirSync(routes_path).forEach(function(file) {
	var arrRouteSplit = file.split(".");
	if (arrRouteSplit[0] != "")
		 require('./routes/'+arrRouteSplit[0])(app, router);
});

// Set router middleware to serve rest services
app.use('/', router);

//Middleware to handle with errors
app.use(errorHandler);



//Catch exceptions and trace CLI
process.on('uncaughtException', function(err) {
	log.error("uncaughtException!!!");
	log.error(err.stack);
	log.info(new Date());
	//throw err;
});

//Log server is running
server.listen(app.get('port'), function() {
	log.info("EFIMED server running on http://localhost:" + app.get('port'));
});