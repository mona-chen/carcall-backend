import { Model } from "objection";
import User from "./user.model";
import Tour from "./tours.model";

class Wishlist extends Model {
  static tableName = "wishlist";

  id!: number;
  user_id!: number;
  tour_id!: number;
  created_at!: Date;
  updated_at!: Date;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "wishlist.user_id",
        to: "users.id"
      }
    },
    tour: {
      relation: Model.BelongsToOneRelation,
      modelClass: Tour,
      join: {
        from: "wishlist.tour_id",
        to: "tours.id"
      }
    }
  };
}

export default Wishlist;
