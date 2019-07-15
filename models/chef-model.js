const mongoose = require('mongoose');

const chefsTable = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true},
  email: {type: String, required: true},//, unique: true,index: true
  location: {type: String, required: true},
});

module.exports = mongoose.model('Chefs', chefsTable);