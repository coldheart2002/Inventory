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

//GET all Records
app.get("/api/kintone/all-records", async (req, res) => {
  const { app } = req.query;

  try {
    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers,
      params: {
        app,
      },
    });

    // If records are returned, send them as a response
    if (response.data.records && response.data.records.length > 0) {
      console.log(response);
      res.json({
        status: "success",
        data: response.data.records,
        length: response.data.records.length,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No records found",
      });
    }
  } catch (err) {
    console.error(err);

    res.json(err);
    res.status(500).json({
      status: "error",
      message: err.response ? err.response.data : err.message,
    });
  }
});

// GET - Read records based on a query (e.g., stockId = "S1245")
app.get("/api/kintone/get-records", async (req, res) => {
  const { app, stockID } = req.query;

  try {
    // Ensure that the query string is correctly formatted for Kintone
    const queryString = `stockID="${stockID}"`; // Using quotes for exact match in Kintone query

    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers, // Assuming `headers` contains the necessary authorization
      params: {
        app: Number(app),
        query: queryString, // Sending the filter query
      },
    });

    // If records are returned, send them as a response
    if (response.data.records && response.data.records.length > 0) {
      console.log(response);
      res.json({
        status: "success",
        data: response.data.records, //get the first
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
