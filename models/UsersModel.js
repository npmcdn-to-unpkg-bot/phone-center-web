// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// module.exports allows us to pass this to other files when it is called
var UserModel = new Schema({
	// User name
	name						: {type: String, default: ''},
	lastname				: {type: String},
	lastname2				: {type: String},
	fullname				: {type: String},
	// User email  -  required for create an account
	email						: {type: String, lowercase: true, trim: true, unique:true, required:true},
	// Gender of the user registered
	gender					: {type: String, enum:["MALE", "FEMALE"]},
	// Age calculated with a mongoose middleware --- TODO
	age							: {type: Number},
	// Required for token expiration on app... --- TODO redirect to a page for login on invalid token
	exp 						: {type: Number},
	// Who creates the new user
	created_by			: {type: String, ref: 'Users'},
	// Date when was registered
	creation_date		: {type: Date, default: Date.now},
	// When was the las update
	last_modified_date: {type: Date, default: Date.now},
	// Assigned States
	state 					:{
											_id					:{type: String, ref:"States"},
											name				:{type: String}
										},
	// Assgined Jurisdictions
	jurisdictions		: [
											{
												_id					:{type: Schema.Types.ObjectId, ref:"Jurisdiction"},
												key					:{type: String},
												name				:{type: String}
											}
										],
	// Assgined Municipalities
	municipalities		: [
											{
												_id					:{type: Schema.Types.ObjectId, ref:"Municipalities"},
												key					:{type: String},
												name				:{type: String}
											}
										],
	// Assigned clues
	clues						: [
											{
												_id					:{type: String, ref:"Clues"},
												name				:{type: String}
											}
										],
	// Assigned Coordinations
	coordinations 	: [
											{
												_id					:{type: String, ref:"Coordinations"},
												name				:{type: String}
											}
										],
	// User profile
	profile 				: {
											_id					:{type: String, ref:"Profiles"},
											name				:{type: String}
										},
	role		 				: {
											_id					:{type: Schema.Types.ObjectId, ref:"Roles"},
											name				:{type: String}
										},
	// level 					: {
	// 										_id						:{type:String, ref:'Levels'},
	// 										name 					:{type:String}
	// 									},
	// Token created for restore password through email notification
	resetPasswordToken :String,
	// Time to take token for expiration
	resetPasswordExpires :Date
});
var fillData = function(next) {
		var fullName = "";
		if ( this.name 					!= '' ) fullName += this.name;
		if ( this.lastname 			!= '' ) fullName += ' ' + this.lastname;
		if ( this.lastname2 		!= '' ) fullName += ' ' + this.lastname2;
		this.fullname = fullName;
		this.last_modified_date = new Date();
		next();
}

UserModel.pre('save', fillData);

// UserModel.pre('update', fillData);

module.exports = mongoose.model('Users', UserModel);