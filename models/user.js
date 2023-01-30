const mongoose = require('mongoose');
const usersURI = "mongodb+srv://geoplus:" + encodeURIComponent('iLV63QiqVn4lbpKV') + "@cluster0.ksko1ps.mongodb.net/?retryWrites=true&w=majority";
var usersConnexion = mongoose.createConnection(usersURI, { useNewUrlParser : true });


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  money: {
    type: Number,
    default: 0
  }
});

const User = usersConnexion.model('User', UserSchema);

module.exports = User;
