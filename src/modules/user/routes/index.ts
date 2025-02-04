import { Application, Router } from "express";
import userController from "../controllers";
import { protect, restrictTo } from "../../../guard/restrictTo";
// import userController from "../controllers/index";

const userRouter = Router();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);

userRouter.get("/logout", userController.logout);

userRouter.post("/forgotPassword", userController.forgotPassword);
userRouter.patch("/resetPassword/:token", userController.resetPassword);

// passcode signin
userRouter.post("/passcode/generate", userController.generatePasscode);
userRouter.post("/passcode/verify", userController.verifyPasscode);

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

export default userRouter;
