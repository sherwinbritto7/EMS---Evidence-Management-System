import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ipfsHash: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Evidence = mongoose.model("Evidence", evidenceSchema);
export default Evidence;
