kintone.events.on("app.record.edit.submit", function (event) {
  const record = event.record;
  const table = record.stockHistory;

  if (!table || !Array.isArray(table.value)) {
    console.error("🚫 Table field 'stockHistory' is missing or not an array.");
    return event;
  }

  table.value.forEach((row, index) => {
    const rowData = row.value;

    const transactionType = rowData.transactionType?.value;
    const quantity = Number(rowData.quantity?.value || 0);
    const receivedWithdrewQty = Number(rowData.receivedWithdrewQty?.value || 0);

    console.log({ transactionType, quantity, receivedWithdrewQty });

    if (isNaN(quantity) || isNaN(receivedWithdrewQty)) {
      console.warn(`⚠️ Row ${index + 1} has invalid quantity values.`);
      return;
    }

    if (transactionType === "Received") {
      rowData.quantity.value = quantity + receivedWithdrewQty;
    } else {
      rowData.quantity.value = quantity - receivedWithdrewQty;
    }
  });

  return event;
});
