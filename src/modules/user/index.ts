import { AppInstance } from "../../types/config.js";
import { logger } from "../../utils/logger";
import userRouter from "./routes/index";
import googleAuthRouter from "./routes/auth";

const userModule = {
  init: (app: AppInstance) => {
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/auth", googleAuthRouter);
    logger.info("[module]: user module loaded");
  }
};

export default userModule;
