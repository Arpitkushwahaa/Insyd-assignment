import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
  body: any;
  params: any;
  query: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip authentication - but use a real user ID for audit logs
    // Get or create a system user
    let systemUser = await User.findOne({ email: 'system@insyd.com' });
    
    if (!systemUser) {
      // Create system user if not exists
      systemUser = await User.create({
        name: 'System User',
        email: 'system@insyd.com',
        password: 'system', // Won't be used
        role: 'admin',
      });
    }
    
    req.user = {
      id: systemUser._id.toString(),
      email: systemUser.email,
      role: systemUser.role,
      name: systemUser.name,
    };
    next();
  } catch (error) {
    // Fallback to basic user info if database fails
    req.user = {
      id: '000000000000000000000000', // Valid ObjectId format
      email: 'system@insyd.com',
      role: 'admin',
      name: 'System User',
    };
    next();
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
