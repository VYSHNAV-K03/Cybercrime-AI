const mongoose = require('mongoose');

const crimeReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
    required: true,
  },
  crimeType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  evidence: {
    type: String, // File path for the uploaded evidence
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CrimeReport = mongoose.model('CrimeReport', crimeReportSchema);

module.exports = CrimeReport;
