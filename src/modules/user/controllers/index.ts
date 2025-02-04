import { Application } from "express";
import { registerUser } from "./auth/createUser";
import { loginUser } from "./auth/loginUser";
import {
  deleteMe,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getMe,
  getUser,
  logout,
  resetPassword,
  resizeUserPhoto,
  updateMe,
  updatePassword,
  updateUser,
  uploadUserPhoto
} from "./user";
import { generatePasscode, verifyPasscode } from "./auth/passcodeSignin";

const userController = {
  createUser: registerUser,
  loginUser: loginUser,
  logout: logout as Application,
  forgotPassword: forgotPassword,
  generatePasscode,
  verifyPasscode,
  resetPassword,
  updatePassword,
  getUser,
  getMe: getMe as Application,

  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  deleteMe,
  getAllUsers,
  updateUser,
  deleteUser
};

export default userController;
