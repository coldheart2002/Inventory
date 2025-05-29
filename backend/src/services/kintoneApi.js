const axios = require("axios");

// Use your real token and domain here or environment variables
const KINTONE_DOMAIN = "https://demo-cebu.kintone.com";
const KINTONE_TOKEN = "IOIkT9gjxEASsHXZyhVBfPm7c7kqAFJ0xTOeXdbn";

const headers = {
  "X-Cybozu-API-Token": KINTONE_TOKEN,
  "Accept-Language": "en",
};

async function getAllRecords(app) {
  const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
    headers,
    params: { app },
  });
  return response.data;
}

async function getRecordByStockID(app, stockID) {
  const queryString = `stockID="${stockID}"`;
  const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
    headers,
    params: { app, query: queryString },
  });
  return response.data;
}

async function getMultipleRecords(app, stockIdArray) {
  let query = "";
  if (stockIdArray) {
    const stockIDs = JSON.parse(stockIdArray);
    query = `stockID in (${stockIDs.map((id) => `"${id}"`).join(", ")})`;
  }
  const response = await axios.get(`${KINTONE_DOMAIN}/k/v1/records.json`, {
    headers,
    params: { app, query },
  });
  return response.data;
}

async function createRecord(body) {
  const response = await axios.post(
    `${KINTONE_DOMAIN}/k/v1/record.json`,
    body,
    {
      headers,
    }
  );
  return response.data;
}

async function updateRecord(body) {
  const response = await axios.put(`${KINTONE_DOMAIN}/k/v1/record.json`, body, {
    headers,
  });
  return response.data;
}

async function deleteRecord(body) {
  const response = await axios.delete(`${KINTONE_DOMAIN}/k/v1/records.json`, {
    headers,
    data: body,
  });
  return response.data;
}

module.exports = {
  getAllRecords,
  getRecordByStockID,
  getMultipleRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};
