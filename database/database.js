var mongoose = require('mongoose');


var patientSchema = new mongoose.Schema({
  id: String,
  test: [{type: mongoose.Schema.Types.ObjectId, ref: 'Test'}]

})

var testSchema = new mongoose.Schema({
  dateDone: Date,
  results: [{type: mongoose.Schema.Types.ObjectId, ref: 'Result'}]

})

var resultSchema = new mongoose.Schema({
  clasification: String,
  drugName: String,
  concentration: Number
})


var patient = mongoose.model('patient', patientSchema);
var test = mongoose.model('Test', testSchema);
var result = mongoose.model('Result', resultSchema)

module.exports = {patient: patient, test:test, result: result};
