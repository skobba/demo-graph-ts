import mongoose, { Schema, Document } from 'mongoose';
import { Matter } from '../matters/model';

export interface Client extends Document {
  _doc: object; // fix for missing type in mongoose
  email: string;
  firstName: string;
  lastName: string;
  matters: [Matter];
}

const ClientSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  matters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matter' }]
});

// Export the model and return your interface
export default mongoose.model<Client>('Client', ClientSchema);
