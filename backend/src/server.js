const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Replace this with your actual Kintone API token and domain
const KINTONE_DOMAIN = "https://demo-cebu.kintone.com";
const KINTONE_TOKEN = "IOIkT9gjxEASsHXZyhVBfPm7c7kqAFJ0xTOeXdbn";

app.use(cors());
app.use(express.json());

const headers = {
  "X-Cybozu-API-Token": KINTONE_TOKEN,
  // "Content-Type": "application/json",
  "Accept-Language": "en",
};

// Kintone get All Records
app.get("/api/kintone/all-records", async (req, res) => {
  const { app } = req.query;

  try {
    // Ensure no filtering in the query string (retrieving all records)
    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers, // Assuming `headers` contains the necessary authorization
      params: {
        app: parseInt(app),
        query: "", // Empty query retrieves all records
      },
    });

    // If records are returned, send them as a response
    if (response.data.records && response.data.records.length > 0) {
      console.log(response);
      res.json({
        status: "success",
        data: response.data.records, // All records
      });
    } else {
      res.status(303).json({
        status: "error",
        message: "No records found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: err.response ? err.response.data : err.message,
    });
  }
});

// GET - Read a record based on a query (e.g., stockId = "S1245")
app.get("/api/kintone/record", async (req, res) => {
  const { app, stockID } = req.query;

  try {
    const queryString = `stockID="${stockID}"`;

    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers,
      params: {
        app: Number(app),
        query: queryString,
      },
    });

    if (response.data.records && response.data.records.length > 0) {
      res.json({
        status: "success",
        data: response.data.records[0], // Return the first record if needed
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No records found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message:
        "An error occurred while fetching the record. Please try again later.",
    });
  }
});

// POST - Create a new record
app.post("/api/kintone/record", async (req, res) => {
  try {
    const response = await axios.post(
      `${KINTONE_DOMAIN}/k/v1/record.json`,
      req.body,
      {
        headers,
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update a record
app.put("/api/kintone/record", async (req, res) => {
  try {
    const response = await axios.put(
      `${KINTONE_DOMAIN}/k/v1/record.json`,
      req.body,
      {
        headers,
      }
    );
    res.json(response.data);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
