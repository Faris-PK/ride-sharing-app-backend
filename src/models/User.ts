import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../utils/enums';

export interface IUser extends Document {
  name: string,
  email: string;
  password: string;
  role: UserRole;
  phone:string;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
},{timestamps : true});

export default mongoose.model<IUser>('User', userSchema);