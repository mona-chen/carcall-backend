import { AppInstance } from "../../types/config.js";
import { logger } from "../../utils/logger";
import qrRouter from "./routes/index.js";

const qrModule = {
  init: (app: AppInstance) => {
    app.use("/api/v1/qr", qrRouter);
    logger.info("[module]: QR module loaded");
  }
};

export default qrModule;
