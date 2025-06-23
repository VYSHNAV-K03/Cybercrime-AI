const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
  comment: String,
  label: String,
  description: String,
  legal: String,
  wiki: String,
  complaintText: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
