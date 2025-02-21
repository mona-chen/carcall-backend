import { Model } from 'objection';
import Vendor from './vendor.model';


class Product extends Model {
  static tableName = 'products';

  id!: number;
  vendor_id!: number;
  name!: string;
  description?: string;
  media?: object;
  price!: number;
  stock!: number;
  created_at!: string;
  updated_at!: string;

  static relationMappings = {
    vendor: {
      relation: Model.BelongsToOneRelation,
      modelClass: Vendor,
      join: {
        from: 'products.vendor_id',
        to: 'vendors.id',
      },
    },
  };
}
export default Product