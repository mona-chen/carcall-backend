import User from '@models/user.model';
import { Model } from 'objection';
import Vendor from './vendor.model';



class Order extends Model {
  static tableName = 'orders';

  id!: number;
  user_id!: number;
  vendor_id!: number;
  status!: string;
  total!: number;
  created_at!: string;
  updated_at!: string;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'orders.user_id',
        to: 'users.id',
      },
    },
    vendor: {
      relation: Model.BelongsToOneRelation,
      modelClass: Vendor,
      join: {
        from: 'orders.vendor_id',
        to: 'vendors.id',
      },
    },
  };
}
export default Order