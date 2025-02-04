import { fail, success } from "../../../../helpers/request";
import User from "../../../../models/user.model";
import { IReq, IRes } from "../../../../types/config.js";
import Validation from "../../../../utils/validation";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import Email from "../../../../utils/email";

import { IUser } from "types/__models__/user";
import catchAsync from "../../../../utils/catchAsync";
import { transaction } from "objection";
import AppError from "../../../../utils/appError";

const signToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!
  });
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response
): void => {
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

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

const registerUser = catchAsync(async (req: IReq, res: IRes) => {
  await transaction(User.knex(), async (trx) => {
    const validator = new Validation();

    validator
      .validate(req.body)
      .require("name")
      .email("email")
      .require("password")
      .password("password")
      .password("confirmPassword")
      .end();

    const { name, email, password, confirmPassword } = req.body;

    // Check if the passwords match
    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    // Check if the email is already registered
    const existingUser = await User.query(trx).findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Create a new user
    const newUser = await User.query(trx).insert({
      name,
      email,
      password
    });

    // Remove password from output
    newUser.password = undefined;

    // Send welcome email
    const url = `${req.protocol}://${req.get("host")}/me`;
    await new Email(newUser, { url }).sendWelcome();

    // Optionally, you can generate a JWT token and send it back as a response
    createSendToken(newUser, 201, req, res);
  });
});

export { registerUser };
