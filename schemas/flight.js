var mongoose = require('mongoose');
module.exports = mongoose.model('Flight',{
	number : Number,
	origin:String,
	Destination: String,
	departs: String,
	arrives: String,
	actualDepart: Number,
	actualArrive: Number
});
