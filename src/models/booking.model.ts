import { Model, RelationMappings } from "objection";
import User from "./user.model";
import Tour from "./tours.model";

export default class Booking extends Model {
  id!: number;
  tour_id!: number;
  user_id!: number;
  price!: number;
  created_at!: Date;
  paid!: boolean;
  payment_method?: string;
  cancelled!: boolean;
  cancelled_at?: Date;
  refund_amount!: number;
  refund_processed_at?: Date;
  payment_status?: "pending" | "paid" | "failed";

  // Add user and tour properties
  user?: User;
  tour?: Tour;

  static get jsonSchema() {
    return {
      type: "object",
      required: ["tour_id", "user_id", "price"],

      properties: {
        id: { type: "integer" },
        tour_id: { type: "integer" },
        user_id: { type: "integer" },
        price: { type: "number" },
        created_at: { type: "string", format: "date-time" },
        paid: { type: "boolean", default: false },
        payment_status: {
          type: "string",
          enum: ["pending", "paid", "failed"],
          default: "pending"
        }
      }
    };
  }

  static get tableName(): string {
    return "bookings";
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "bookings.user_id",
          to: "users.id"
        }
      },
      tour: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tour,
        join: {
          from: "bookings.tour_id",
          to: "tours.id"
        }
      }
    };
  }

  $beforeInsert(): void {
    this.created_at = new Date();
  }

  static async beforeFind(args: any): Promise<void> {
    args.context.withGraphFetched = "[user, tour(selectName)]";
  }

  static get modifiers() {
    return {
      selectName(builder: any) {
        builder.select("name");
      }
    };
  }

  async handlePayment(paymentMethod: string): Promise<void> {
    if (!paymentMethod) {
      throw new Error("Payment method is required.");
    }

    this.payment_method = paymentMethod;
    this.paid = true;
    this.payment_status = "paid";

    try {
      await this.$query().patch({
        payment_method: paymentMethod,
        paid: true,
        payment_status: "paid"
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Could not update payment status.");
    }
  }

  async cancelBooking(): Promise<void> {
    if (!this.cancelled) {
      this.cancelled = true;
      this.cancelled_at = new Date();
      await this.$query().patch({ cancelled: true, cancelled_at: new Date() });
    }
  }

  async processRefund(amount: number): Promise<void> {
    if (this.paid && !this.cancelled && amount > 0) {
      this.refund_amount = amount;
      this.refund_processed_at = new Date();
      await this.$query().patch({
        refund_amount: amount,
        refund_processed_at: new Date()
      });
    }
  }
}
