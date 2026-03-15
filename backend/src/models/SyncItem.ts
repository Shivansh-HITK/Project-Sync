import mongoose, { Schema, Document } from 'mongoose';

export interface ISyncItem extends Document {
  userId: mongoose.Types.ObjectId;
  sourceDeviceId: mongoose.Types.ObjectId;
  type: 'clipboard' | 'file' | 'screenshot' | 'folder';
  content?: string; // Text content for clipboard, or file name/path/URL
  metadata?: any;   // File size, MIME type, etc.
  status: 'pending' | 'delivered' | 'failed';
  createdAt: Date;
}

const SyncItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sourceDeviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
  type: { type: String, enum: ['clipboard', 'file', 'screenshot', 'folder'], required: true },
  content: { type: String },
  metadata: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISyncItem>('SyncItem', SyncItemSchema);
