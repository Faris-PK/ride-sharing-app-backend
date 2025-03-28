import Ride from '../models/Ride';
import { HttpStatus } from '../utils/enums';
import { Client } from '@googlemaps/google-maps-services-js';

const mapsClient = new Client({});

export class RideService {
  async createRide(data: { pickup: string; dropoff: string; passengerId: string }) {
    const { pickup, dropoff, passengerId } = data;
    const ride = new Ride({
      passengerId,
      pickup,
      dropoff,
      status: 'Pending',
    });
    await ride.save();
    return ride;
  }

  async getMyRides(passengerId: string) {
    const rides = await Ride.find({ passengerId });
    return rides;
  }

  async getRideRoute(pickup: string, dropoff: string) {
    const response = await mapsClient.directions({
      params: {
        origin: pickup,
        destination: dropoff,
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      distance: leg.distance.text,
      duration: leg.duration.text,
      polyline: route.overview_polyline.points,
      start_location: leg.start_location,
      end_location: leg.end_location,
    };
  }

  async getPendingRides() {
    const rides = await Ride.find({ status: 'Pending' }).populate('passengerId', 'name email');
    return rides;
  }

  async getDriverRides(driverId: string) {
    const rides = await Ride.find({ driverId }).populate('passengerId', 'name email');
    return rides;
  }

  async acceptRide(rideId: string, driverId: string) {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new Error('Ride not available');
    }

    ride.driverId = driverId;
    ride.status = 'Accepted';
    await ride.save();
    return ride;
  }

  async updateRideStatus(rideId: string, driverId: string, status: string) {
    const validStatuses = ['Accepted', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const ride = await Ride.findOne({ _id: rideId, driverId });
    if (!ride) {
      throw new Error('Ride not found or not assigned to you');
    }

    ride.status = status as 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
    await ride.save();
    return ride;
  }
}