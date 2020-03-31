import { User } from './model';
import { sign } from 'jsonwebtoken';

export const createAccessToken = (user: User) => {
  return sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1m'
  });
};

export const createRefreshToken = (user: User) => {
  console.log("Set refresh_token to 2d"); // eslint-disable-line

  return sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '2d'
    }
  );
};
