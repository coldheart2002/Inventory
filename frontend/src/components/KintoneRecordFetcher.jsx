import React, { useEffect, useState } from "react";
import {
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../api/kintoneService";

const KintoneRecordFetcher = () => {
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  const appId = 28;
  const recordId = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecord(appId, recordId);
        setRecord(data);
      } catch (err) {
        setError(err.message || "Failed to fetch record");
      }
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    const newRecord = {
      Name: { value: "New Entry" },
      Age: { value: "25" },
    };
    const created = await createRecord(appId, newRecord);
    alert("Record created with ID: " + created.id);
  };

  const handleUpdate = async () => {
    const updated = await updateRecord(appId, recordId, {
      Name: { value: "Updated Name" },
    });
    alert("Record updated");
  };

  const handleDelete = async () => {
    await deleteRecord(appId, recordId);
    alert("Record deleted");
  };

  return (
    <div>
      <h2>Kintone Record</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {record ? (
        <pre>{JSON.stringify(record, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleCreate}>Create</button>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default KintoneRecordFetcher;
