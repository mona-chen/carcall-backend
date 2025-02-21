import { fail } from "@helpers/request";
import QrCode from "@models/qrcode.model";
import User from "@models/user.model";
import catchAsync from "@utils/catchAsync";
import Validator from "@utils/validation";
import { IReq, IRes } from "~types/config";

const createQRCode = catchAsync(async (req: IReq, res: IRes) => {
  try {
    const { shipping_address, contact_details, emergency_contact_details, language } = req.body;

    // Validate input
    const validator = new Validator()
      .validate(req.body)
      .require("shipping_address", "Shipping address is required")
      .require("shipping_address.country", { type: "string", minLength: 2, maxLength: 3 })
      .require("shipping_address.street_address", { type: "string", minLength: 3 })
      .require("shipping_address.city", { type: "string", minLength: 2 })
      .require("shipping_address.postal_code", { type: "string", minLength: 3 })
      .require("contact_details", "Contact details are required")
      .phone("contact_details.phone_number")
      .email("contact_details.email")
      .require("emergency_contact_details", "Emergency contact details are required")
      .phone("emergency_contact_details.phone_number")
      .email("emergency_contact_details.email")
      .require("language", { type: "string", minLength: 2, maxLength: 5 })
      .end();

    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.query().findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const qr_data = {
      shipping_address,
      contact_details,
      emergency_contact_details,
      language,
    };

    const qrCode = await QrCode.query().insert({
      user_id: userId,
      qr_data,
      scans_count: 0,
      scan_locations: [],
      style_config: {},
    });

    return res.status(201).json({ message: "QR Code created successfully", qrCode });
  } catch (error:any) {
    if (error.isValidationError) {
      return fail(res, error.message)
    }
    return fail(res, "Internal Server Error", 500)
  }
});

export default createQRCode;
