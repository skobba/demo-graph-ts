import { User } from '../users/model';
declare global {
  namespace Express {
    interface Request {
      jwtpayload: JwtDecoded;
    }
  }

  export interface JwtDecoded {
    userId: string;
    //user: User;
    iat: string;
    exp: string;
  }
}

/* If your module exports nothing, you'll need this line. Otherwise, delete it */
export {};
