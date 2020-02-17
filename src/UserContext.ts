import { Request, Response } from 'express';
import { User } from './users/model';

export interface UserContext {
  req: Request;
  res: Response;
  user: User;
}
