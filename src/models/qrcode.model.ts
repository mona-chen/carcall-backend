import User from '@models/user.model';
import { Model } from 'objection';



class QrCode extends Model {
  static tableName = 'qr_codes';

  id!: number;
  user_id!: number;
  qr_data!: object;
  scans_count!: number;
  scan_locations?: object;
  style_config?: object;
  created_at!: string;
  updated_at!: string;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'qr_codes.user_id',
        to: 'users.id',
      },
    },
  };
}
export default QrCode