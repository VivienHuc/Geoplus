const mongoose = require('mongoose');
const usersURI = "mongodb+srv://Bully:" + encodeURIComponent('pC2F8GayN3TB7h8T') + "@cluster0-798oj.mongodb.net/pompiers?retryWrites=true";
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
