import { Request, Response } from 'express';
import { HttpStatus } from '../utils/enums';
import { RideService } from '../services/rideService';

const rideService = new RideService();

export const createRide = async (req: Request, res: Response) => {
  try {
    const { pickup, dropoff } = req.body;
    const passengerId = req.body.user.id; 
    const ride = await rideService.createRide({ pickup, dropoff, passengerId });
    const io = req.app.get("io");
    io.emit("ride:created", ride); // Emit to all connected clients
    res.status(HttpStatus.CREATED).json({ message: 'Ride requested', ride });
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error creating ride', error });
  }
};

export const getMyRides = async (req: Request, res: Response) => {
  try {
    const passengerId = req.body.user.id;
    const rides = await rideService.getMyRides(passengerId);
    res.status(HttpStatus.OK).json(rides);
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error fetching rides', error });
  }
};

export const getRideRoute = async (req: Request, res: Response) => {
  try {
    const { pickup, dropoff } = req.query as { pickup: string; dropoff: string };
    const route = await rideService.getRideRoute(pickup, dropoff);
    res.status(HttpStatus.OK).json(route);
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error fetching route', error });
  }
};

export const getPendingRides = async (req: Request, res: Response) => {
  try {
    const rides = await rideService.getPendingRides();
    res.status(HttpStatus.OK).json(rides);
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error fetching pending rides', error });
  }
};

export const getDriverRides = async (req: Request, res: Response) => {
  try {
    const driverId = req.body.user.id;
    const rides = await rideService.getDriverRides(driverId);
    res.status(HttpStatus.OK).json(rides);
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error fetching driver rides', error });
  }
};

export const acceptRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const driverId = req.body.user.id;
    const ride = await rideService.acceptRide(rideId, driverId);
    const io = req.app.get("io");
    io.emit("ride:accepted", ride); // Emit to all connected clients
    res.status(HttpStatus.OK).json({ message: 'Ride accepted', ride });
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error accepting ride', error });
  }
};

export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    const driverId = req.body.user.id;
    const ride = await rideService.updateRideStatus(rideId, driverId, status);
    const io = req.app.get("io");
    io.emit("ride:status-updated", ride); // Emit to all connected clients
    res.status(HttpStatus.OK).json({ message: 'Ride status updated', ride });
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error updating ride status', error });
  }
};

export const updateDriverLocation = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const { lat, lng } = req.body;
    const driverId = req.body.user.id;
    const ride = await rideService.updateDriverLocation(rideId, driverId, { lat, lng });
    const io = req.app.get("io");
    io.emit("ride:location-updated", { rideId, driverLocation: ride.driverLocation });
    res.status(HttpStatus.OK).json({ message: 'Location updated', ride });
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: 'Error updating location', error });
  }
};