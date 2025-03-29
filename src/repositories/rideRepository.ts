import Ride, { IRide } from "../models/Ride";

export class RideRepository {
  async createRide(data: {
    passengerId: string;
    pickup: string;
    dropoff: string;
    status: string;
  }): Promise<IRide> {
    return Ride.create(data);
  }

  async findByPassengerId(passengerId: string): Promise<IRide[]> {
    return Ride.find({ passengerId }).populate('passengerId', 'name email');
  }

  async findPending(): Promise<IRide[]> {
    return Ride.find({ status: 'Pending' }).populate('passengerId', 'name email');
  }

  async findByDriverId(driverId: string): Promise<IRide[]> {
    return Ride.find({ driverId }).populate('passengerId', 'name email');
  }

  async findById(rideId: string): Promise<IRide | null> {
    return Ride.findById(rideId);
  }

  async findByIdAndDriver(rideId: string, driverId: string): Promise<IRide | null> {
    return Ride.findOne({ _id: rideId, driverId });
  }

  async save(ride: IRide): Promise<IRide> {
    return ride.save();
  }
}