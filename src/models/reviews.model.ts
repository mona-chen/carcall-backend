import { Model, RelationMappings } from "objection";
import User from "./user.model";
import Tour from "./tours.model";

interface Review {
  id: number;
  review: string;
  rating: number;
  created_at: string;
  tour: number;
  user: number;
}

class Review extends Model {
  static get tableName(): string {
    return "reviews";
  }

  static get jsonSchema(): Record<string, unknown> {
    return {
      type: "object",
      required: ["review", "rating", "tour", "user"],
      properties: {
        id: { type: "integer" },
        review: { type: "string" },
        rating: { type: "number", minimum: 1, maximum: 5 },
        created_at: { type: "string", format: "date-time" },
        tour: { type: "integer" },
        user: { type: "integer" }
      }
    };
  }

  // Define $parseDatabaseJson method to specify custom column names
  $parseDatabaseJson(json: any) {
    json = super.$parseDatabaseJson(json);
    // Rename the 'user' column to 'userId'
    json.userId = json.user;
    json.tourId = json.tour;
    delete json.user;
    delete json.tour;
    return json;
  }

  static get relationMappings(): RelationMappings {
    return {
      tourId: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tour,
        filter: (query) => query.select("id", "name", "imageCover"),
        join: {
          from: "reviews.tourId",
          to: "tours.id"
        }
      },
      userId: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        filter: (query) => query.select("id", "email", "name", "photo"),
        join: {
          from: "reviews.userId",
          to: "users.id"
        }
      }
    };
  }
}

export default Review;
