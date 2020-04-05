import { Document } from 'mongoose';
import { User } from '../user/user.model';

export interface OrderInterface extends Document {
  readonly id: string,
  readonly text: string;
  readonly sender: string;
  readonly status: string;
  readonly address: string;
  readonly assigned?: User;
}