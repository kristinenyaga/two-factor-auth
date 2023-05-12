require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const ErrorsMiddleware = require("./middleware/mongooseErrorHandler")
process.on("uncaughtException", (error) => {
  console.log("uncaught except ion stopping the server");
  console.log(error.name, error.message);
  process.exit(1)
})
// Initialize application
const app = express();

// Connect to DB
connectToDB();
//Parse JSON
app.use(express.json());

// Declare PORT
const PORT = process.env.PORT || 3000;

// Mount Routes/create routes
app.get("/", (req, res) => {
  res.json({
    hi: "Welcome to the NodeJS 2FA ",
  });
});

// error middleware
app.use(ErrorsMiddleware)

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode 
on port ${PORT}`)
);

process.on("unhandledRejection", (error) => {
  console.log("unhandled rejection stopping the server")
  console.log(error.name,error.message)
  server.close(() => {
    process.exit(1)
  })
})