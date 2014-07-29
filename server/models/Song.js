var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Song = new Schema({
        title: String,
        artist: String,
        score: Number
}, {
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret, options) {
      ret.id = ret._id.toHexString();
      delete ret._id;
    }
  },
 
  toObject: {
    virtuals: true
  }
});


mongoose.model('Song', Song);
