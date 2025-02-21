import { Application, Router } from "express";
import userController from "../controllers";
import { protect, restrictTo } from "../../../guard/restrictTo";
// import userController from "../controllers/index";

const userRouter = Router();
const authRouter = Router();

authRouter.post("/register", userController.createUser);
authRouter.post("/login", userController.loginUser);

authRouter.get("/logout", userController.logout);

authRouter.post("/forgotPassword", userController.forgotPassword);
authRouter.post("/send-email-otp", userController.sendEmailOtp);
authRouter.post("/verify-email-otp", userController.sendEmailOtp);
authRouter.patch("/resetPassword/:token", userController.resetPassword); 

// passcode signin
authRouter.post("/passcode/generate", userController.generatePasscode);
authRouter.post("/passcode/verify", userController.verifyPasscode);

// Protect all routes after this middleware
userRouter.use(protect);

userRouter.patch("/updateMyPassword", userController.updatePassword);
userRouter.get("/me", userController.getMe, userController.getUser);

userRouter.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

userRouter.delete("/deleteMe", userController.deleteMe);

// restrict all route after this middleware to admin
userRouter.use(restrictTo("admin"));

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export  {userRouter, authRouter};
