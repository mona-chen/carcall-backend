import { Response } from "express";

// Helper function for sending success response
export const success = (
  res: Response,
  message: string,
  data?: any,
  statusCode: number = 200
) => {
  res.status(statusCode).json({ status: "success", data, message });
};

// Helper function for sending failure response
export const fail = (
  res: Response,
  message: string,
  statusCode: number = 400,
  data?: any
) => {
  res.status(statusCode).json({ status: "fail", message, ...data });
};

// Helper function for sending bad request response
export const bad = (
  res: Response,
  message: string = "Bad request",
  statusCode: number = 400
) => {
  fail(res, message, statusCode);
};
