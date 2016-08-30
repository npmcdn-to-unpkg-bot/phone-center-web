var mongoose = require('mongoose'),
		Schema = mongoose.Schema;
 
var SessionsModel = new Schema({
	user_id							: {type:Schema.Types.ObjectId, ref:'Users'},
	email								: {type: String, trim:true, lowercase:true},
	connection_date 		: {type: Date, default: Date.now},
	socket_id						: {type: String},
	from_device					: {type: String, enum: ["WEB", "iOS_DEVICE", "ANDROID_DEVICE"]}
	/**TODO -Agregar datos del dispositivo donde se esta realizando la conexión**/
});
 
module.exports = mongoose.model('Sessions', SessionsModel);