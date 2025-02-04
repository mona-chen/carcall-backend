import { NextFunction, RequestHandler } from "express";
import multer, { Multer, StorageEngine } from "multer";
import sharp from "sharp";
import AppError from "../../../utils/appError";
import catchAsync from "../../../utils/catchAsync";
import * as factory from "../../../helpers/handlerFactory";
import User from "../../../models/user.model";
import { IReq, IRes } from "types/config";
import { createSendToken } from "./auth/createUser";
import Email from "../../../utils/email";
import * as crypto from "crypto"; // Import the crypto module
import jwt from "jsonwebtoken";
import { success } from "../../../helpers/request";

// Define type for Multer filter function
export type MulterFilterFunction = (
  req: IReq,
  file: Express.Multer.File,
  cb: any
) => void;

interface DecodedToken {
  id: string;
  iat: number;
}
// Storage settings for multer
const multerStorage: StorageEngine = multer.memoryStorage();

// Filter function for multer
const multerFilter: MulterFilterFunction = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Middleware to upload user photo
export const uploadUserPhoto: RequestHandler = upload.single("photo");

// Middleware to resize user photo
export const resizeUserPhoto = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  }
);

// Middleware to get user's own data
export const getMe = (req: IReq, res: IRes, next: NextFunction) => {
  req.params.id = String(req.user.id);
  next();
};

// Middleware to update user's own data
export const updateMe = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    // Prevent password updates
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // Filter out unwanted fields
    const filteredBody = {
      name: req.body.name,
      email: req.body.email,
      photo: req?.file?.filename
    };

    // Update user document
    const updatedUser = await User.query()
      .findById(req.user.id)
      .patch(filteredBody);

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      }
    });
  }
);

// Middleware to deactivate user
export const deleteMe = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    await User.query().findById(req.user.id).patch({ active: false });

    res.status(204).json({
      status: "success",
      data: null
    });
  }
);

// Handler for creating a user (not implemented)
export const createUser = (req: IReq, res: IRes) => {
  res.status(500).json({
    status: "error",
    message:
      "This route is not yet defined! 😒 Please use user/register instead"
  });
};

export const forgotPassword = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const user = await User.query().findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    const resetToken = await user.createPasswordResetToken();
    user!.passwordResetToken = resetToken;
    user!.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.$query().patch();

    try {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetToken}`;
      await new Email(user, { url: resetToken }).sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Token sent to email!"
      });
    } catch (err) {
      await user.$query().patch({
        passwordResetToken: undefined,
        passwordResetExpires: undefined
      });
      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    // const hashedToken = crypto
    //   .createHash("sha256")
    //   .update(req.params.token)
    //   .digest("hex");

    const user = await User.query()
      .findOne({ passwordResetToken: req.params.token })
      .where("passwordResetExpires", ">", Date.now());

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.$query().patch();

    createSendToken(user, 200, req, res);
  }
);

export const updatePassword = catchAsync(
  async (req: IReq, res: IRes, next: NextFunction) => {
    const user = await User.query().findById(req.user.id);

    if (!(await user?.correctPassword(req.body.passwordCurrent))) {
      return next(new AppError("Your current password is wrong.", 401));
    }

    user!.password = req.body.password;
    user!.passwordConfirm = req.body.passwordConfirm;
    await user!.$query().patch();

    createSendToken(user as User, 200, req, res);
  }
);

export const logout = (req: IReq, res: IRes): any => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  success(res, "Logged out succesfully");
};

export const isLoggedIn = async (
  req: IReq,
  res: IRes,
  next: NextFunction
): Promise<void> => {
  if (req.cookies.jwt) {
    try {
      const decoded = jwt.verify(
        req.cookies.jwt,
        process.env.JWT_SECRET!
      ) as DecodedToken;
      const currentUser = await User.query().findById(decoded.id);

      if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// Factory handlers for users
export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);

// Do NOT update passwords with these handlers!
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
