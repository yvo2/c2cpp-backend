import { Document } from 'mongoose';

export interface UserInterface extends Document {
  readonly id: string,
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
}