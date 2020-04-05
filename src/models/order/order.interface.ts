import { Document } from 'mongoose';
import { User } from '../user/user.model';

export interface OrderInterface extends Document {
  id: string,
  text: string;
  sender: string;
  status: string;
  address: string;
  assigned?: string;
}