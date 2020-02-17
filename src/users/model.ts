import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  _doc: object; // fix for missing type in mongoose
  email: string;
  password: string;
  refreshToken: string;
  tokenVersion: number;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String, required: false },
  tokenVersion: { type: Number, required: true }
});

// Export the model and return your interface
export default mongoose.model<User>('User', UserSchema);
