const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Replace this with your actual Kintone API token and domain
const KINTONE_DOMAIN = "https://demo-cebu.kintone.com";
const KINTONE_TOKEN = "UgscvP4KNyUk95XDFlRhAJDSnNP05pk8S9JBLczP";

app.use(cors());
app.use(express.json());

const headers = {
  "X-Cybozu-API-Token": KINTONE_TOKEN,
  "Content-Type": "application/json",
};

// GET - Read a record
app.get("/api/kintone/record", async (req, res) => {
  const { app, id } = req.query;
  try {
    const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/record.json`, {
      headers,
      params: { app, id },
    });
    res.json(response.data);
  } catch (err) {
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
