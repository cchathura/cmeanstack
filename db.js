var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/flihts');
module.exports = mongoose.connection;
