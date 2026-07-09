const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  input: { type: String, required: true },
  verdict: { type: String },
  scamType: { type: String },
  confidence: { type: String },
  explanation: { type: String },
  whatToDo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);