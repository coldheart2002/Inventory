const app = kintone.app.getId();
const params = {
  app: app,
  query: 'text like "' + keyword + '"',
};

kintone
  .api(kintone.api.url("/k/v1/records", true), "GET", params)
  .then((resp) => {
    if (resp.records.length !== 0) {
      // Process of displaying record retrieval result
      const url = "?view=" + id + '&q=f6054049%20like%20"' + keyword + '"';
      window.location.replace(url);
    } else if (resp.records.length === 0) {
      // Process when no record is found
      const info = new Kuc.Notification({
        text: "No records",
        type: "info", // Blue background color is set
      });
      info.open(); // Show info
    }
  })
  .catch((error) => {
    // Process when REST API error occurs
    let errmsg = "An error occurred while retrieving the record.";
    if (error.message !== undefined) {
      errmsg += " " + error.message;
    }
    const alert = new Kuc.Notification({
      text: errmsg,
      // If the type property is not specified, red background color is set
    });
    alert.open(); // Show alert
  });
