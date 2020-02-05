declare global {
  namespace Express {
    interface Request {
      jwtpayload: JwtDecoded;
    }
  }

  export interface JwtDecoded {
    userId: string;
    iat: string;
    exp: string;
  }
}

/* If your module exports nothing, you'll need this line. Otherwise, delete it */
export {};
