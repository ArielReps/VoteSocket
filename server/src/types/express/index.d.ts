import { JwtPayload } from 'jsonwebtoken'; // If you are using JwtPayload from jwt.verify

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
      content?: any;
    }
  }
}
