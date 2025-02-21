import Validator from "@utils/validation";
import crypto from "crypto";
import User from "@models/user.model";
import { fail, success } from "@helpers/request";
import RedisSingleton from "@utils/redis";
import Email from "@utils/email";
import catchAsync from "@utils/catchAsync";
import { IReq, IRes } from "types/config";

export const ACCEPTED_OTP_TYPES = ["registration", "login", "forgot_password", "change_email", "reset_password"];

const sendEmailOtp = catchAsync(async (req: IReq, res: IRes) => {
    const redis = RedisSingleton.getInstance();
    const validator = new Validator();

    // Validate request body
    validator.validate(req.body)
        .require("email")
        .require("type")
        .custom(() => ACCEPTED_OTP_TYPES.includes(req.body?.type), `type must be one of ${ACCEPTED_OTP_TYPES.join(", ")}`)
        .end();

    const { email, type } = req.body;
    const otpKey = `${email}-${type}-otp`;

    // Check if user exists for certain OTP types
    if (type === "registration") {
        const userExists = await User.query().where({ email }).first();
        if (userExists) {
            return fail(res, "User with this email already exists", 400);
        }
    }

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit numeric OTP

    // Store OTP in Redis with a 15-minute expiry
    await redis.set(otpKey, otp, "EX", 15 * 60);

    // Send OTP via email
    await new Email({ email }, { passcode: otp, otpPurpose: type }).sendEmailOtp();

    return success(res, "OTP sent successfully");
});

export default sendEmailOtp;
