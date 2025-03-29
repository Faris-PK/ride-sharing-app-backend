import mongoose, { Schema, Document } from 'mongoose';

export interface IRide extends Document {
  passengerId: string;
  driverId?: string;
  pickup: string;
  dropoff: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  driverLocation?: { lat: number; lng: number; timestamp: Date }; 
}

const rideSchema: Schema = new Schema({
  passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  driverLocation: { 
    lat: { type: Number },
    lng: { type: Number },
    timestamp: { type: Date, default: Date.now },
  },
}, { timestamps: true });

export default mongoose.model<IRide>('Ride', rideSchema);