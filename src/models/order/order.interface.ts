import { Document } from 'mongoose';

export interface OrderInterface extends Document {
  id: string,
  text: string;
  sender: string;
  status: string;
  address: string;
  assigned?: string;
  arrival?: string;
}