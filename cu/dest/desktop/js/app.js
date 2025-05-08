(function () {
  "use strict";

  // === Function for Create Success ===
  function handleCreateSuccess(event) {
    const record = event.record;
    const currentAppId = kintone.app.getId(); // Get current app ID

    // Only proceed if app ID is 31 or 32
    if (currentAppId !== 31 && currentAppId !== 32) {
      return event; // Do nothing
    }

    const additionalProductID = record.additionalProductID.value;
    const additionalNewQuantity = Number(record.additionalQuantity.value);

    if (!additionalProductID || isNaN(additionalNewQuantity)) {
      alert("Missing or invalid product ID or quantity!");
      return event;
    }

    const productDatabaseID = 30;
    const params = {
      app: productDatabaseID,
      query: `productID = "${additionalProductID}"`,
    };

    return kintone
      .api(kintone.api.url("/k/v1/records", true), "GET", params)
      .then((resp) => {
        const matchingRecords = resp.records;

        if (matchingRecords.length === 0) {
          alert(
            `No records found in App 30 for productId "${additionalProductID}".`
          );
          return Promise.reject("No matching record found!");
        }

        const productDetails = matchingRecords[0];
        const productRecordID = Number(productDetails.$id.value);
        const productQuantity = Number(productDetails.productQuantity.value);

        const updatedQuantity =
          currentAppId === 32
            ? productQuantity + additionalNewQuantity
            : productQuantity - additionalNewQuantity;

        const updateParams = {
          app: productDatabaseID,
          id: productRecordID,
          record: {
            productQuantity: { value: updatedQuantity },
          },
        };

        return kintone.api(
          kintone.api.url("/k/v1/record", true),
          "PUT",
          updateParams
        );
      })
      .then((updateResp) => {
        console.log("Product quantity updated:", updateResp);
        alert("Product Database updated successfully!");
        return event;
      })
      .catch((error) => {
        console.error("Update error:", error);
        alert(
          "Error updating product quantity:\n" + JSON.stringify(error, null, 2)
        );
        return event;
      });
  }

  // === Function for Edit Success ===
  function handleEditSuccess(event) {
    alert("Record edit successful — you can run another function here.");
    // Do something else here
    return event;
  }

  // Register events
  kintone.events.on("app.record.create.submit.success", handleCreateSuccess);
  kintone.events.on("app.record.edit.submit.success", handleEditSuccess);
})();
