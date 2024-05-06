const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  leaveType: {
    type: String,
    enum: ["Sick", "Casual", "Personal"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  leaveDuration: { type: String, required: true },
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: ["Pending"]
  },
  comments: { type: String },
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
