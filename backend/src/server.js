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
  "Content-Type": "application/json",
};

// GET - Read a record based on a query (e.g., stockId = "S1245")
app.get("/api/kintone/record", async (req, res) => {
  const { app, query } = req.query;
  console.log("App:", app, "Query:", query); // 👈 Add this for debugging

  try {
    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
      headers,
      params: { app, query },
    });

    const record = response.data.records[0];
    console.log(record);

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    // res.json(record);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
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
