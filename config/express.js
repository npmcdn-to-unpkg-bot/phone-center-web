var express = require('express'),
    expressValidator = require('express-validator');

module.exports = function(app) {
  var port = app.config.port || 3000;
  app.set('showStackError', true);
  app.use(express["static"]("" + app.config.root + "/public"));
  app.set('port', port);
  app.use(expressValidator());
	var bodyParser = require('body-parser');
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
};
