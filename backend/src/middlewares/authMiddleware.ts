import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  admin?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.admin = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  } else {
    res.status(401).json({ message: 'Non autorisé, aucun token' });
  }
};
