import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { HttpStatus } from '../utils/enums';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
         res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Access token required' });
    }

    try {
        const decoded = verifyAccessToken(accessToken) as unknown as { id: string; email: string };
        req.body.user = decoded;
        next();
    } catch (error) {
         res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};