import { NextFunction } from "express";
import catchAsync from "./catchAsync";
import AppError from "./appError";
import crypto from "crypto";
import User from "models/user.model";
import { IReq } from "types/config";
import jwt from "jsonwebtoken";
import { success } from "helpers/request";

export class Util {
  public static signToken = (id: number): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN!
    });
  };

  public static formatDateTime(date: Date | string) {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date";
    }

    const options: any = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    };

    return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
  }

  public static parseJSON(json: string) {
    // This function cannot be optimised, it's best to
    // keep it small!
    var parsed;

    try {
      parsed = JSON.parse(json);
    } catch (e) {
      // Oh well, but whatever...
      console.log(e);
    }

    return parsed; // Could be undefined!
  }
}
