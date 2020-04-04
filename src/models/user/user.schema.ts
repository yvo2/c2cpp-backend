import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  password: String
});