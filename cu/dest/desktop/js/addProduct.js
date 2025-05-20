(function () {
  "use strict";

  function updateProductQuantity(event) {
    const record = event.record;
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

    // First: Search the product by productID
    return kintone
      .api(kintone.api.url("/k/v1/records", true), "GET", params)
      .then((resp) => {
        const matchingRecords = resp.records;

        if (matchingRecords.length === 0) {
          alert(
            `No records found in App 30 for productId "${additionalProductID}".`
          );
          return Promise.reject("No matching record found.");
        }

        const productDetails = matchingRecords[0];
        const productRecordID = Number(productDetails.$id.value);
        const productQuantity = Number(productDetails.productQuantity.value);
        const updatedQuantity = productQuantity + additionalNewQuantity;

        const updateParams = {
          app: productDatabaseID,
          id: productRecordID,
          record: {
            productQuantity: { value: updatedQuantity },
          },
        };

        // Second: Update the quantity
        return kintone.api(
          kintone.api.url("/k/v1/record", true),
          "PUT",
          updateParams
        );
      })
      .then((updateResp) => {
        console.log("Update response:", updateResp);
        alert("Product Database updated successfully!");
        return event;
      })
      .catch((error) => {
        console.error("Update failed:", error);
        alert(
          "Error updating product quantity:\n" + JSON.stringify(error, null, 2)
        );
        return event;
      });
  }

  //////need to configurr handle edit
  function handleEditSuccess(event) {
    console.log(event.record);
    const record = event.record;
    const targetFieldValue = record.additionalQuantity.value;

    if (targetFieldValue) {
      // Only do something if targetField has a value (or you can check for changes, etc.)
      alert(`Edit success triggered because ${targetFieldValue} has a value.`);
    } else {
      console.log(
        `Edit success ignored because ${targetFieldValue} not relevant.`
      );
    }

    return event;
  }

  // Register only for create submit success
  kintone.events.on("app.record.create.submit.success", updateProductQuantity);

  // Register a separate function for edit submit success
  kintone.events.on("app.record.edit.submit.success", handleEditSuccess);
})();
