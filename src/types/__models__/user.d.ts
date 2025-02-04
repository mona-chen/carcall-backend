import { UserShape } from "@/models/user.model";

interface IUser extends UserShape {
  id: number;
  name: string;
  email: string;
  photo: string;
  role: "user" | "manager" | "developer" | "admin";
  password?: string;
  passwordConfirm?: string; // Optional
  passwordChangedAt?: Date | SN;
  passwordResetToken?: string;
  passwordResetExpires?: Date | SN;
  active: boolean;
}
