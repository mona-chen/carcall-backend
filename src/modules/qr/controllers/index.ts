import { factory } from "@helpers/handlerFactory";
import { fail, success } from "@helpers/request";
import QrCode from "@models/qrcode.model";
import User from "@models/user.model";
import { Request, Response } from "express";
import { IReq } from "types/config";
import createQRCode from "./createQr";

class QRCodeController {

  // Get QR Codes by User
  static  getUserQRCodes = factory.getAll(QrCode, {
    $before(query, req) {
      return query.where({user_id: req.user?.id});
    },
  })

  static createQr = createQRCode

  // Update QR Code Style
  static async updateQRCodeStyle(req: Request, res: Response) {
    try {
      const { qrId } = req.params;
      const { styleConfig } = req.body;

      // Validate styleConfig
      if (!styleConfig || typeof styleConfig !== 'object') {
        return res.status(400).json({ message: "Invalid style configuration" });
      }

      const qrCode = await QrCode.query().findById(qrId);
      if (!qrCode) {
        return res.status(404).json({ message: "QR Code not found" });
      }

      await QrCode.query().patchAndFetchById(qrId, { style_config: styleConfig });
      return success(res, "QR Code Style Updated successfully")
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as any).message });
    }
  }

  // Track QR Code Scan
  static async trackScan(req: Request, res: Response) {
    try {
      const { qrId } = req.params;
      const { location } = req.body;
      
      const qrCode = await QrCode.query().findById(qrId);
      if (!qrCode) {
        return res.status(404).json({ message: "QR Code not found" });
      }

      await QrCode.query().patchAndFetchById(qrId, {
        scans_count: qrCode.scans_count + 1,
        scan_locations: Array.isArray(qrCode.scan_locations) ? [...qrCode.scan_locations, location] : [location],
      });
      
      return res.status(200).json({ message: "QR scan tracked successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as any).message });
    }
  }

  // Delete QR Code
  static async deleteQRCode(req: Request, res: Response) {
    try {
      const { qrId } = req.params;
      const qrCode = await QrCode.query().findById(qrId);
      if (!qrCode) {
        return fail(res, "QR Code not found");
      }
      await QrCode.query().deleteById(qrId);
      return success(res, "QR Code deleted successfully")
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as any).message });
    }
  }
}


export default QRCodeController;