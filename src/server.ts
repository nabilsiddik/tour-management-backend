import { Server } from "http";
let server: Server;
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
dotenv.config();
const port = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("Mongodb connected");

    server = app.listen(port, () => {
      console.log(`Tour Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Error while connecting database server");
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

// Unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected. Server shutting down ...", err);

  if (server) {
    server.close(() => {
      process.exit();
    });
  }
  process.exit();
});

// Uncaught exception error
process.on("uncaughtException", (err) => {
  console.log("uncaught Exception detected. Server shutting down ...", err);

  if (server) {
    server.close(() => {
      process.exit();
    });
  }
  process.exit();
});

// Signal termination error
process.on("SIGTERM", (err) => {
  console.log("Sigterm signal received... Server shutting down ...", err);

  if (server) {
    server.close(() => {
      process.exit();
    });
  }
  process.exit();
});

process.on("SIGINT", (err) => {
  console.log("SIGINT signal received... Server shutting down ...", err);

  if (server) {
    server.close(() => {
      process.exit();
    });
  }
  process.exit();
});

// Promise.reject(new Error("I forgot to catch this promise"))
// throw new Error('I forgot to handle this local error')
