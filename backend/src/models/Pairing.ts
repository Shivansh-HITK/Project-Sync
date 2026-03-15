import mongoose, { Schema, Document } from 'mongoose';

export interface IPairing extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  desktopDeviceId: mongoose.Types.ObjectId;
  status: 'pending' | 'completed' | 'expired';
  createdAt: Date;
}

const PairingSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  desktopDeviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
  status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Token expires in 5 minutes
});

export default mongoose.model<IPairing>('Pairing', PairingSchema);
