const subdomain = "demo-cebu"; // Replace with your Kintone subdomain
const appId = 29; // Replace with your Kintone app ID
const apiToken = "IOIkT9gjxEASsHXZyhVBfPm7c7kqAFJ0xTOeXdbn"; // Replace with your API token

const query = 'stockID="8080"'; // Example query parameter
const url = `https://${subdomain}.kintone.com/k/v1/records.json?app=${appId}&query=${encodeURIComponent(
  query
)}`;

console.log("Request URL:", url); // Log the full URL

fetch(url, {
  method: "GET",
  headers: {
    "X-Cybozu-API-Token": apiToken,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
