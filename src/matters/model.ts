import mongoose, { Schema, Document } from 'mongoose';
import { Client } from '../clients/model';

export interface Matter extends Document {
  _doc: object; // fix for missing type in mongoose
  title: string;
  client: Client;
}

const MatterSchema: Schema = new Schema({
  title: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
});

// Export the model and return your interface
export default mongoose.model<Matter>('Matter', MatterSchema);
