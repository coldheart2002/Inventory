const express = require("express");
const router = express.Router();

const kintoneApi = require("../services/kintoneApi");

// GET all records
router.get("/all-records", async (req, res) => {
  const { app } = req.query;
  try {
    const data = await kintoneApi.getAllRecords(app);
    if (data.records && data.records.length > 0) {
      res.json({
        status: "success",
        data: data.records,
        length: data.records.length,
      });
    } else {
      res.status(404).json({ status: "error", message: "No records found" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET a single record by stockID
router.get("/record", async (req, res) => {
  const { app, stockID } = req.query;
  try {
    const data = await kintoneApi.getRecordByStockID(app, stockID);
    if (data.records && data.records.length > 0) {
      res.json({ status: "success", data: data.records });
    } else {
      res.status(404).json({ status: "error", message: "No records found" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET multiple records based on array of stockIDs
router.get("/get-records", async (req, res) => {
  const { app, stockIdArray } = req.query;
  try {
    const data = await kintoneApi.getMultipleRecords(app, stockIdArray);
    if (data.records && data.records.length > 0) {
      res.json({
        status: "success",
        data: data.records,
        length: data.records.length,
      });
    } else {
      res.status(404).json({ status: "error", message: "No records found" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// POST - Create a new record
router.post("/record", async (req, res) => {
  try {
    const data = await kintoneApi.createRecord(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// PUT - Update a record
router.put("/record", async (req, res) => {
  try {
    const data = await kintoneApi.updateRecord(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// DELETE - Delete a record
router.delete("/record", async (req, res) => {
  try {
    const data = await kintoneApi.deleteRecord(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
