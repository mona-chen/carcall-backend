import Validator from "@utils/validation";
import { fail, success } from "@helpers/request";
import catchAsync from "@utils/catchAsync";
import { IReq, IRes } from "types/config";
import RedisSingleton from "@utils/redis";

export const ACCEPTED_OTP_TYPES = ["registration", "login", "forgot_password", "change_email", "reset_password"];

const verifyEmailOtp = catchAsync(async (req: IReq, res: IRes) => {
    const redis = RedisSingleton.getInstance();
    const validator = new Validator();

    // Validate request body
    validator.validate(req.body)
        .require("email")
        .require("type")
        .require("otp")
        .custom(() => ACCEPTED_OTP_TYPES.includes(req.body?.type), `type must be one of ${ACCEPTED_OTP_TYPES.join(", ")}`)
        .end();

    const { email, type, otp } = req.body;
    const otpKey = `${email}-${type}-otp`;

    // Retrieve OTP from Redis
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp) {
        return fail(res, "OTP has expired or is invalid", 400);
    }

    if (storedOtp !== otp) {
        return fail(res, "Invalid OTP", 400);
    }

    return success(res, "OTP is valid");
});

export default verifyEmailOtp;
