var path = require("path"),
	rootPath = path.normalize(__dirname + '/..');

module.exports = {
	production: {
		db: 'no_name',
		url: 'http://localhost:8015',
		root: rootPath,
		app: {
			name: 'Phone Center'
		},
		port: 8015,
	},
	development: {
		db: "mongodb://localhost/phone_center_db_dev",
		url: 'https://localhost:8010',
		root: rootPath,
		app: {
			name: 'Phone Center Dev'
		},
		port: 8010,
	}	
};
