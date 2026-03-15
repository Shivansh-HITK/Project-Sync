import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceName: string;
  deviceType: 'mobile' | 'desktop';
  pushToken?: string;
  socketId?: string;
  isPaired: boolean;
  lastSeen: Date;
}

const DeviceSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deviceName: { type: String, required: true },
  deviceType: { type: String, enum: ['mobile', 'desktop'], required: true },
  pushToken: { type: String },
  socketId: { type: String },
  isPaired: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
});

export default mongoose.model<IDevice>('Device', DeviceSchema);
