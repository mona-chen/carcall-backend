import User from '@models/user.model';
import { Model } from 'objection';


class CallLog extends Model {
  static tableName = 'call_logs';

  id!: number;
  receiver!: number;
  caller!: number;
  call_type!: 'incoming' | 'outgoing' | 'missed';
  status!: string;
  jitsi_room?: string;
  call_start!: string;
  call_end?: string;
  call_recording_url?: string;
  created_at!: string;
  updated_at!: string;

  static relationMappings = {
    receiverUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'call_logs.receiver',
        to: 'users.id',
      },
    },
    callerUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'call_logs.caller',
        to: 'users.id',
      },
    },
  };
}

export default CallLog