import { Schema, mongo } from 'mongoose';

export const UserSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    default: () => new mongo.ObjectId
  },
  email: String,
  firstName: String,
  lastName: String,
  password: String
});