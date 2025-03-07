const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  resumeUrl: { type: String, required: true },
  parsedDetails: { type: Object, default: {} },
  status: {
    type: String,
    enum: ["pending", "reviewed", "interview", "hired", "rejected"], 
    default: "pending",
  },
});

module.exports = mongoose.model("Application", applicationSchema);
