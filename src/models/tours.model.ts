import { Model, RelationMappings } from "objection";
import Review from "./reviews.model";

interface Tour {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  created_at: string;
  startDates?: string[];
  secretTour: boolean;
  startLocation?: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
  };
  locations?: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
    day: number;
  }[];
  guides?: number[];
  reviews?: Review[];
}

class Tour extends Model {
  static get tableName(): string {
    return "tours";
  }

  static get jsonSchema(): Record<string, unknown> {
    return {
      type: "object",
      required: [
        "name",
        // "duration",
        // "maxGroupSize",
        // "difficulty",
        "price"
        // "summary"
        // "imageCover"
      ],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 10, maxLength: 40 },
        duration: { type: "number" },
        maxGroupSize: { type: "integer" },
        difficulty: { type: "string", enum: ["easy", "medium", "difficult"] },
        ratingsAverage: { type: "number", minimum: 1, maximum: 5 },
        ratingsQuantity: { type: "integer" },
        price: { type: "number" },
        priceDiscount: { type: "number" },
        summary: { type: "string" },
        description: { type: "string" },
        imageCover: { type: "string" },
        images: { type: "array", items: { type: "string" } },
        created_at: { type: "string", format: "date-time" },
        startDates: {
          type: "array",
          items: { type: "string", format: "date-time" }
        },
        secretTour: { type: "boolean" },
        startLocation: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["Point"] },
            coordinates: { type: "array", items: { type: "number" } },
            address: { type: "string" },
            description: { type: "string" }
          }
        },
        locations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["Point"] },
              coordinates: { type: "array", items: { type: "number" } },
              address: { type: "string" },
              description: { type: "string" },
              day: { type: "integer" }
            }
          }
        },
        guides: {
          type: "array",
          items: { type: "integer" }
        },
        highlights: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" }
            },
            required: ["title", "content"]
          }
        },
        what_included: {
          type: "array",
          items: { type: "string" }
        },
        what_not_included: {
          type: "array",
          items: { type: "string" }
        }
      }
    };
  }

  $beforeInsert() {
    if (!this.difficulty) {
      this.difficulty = "easy";
    }
  }
  static get relationMappings(): RelationMappings {
    return {
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: "tours.id",
          to: "reviews.tour"
        }
      }
    };
  }
}

export default Tour;
