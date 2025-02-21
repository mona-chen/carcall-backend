import { Model } from 'objection';


class SipUser extends Model {
  static tableName = 'sip_users';

  id!: number;
  sip_username!: string;
  sip_password!: string;
  contact_number?: string;
  status!: string;
  created_at!: string;
  updated_at!: string;
}
export default SipUser