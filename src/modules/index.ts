import passport from "passport";
import globalErrorHandler from "../helpers/errorController";
import { AppInstance, IReq, IRes } from "../types/config.js";
import userModule from "./user/index";
import express from "express";

const initModules = (app: AppInstance) => {

  // init express json for other modules
  app.use(express.json({}));
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  // continue with da rest
  userModule.init(app);
  // Initialize Passport
  app.use(passport.initialize());
  app.use(globalErrorHandler);
};

export const closeApp = (app: AppInstance) => {
  // Middleware for Errors
  // app.use(errorMiddleware);
  app.use("*", (req, res: IRes) => {
    res.status(404).json({
      success: false,
      server: "online",
      message: "api endpoint not found"
    });
  });
};

export default initModules;
