// models/ErrorStack.ts
import { Model } from "objection";

interface ErrorStack {
  id: number;
  status: string;
  error: Record<string, any>; // Assuming error details are stored as JSON
  message: string;
  stack?: string | null;
  created_at: Date;
  updated_at: Date;
}

class ErrorStack extends Model {
  static get tableName() {
    return "error_stack";
  }
}

export { ErrorStack };
