import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/kintone"; // your proxy prefix

export const getRecord = async (appId, stockID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/kintone/record`, {
      params: {
        app: appId,
        stockid: stockID, // Ensuring it matches the backend query params
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching record:",
      error.response ? error.response.data : error.message
    );
  }
};

export const createRecord = async (appId, recordData) => {
  const response = await axios.post(`${API_BASE_URL}/record`, {
    app: appId,
    record: recordData,
  });
  return response.data;
};

export const updateRecord = async (appId, recordId, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/record`, {
    app: appId,
    id: recordId,
    record: updatedData,
  });
  return response.data;
};

export const deleteRecord = async (appId, recordId) => {
  const response = await axios.delete(`${API_BASE_URL}/record`, {
    data: { app: appId, ids: [recordId] },
  });
  return response.data;
};
