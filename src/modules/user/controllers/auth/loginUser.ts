import { fail, success } from "../../../../helpers/request";
import User from "../../../../models/user.model";
import { IReq, IRes } from "../../../../types/config.js";
import Validation from "../../../../utils/validation";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import Email from "../../../../utils/email";

import { IUser } from "types/__models__/user";
import catchAsync from "../../../../utils/catchAsync";
import AppError from "../../../../utils/appError";

const signToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!
  });
};

const createSendToken = (user: IUser, req: Request, res: Response): void => {
  const token: string = signToken(user.id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN)! * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
    secure: req.secure || req.headers["x-forwarded-proto"] === "https"
  });

  // Remove password from output
  user.password = undefined;

  success(res, "Login Successful", { token, user });
};

export const loginUser = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const validator = new Validation();

    validator.validate(req.body).email("email").require("password").end();
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.query().findOne({ email });

    if (!user) {
      return next(new AppError("User does not exist", 401));
    }

    if (!(await user.correctPassword(password))) {
      return next(new AppError("Incorrect password", 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, req, res);
  }
);
