const express = require("express");
const dbConnect = require("./db");
require("dotenv").config();
const cors = require("cors");
const Leave = require("./leaveSchema");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
dbConnect();

// Define the GET endpoint for fetching leave history
app.get("/api/leave-history", async (req, res) => {
  try {
    const leaveHistory = await Leave.find();
    res.json(leaveHistory);
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the PUT endpoint for updating the approval status of a single leave entry
app.put("/api/update-approval-status/:id", async (req, res) => {
  const entryId = req.params.id;
  let newStatus = req.body.approvalStatus;
  try {
    const updatedEntry = await Leave.findByIdAndUpdate(
      entryId,
      { approvalStatus: newStatus },
      { new: true }
    );
    if (updatedEntry) {
      res.json(updatedEntry);
    } else {
      res.status(404).json({ error: "Leave entry not found" });
    }
  } catch (error) {
    console.error("Error updating approval status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the DELETE endpoint for deleting a leave entry
app.delete("/api/delete-leave-entry/:id", async (req, res) => {
  const entryId = req.params.id;
  try {
    const deletedEntry = await Leave.findByIdAndDelete(entryId);
    if (deletedEntry) {
      res.json({ message: "Leave entry deleted successfully" });
    } else {
      res.status(404).json({ error: "Leave entry not found" });
    }
  } catch (error) {
    console.error("Error deleting leave entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the POST endpoint for submitting a leave application
app.post("/api/submit", async (req, res) => {
  const leave = new Leave({
    employeeName: req.body.employeeName,
    leaveType: req.body.leaveType,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    leaveDuration: req.body.leaveDuration,
    approvalStatus: req.body.approvalStatus,
    comments: req.body.comments,
  });
  try {
    await leave.save();
    res.send("Leave application submitted successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use port from environment variable or default to 8800
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
