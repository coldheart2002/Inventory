const axios = require("axios");

// Replace with your actual values
const APP_ID = 29;
const API_TOKEN = "IOIkT9gjxEASsHXZyhVBfPm7c7kqAFJ0xTOeXdbn";
const KINTONE_DOMAIN = "https://demo-cebu.kintone.com"; // No trailing slash

const STOCK_ID_VALUE = "8080"; // The value you're searching for in 'stockid'

const url = `${KINTONE_DOMAIN}/k/v1/records.json`;

const headers = {
  "X-Cybozu-API-Token": API_TOKEN,
  "Content-Type": "application/json",
};

// Kintone query format: stockid = "value"
const params = {
  app: APP_ID,
  query: `stockid = "${STOCK_ID_VALUE}"`,
};

async function getKintoneRecordsByStockId() {
  try {
    const response = await axios.get(url, {
      headers,
      params,
    });
    console.log("Matching Records:", response.data.records);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

getKintoneRecordsByStockId();
