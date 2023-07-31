const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const forgeRoutes = require("./routes/forge-auth");
const modelRoutes = require("./routes/models.js");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use(authRoutes);

app.use("/events", eventRoutes);

app.use("/forge", forgeRoutes);

app.use("/model", modelRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

app.listen(8080, () => {
  console.log(`Server running on port: 8080`);
});
