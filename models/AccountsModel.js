var mongoose 							= require('mongoose'),
		Schema 								= mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	user_id: {type: String, lowercase: true, trim: true}
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);