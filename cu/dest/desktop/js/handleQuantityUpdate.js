(function () {
  "use strict";

  // Function to handle quantity updates for both App 31 and App 32
  function handleQuantityUpdate(event, operation) {
    const savedRecord = event.record;
    const newProductId = savedRecord.additionalProductID.value;
    const newQuantity = Number(savedRecord.additionalQuantity.value); // Ensure it's a number

    const appId = operation === "add" ? 30 : 31; // App 30 for addition, App 31 for subtraction
    const query = `productID = "${newProductId}"`;

    const params = {
      app: appId,
      query: query,
    };

    kintone
      .api(kintone.api.url("/k/v1/records", true), "GET", params)
      .then(function (resp) {
        const matchingRecords = resp.records;

        if (matchingRecords.length === 0) {
          alert(
            `No records found in App ${appId} for productId "${newProductId}".`
          );
          return;
        }

        const targetRecord = matchingRecords[0];
        const recordId = Number(targetRecord.$id.value);
        const currentQuantity = Number(targetRecord.productQuantity.value);
        const productName = targetRecord.productName.value;
        let updatedQuantity;

        // Apply the operation (addition or subtraction)
        if (operation === "add") {
          alert("add");
          updatedQuantity = currentQuantity + newQuantity; // Adding quantity
        } else if (operation === "subtract") {
          alert("subtract");
          updatedQuantity = currentQuantity - newQuantity; // Subtracting quantity
        }

        alert(`${productName} stocks: ${updatedQuantity}pcs`);

        const updateParams = {
          app: appId,
          id: recordId,
          record: {
            productQuantity: {
              value: updatedQuantity,
            },
          },
        };

        return kintone.api(
          kintone.api.url("/k/v1/record", true),
          "PUT",
          updateParams
        );
      })
      .then(function (updateResp) {
        if (updateResp) {
          const successMessage =
            operation === "add"
              ? `App ${appId} quantity updated successfully!`
              : `App ${appId} quantity deducted successfully!`;
          alert(successMessage);
        }
      })
      .catch(function (error) {
        alert("Error:\n" + JSON.stringify(error, null, 2));
      });
  }

  // Expose the function globally to make it accessible from the event handler
  window.handleQuantityUpdate = handleQuantityUpdate;
})();
