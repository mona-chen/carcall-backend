import express from "express";
import initModules, { closeApp } from "./src/modules/index";
import { logger } from "./src/utils/logger";
import { Env, IReq, ServerInstance } from "./src/types/config";
import initDb, { dbLogger } from "./src/db/config.db";
import dotenv from "dotenv";
import morgan from "morgan";
import isPostGISInstalled from "./src/db/checkPostGis";
import cors from "cors";
import "./src/middleware/passport";
import path from "path";
dotenv.config();

export const app = express();

const env: Env = process?.env;
app.use(
  cors({
    origin: "*"
  })
);

if (env.APP_ENV === "development") {
  logger.warn(
    `[core]: App is running on ${env.APP_ENV} environment don't use this in production`
  );
}

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("trust proxy", true);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Connecting to DB
let server: ServerInstance;
const connectToDatabase = function () {
  logger.info("[database]: connecting to Postgres...");
  initDb((err: Error | null, result?: any) => {
    if (err) {
      // Health Route
      app.route("/v1/health").get(function (req, res) {
        res.status(200).json({
          success: true,
          server: "offline",
          message: "server is down due to database connection error"
        });
      });

      app.use("*", (req, res) => {
        res.status(500).json({
          success: false,
          server: "offline",
          message: "[server] offline due to database error"
        });
      });

      logger.critical(`[database]: could not connect due to [${err.message}]`);
      server = app.listen(env.APP_PORT, () => {
        logger.info(`[core] Server is running on port ${env.APP_PORT}`);
      });

      setTimeout(() => {
        server.close();

        connectToDatabase();
      }, 10000);
      return;
    } else {
      dbLogger.info(`[database]: connected successfully to Postgres`);

      // Init Modules
      initModules(app);

      // Check if postgis is enabled
      isPostGISInstalled();

      // Health Route
      app.route("/api/v1/health").get(function (req, res) {
        res.status(200).json({
          success: true,
          server: "online",
          message: "server is up and running"
        });
      });

      // Error Handler
      closeApp(app);
      server = app.listen(env.APP_PORT, () => {
        console.log(`[server] running on port: ${env.APP_PORT}`);
      });
      // Init Web Socket
      // initWebSocket(server);

      // Handling Uncaught Exception
      process.on("uncaughtException", (err: Error) => {
        console.log(`Error: ${err.message}`);
        console.log(`[server] shutting down due to Uncaught Exception`);

        server.close(() => {});

        process.exit(1);
      });

      // Unhandled Promise Rejection
      process.on("unhandledRejection", (err: Error) => {
        console.log(`Error: ${err.message}`);
        console.log(
          `[server] shutting down due to Unhandled Promise Rejection`
        );

        server.close(() => {
          process.exit(1);
        });
      });
    }
  })();
};

const sigIntHandler = async () => {
  logger.warn("Received SIGTERM signal. Shutting down gracefully...");
  // Close the server
  await server.close();
  // Perform any other cleanup tasks
  logger.info("Server gracefully shut down.");
  // Terminate the process
  process.exit();
};

// Handle SIGTERM signal for graceful shutdown
process.on("SIGINT", sigIntHandler);

// Handle unhandled promise rejections
process.on("unhandledrejection", (event) => {
  logger.error("Unhandled Promise Rejection:");
  logger.error(event);
});
// Handle uncaught exceptions
process.on("uncaughtexception", (event) => {
  logger.error("Uncaught Exception:");
  logger.error(event);
});

// Starting Server
(async () => {
  if (process.env.SERVER_MAINTENANCE === "true") {
    // Health Route
    app.route("api//v1/health").get(function (req, res) {
      return res.status(200).json({
        success: false,
        server: "maintenance",
        message: "Server is under maintenance"
      });
    });

    app.use("*", (req, res, next) => {
      res.status(503).json({
        success: false,
        server: "maintenance",
        message: "[server] offline for maintenance"
      });
    });

    server = app.listen(env.APP_PORT, () => {
      logger.info(`[server] running on port: ${env.APP_PORT}`);
    });
    server.timeout = 600000;
  } else {
    connectToDatabase();
  }
})();
