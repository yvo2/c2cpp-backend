import { Schema, mongo } from 'mongoose';

export const OrderSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    default: () => new mongo.ObjectId
  },
  text: String,
  sender: String,
  status: String,
  assigned: String
});