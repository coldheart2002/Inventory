const express = require("express");
const cors = require("cors");
const kintoneRoutes = require("./routes/kintone");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/kintone", kintoneRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
