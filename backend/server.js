const express = require("express");
const cors = require("cors");
const applicationRoutes = require("./src/routes/applicationRoutes");
const { connectDB } = require("./src/config/db");
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("API çalışıyor ");
});

app.listen(5000, () => {
  console.log("Server çalışıyor");
});