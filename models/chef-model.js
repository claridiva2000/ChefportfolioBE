const mongoose = require('mongoose');

const chefsTable = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String, 
    required: true, 
    unique: true, 
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},//, unique: true,index: true
  password: {type: String, required: true},
  name: {type: String, required: true},
  location: {type: String, required: true},
  profilepic: {type: String, default: 'https://cdn3.vectorstock.com/i/1000x1000/04/72/chef-icon-with-a-moustache-on-white-background-vector-16670472.jpg' }
  
});

module.exports = mongoose.model('Chefs', chefsTable);