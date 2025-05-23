const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Replace with your actual Kintone API token and domain
const KINTONE_DOMAIN = "https://demo-cebu.kintone.com";
const KINTONE_TOKEN = "IOIkT9gjxEASsHXZyhVBfPm7c7kqAFJ0xTOeXdbn";

app.use(cors());
app.use(express.json());

const headers = {
  "X-Cybozu-API-Token": KINTONE_TOKEN,
  "Accept-Language": "en",
};

// GET all records
app.get("/api/kintone/all-records", async (req, res) => {
  const { app } = req.query;

  try {
    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers,
      params: { app },
    });

    if (response.data.records && response.data.records.length > 0) {
      console.log("All records response:", response.data);
      res.json({
        status: "success",
        data: response.data.records,
        length: response.data.records.length,
      });
    } else {
      res.status(404).json({ status: "error", message: "No records found" });
    }
  } catch (err) {
    console.error("Error in all-records:", err);
    res.status(500).json({
      status: "error",
      message: err.response ? err.response.data : err.message,
    });
  }
});

// GET a single record by stockID
app.get("/api/kintone/record", async (req, res) => {
  const { app, stockID } = req.query;

  try {
    const queryString = `stockID="${stockID}"`; // exact match query

    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers,
      params: {
        app: Number(app),
        query: queryString,
      },
    });

    if (response.data.records && response.data.records.length > 0) {
      console.log("Single record response:", response.data);
      res.json({
        status: "success",
        data: response.data.records,
      });
    } else {
      res.status(404).json({ status: "error", message: "No records found" });
    }
  } catch (err) {
    console.error("Error in record:", err);
    res.status(500).json({
      status: "error",
      message: err.response ? err.response.data : err.message,
    });
  }
});

// GET multiple records based on array of stockIDs
app.get("/api/kintone/get-records", async (req, res) => {
  const { app, stockIdArray } = req.query;

  try {
    let query = "";

    if (stockIdArray) {
      const stockIDs = JSON.parse(stockIdArray);
      query = `stockID in (${stockIDs.map((id) => `"${id}"`).join(", ")})`;
    }

    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers,
      params: {
        app,
        query, // <-- PASS THE QUERY STRING HERE
      },
    });

    if (response.data.records && response.data.records.length > 0) {
      console.log("Multiple records response:", response.data);
      res.json({
        status: "success",
        data: response.data.records,
        length: response.data.records.length,
      });
    } else {
      res.status(404).json({ status: "error", message: "No records found" });
    }
  } catch (err) {
    console.error("Error in get-records:", err);
    res.status(500).json({
      status: "error",
      message: err.response ? err.response.data : err.message,
    });
  }
});

// POST - Create a new record
app.post("/api/kintone/record", async (req, res) => {
  try {
    const response = await axios.post(
      `${KINTONE_DOMAIN}/k/v1/record.json`,
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error in create record:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update a record
app.put("/api/kintone/record", async (req, res) => {
  try {
    const response = await axios.put(
      `${KINTONE_DOMAIN}/k/v1/record.json`,
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error in update record:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete a record
app.delete("/api/kintone/record", async (req, res) => {
  try {
    const response = await axios.delete(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers,
      data: req.body,
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error in delete record:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
