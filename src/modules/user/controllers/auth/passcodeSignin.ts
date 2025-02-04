import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { IReq, IRes } from "../../../../types/config";
import catchAsync from "../../../../utils/catchAsync";
import User from "../../../../models/user.model";
import Email from "../../../../utils/email";
import { success } from "../../../../helpers/request";
import { Util } from "../../../../utils/util";

export const generatePasscode = catchAsync(
  async (req: IReq, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new Error("Email is required"));
    }

    const user = await User.query().findOne({ email });

    if (!user) {
      return next(new Error("No user found with that email"));
    }

    const passcode = crypto.randomBytes(3).toString("hex");
    user.passcode = passcode;
    await user.$query().patch();

    // Send the passcode via email (implement sendEmail utility)
    await new Email(user, { passcode }).sendLoginPasscode();

    success(res, "Passcode sent successfully", {});
  }
);

export const verifyPasscode = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const { email, passcode } = req.body;

    if (!email || !passcode) {
      return next(new Error("Email and passcode are required"));
    }

    const user = await User.query().findOne({ email });

    if (!user || user.passcode !== passcode) {
      return next(new Error("Invalid passcode"));
    }

    // Clear the passcode after successful verification
    user.passcode = null;
    await user.$query().patch();

    // remove password from user object
    user.password = undefined;

    // Generate a token (implement generateToken utility)
    const token = Util.signToken(user.id);

    success(res, "Sign-in successful", { token, user });
  }
);
