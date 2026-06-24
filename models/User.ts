import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name:      string;
  email:     string;
  password?: string;
  image?:    string;
  provider?: 'google' | 'credentials';
}

const UserSchema = new Schema<IUser>({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: String,
  image:    String,
  provider: { type: String, default: 'credentials' },
}, { timestamps: true });

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);