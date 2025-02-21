import { Model } from 'objection';

class Plan extends Model {
  static tableName = 'plans';

  id!: number;
  name!: string;
  description?: string;
  unlimited_qr!: boolean;
  call_tracking!: boolean;
  price!: number;
  created_at!: string;
  updated_at!: string;
}

export default Plan