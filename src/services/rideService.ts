import { RideRepository } from '../repositories/rideRepository';
import { Client } from '@googlemaps/google-maps-services-js';

const mapsClient = new Client({});

export class RideService {
  private rideRepo = new RideRepository();

  async createRide(data: { pickup: string; dropoff: string; passengerId: string }) {
    const { pickup, dropoff, passengerId } = data;
   
    
    const ride = await this.rideRepo.createRide({
      passengerId,
      pickup,
      dropoff,
      status: 'Pending',
    });
    return ride;
  }

  async getMyRides(passengerId: string) {
    return this.rideRepo.findByPassengerId(passengerId);
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
    return this.rideRepo.findPending();
  }

  async getDriverRides(driverId: string) {
    return this.rideRepo.findByDriverId(driverId);
  }

  async acceptRide(rideId: string, driverId: string) {
    const ride = await this.rideRepo.findById(rideId);
    if (!ride || ride.status !== 'Pending') {
      throw new Error('Ride not available');
    }

    ride.driverId = driverId;
    ride.status = 'Accepted';
    await this.rideRepo.save(ride);
    return ride;
  }

  async updateRideStatus(rideId: string, driverId: string, status: string) {
    const validStatuses = ['Accepted', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const ride = await this.rideRepo.findByIdAndDriver(rideId, driverId);
    if (!ride) {
      throw new Error('Ride not found or not assigned to you');
    }

    ride.status = status as 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
    await this.rideRepo.save(ride);
    return ride;
  }

  async updateDriverLocation(rideId: string, driverId: string, location: { lat: number; lng: number }) {
    const ride = await this.rideRepo.findByIdAndDriver(rideId, driverId);
    if (!ride) {
      throw new Error('Ride not found or not assigned to you');
    }
    ride.driverLocation = { lat: location.lat, lng: location.lng, timestamp: new Date() };
    return this.rideRepo.save(ride);
  }
}