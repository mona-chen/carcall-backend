import { Router } from "express";
import passport from "passport";
import { success } from "../../../helpers/request";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Retrieve the token from the user object
    const token = (req.user as any).token;
    // success(res, "Login successful", { token });
    res.redirect(`${process.env.APP_URL}/google-auth/success?token=${token}`);
  }
);

export default router;
