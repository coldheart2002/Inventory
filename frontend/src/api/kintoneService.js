import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/kintone"; // your proxy prefix

// Get all records for a given appId
export const getAllRecords = async (appId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all-records`, {
      params: {
        app: appId, // use dynamic appId
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all records:",
      error.response ? error.response.data : error.message
    );
  }
};

// Get a single record by stockID from a given appId
export const getRecord = async (appId, stockID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/record`, {
      params: {
        app: appId,
        stockID,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching record:",
      error.response ? error.response.data : error.message
    );
  }
};

// Get multiple records based on an array of stockIDs for an app
export const getRecordUsingFieldCode = async (appId, stockIdArray) => {
  console.log("Fetching records for stock IDs:", stockIdArray);
  try {
    const response = await axios.get(`${API_BASE_URL}/get-records`, {
      params: {
        app: appId,
        stockIdArray: JSON.stringify(stockIdArray), // stringify the array
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching records by field code:",
      error.response ? error.response.data : error.message
    );
  }
};

// Create a new record
export const createRecord = async (appId, recordData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/record`, {
      app: appId,
      record: recordData,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating record:",
      error.response ? error.response.data : error.message
    );
  }
};

// Update a record
export const updateRecord = async (appId, recordId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/record`, {
      app: appId,
      id: recordId,
      record: updatedData,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating record:",
      error.response ? error.response.data : error.message
    );
  }
};

// Delete a record
export const deleteRecord = async (appId, recordId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/record`, {
      data: { app: appId, ids: [recordId] },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting record:",
      error.response ? error.response.data : error.message
    );
  }
};
