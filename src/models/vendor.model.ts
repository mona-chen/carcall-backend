import User from '@models/user.model';
import { Model } from 'objection';
import Product from './product.model';



class Vendor extends Model {
  static tableName = 'vendors';

  id!: number;
  user_id!: number;
  store_name!: string;
  store_description?: string;
  created_at!: string;
  updated_at!: string;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'vendors.user_id',
        to: 'users.id',
      },
    },
    products: {
      relation: Model.HasManyRelation,
      modelClass: Product,
      join: {
        from: 'vendors.id',
        to: 'products.vendor_id',
      },
    },
  };
}
export default Vendor