import express, { Router } from 'express';
import { createRide, getMyRides, getRideRoute, getPendingRides, acceptRide, getDriverRides, updateRideStatus } from '../controllers/rideController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

router.post('/request', authenticateToken, createRide);
router.get('/my-rides', authenticateToken, getMyRides);
router.get('/route', authenticateToken, getRideRoute);
router.get('/pending', authenticateToken, getPendingRides);
router.get('/driver-rides', authenticateToken, getDriverRides);
router.post('/accept/:rideId', authenticateToken, acceptRide);
router.put('/status/:rideId', authenticateToken, updateRideStatus);


export default router;