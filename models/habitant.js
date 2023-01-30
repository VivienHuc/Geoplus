const mongoose = require('mongoose');
const habitantsURI = "mongodb+srv://geoplus:" + encodeURIComponent('iLV63QiqVn4lbpKV') + "@cluster0.ksko1ps.mongodb.net/?retryWrites=true&w=majority";
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
