import Knex from "knex";
import bcrypt from "bcryptjs";
import { Model, ModelObject } from "objection";
import { IUser } from "types/__models__/user";
import crypto from "crypto";
class User extends Model implements IUser {
  id!: number;
  name!: string;
  email!: string;
  photo!: string;
  role!: "user" | "manager" | "developer" | "admin";
  password?: string | undefined;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: Date | undefined;
  passwordResetToken?: string | undefined;
  passwordResetExpires?: Date | string | number | undefined;
  active!: boolean;
  passcode?: string | number | null;
  google_id?: string;

  static get tableName(): string {
    return "users";
  }

  static get jsonSchema(): any {
    return {
      type: "object",
      required: ["name", "email"],

      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        email: { type: "string", format: "email" },
        photo: { type: "string", default: "default.jpg" },
        role: {
          type: "string",
          enum: ["user", "guide", "lead-guide", "admin"],
          default: "user"
        },
        password: { type: "string", minLength: 8 },
        // passwordConfirm: { type: "string" },
        // passwordChangedAt: { type: "date-time" },
        passwordResetToken: { type: "string" },
        // passwordResetExpires: { type: "date-time" },
        active: { type: "boolean", default: false },
        google_id: { type: "string" }
      },
      anyOf: [{ required: ["password"] }, { required: ["google_id"] }]
    };
  }

  static get modifiers() {
    return {
      selectBasicInfo(builder: any) {
        builder.select("id", "name", "email", "photo", "active");
      }
    };
  }

  async $beforeInsert(queryContext?: any) {
    await super.$beforeInsert(queryContext);
    await this._hashPassword();
  }

  async $beforeUpdate(opt?: any, queryContext?: any) {
    await super.$beforeUpdate(opt, queryContext);
    if (
      this.password &&
      this.passwordConfirm &&
      this.password !== this.passwordConfirm
    ) {
      throw new Error("Passwords do not match");
    } else {
      this.passwordChangedAt = new Date();
      await this._hashPassword();
      delete this.passwordConfirm;
    }
  }

  private async _hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async correctPassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, String(this.password));
  }

  changedPasswordAfter(JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        String(new Date(this.passwordChangedAt)?.getTime() / 1000),
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  }

  async createPasswordResetToken(): Promise<string> {
    // Generate a random 6-digit code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Set the generated 6-digit code as the password reset token
    this.passwordResetToken = resetToken;

    // Set the expiration time for the token (10 minutes from now)
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
  }
}

export default User;
