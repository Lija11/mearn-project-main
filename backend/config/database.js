const mongoose = require("mongoose");
require('dotenv').config({path:"backend/config/config.env"});

const dbURL = process.env.DB_URI || "mongodb://localhost:27017/Ecommers";

mongoose
  .connect(dbURL,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("mongodb atlas is connected");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });