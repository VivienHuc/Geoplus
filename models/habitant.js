const mongoose = require('mongoose');
const habitantsURI = "mongodb+srv://Bully:" + encodeURIComponent('pC2F8GayN3TB7h8T') + "@cluster0-798oj.mongodb.net/habitants?retryWrites=true";
var habitantsConnexion = mongoose.createConnection(habitantsURI, { useNewUrlParser : true });


const HabitantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  position: [{
    type: String,
    required: true
  }],
  given: {
    type: String,
    default: "0"
  }
});

const Habitant = habitantsConnexion.model('Habitant', HabitantSchema);

module.exports = Habitant;
