import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  admin?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Priorité au cookie httpOnly, fallback sur Authorization header
  const token = req.cookies?.adminToken ||
    (req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, aucun token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Non autorisé, token invalide' });
  }
};
