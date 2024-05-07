const express = require("express");
const dbConnect = require("./db");
require("dotenv").config();
const cors = require("cors");
const Leave = require("./leaveSchema");
const app = express();
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Define the GET endpoint for fetching leave history
dbConnect();
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
    const updatedEntry = await Leave.findByIdAndUpdate(entryId, { approvalStatus: newStatus }, { new: true });
    // Search for the requested leave entry in the database and update the approval status if it exists
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5555;
app.listen(5555, () => {
  console.log(`Server is running on port ${PORT}`);
});
