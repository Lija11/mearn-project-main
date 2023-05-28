const app = require("./app");
require("dotenv").config({ path: "backend/config/config.env" });

const PORT = process.env.PORT || 5000;

// Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Uncaught Exception`);
//   process.exit(1);
// });

// Unhandled Promise Rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Unhandled Promise Rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });
app.listen(PORT, () => {
  console.log(`server is working on http://localhost:${PORT}`);
});
