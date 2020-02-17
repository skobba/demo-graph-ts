import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  const now = new Date(Date.now());
  res.cookie('refresh_token', token, {
    //expires: new Date(Date.now() + 9000000),
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    //expires: now.setDate(now.getDate() + 10),
    httpOnly: true,
    secure: false
  });

  // res.cookie('jid', token, {
  //   httpOnly: true,
  //   path: '/refresh_token'
  // });

  // res.cookie('jid', token, {
  //   httpOnly: true,
  //   path: '/graphql'
  // });

  // res.cookie('jid', token, {
  //   httpOnly: true
  // });

  // res.cookie('trulz', token, {
  //   path: '/'
  // });
};
