import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import schema from './schema';
import UserModel from './users/model';
import { setupMongoose } from './db';
import { sendRefreshToken } from './users/sendRefreshToken';
import { createAccessToken, createRefreshToken } from './users/auth';

const index = (req: Request, res: Response) => {
  res.status(200).send(`
    <ul>
    <li>
      github repo is <a href="https://github.com/skobba/demo-graph">https://github.com/skobba/demo-graph</a>
    </li>
      <li>
        ${process.env.NODE_ENV} server is listening on ${process.env.PORT}
      </li>
      <li>
        connected to mongodb on ${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASENAME}
      </li>
      <li>
        GraphQL Playground on 
        <a href="/graphql">/graphql</a>
      </li>
    </ul>
    `);
};

function parseCookies(request: any) {
  const list = {},
    rc = request.headers.cookie;

  rc &&
    rc.split(';').forEach(function(cookie: any) {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('=')); // eslint-disable-line
    });

  return list;
}

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

setupMongoose();

const app = express();

app.use(cors(corsOptions));

app.use(compression());

app.get('/', index);

app.use('/graphql', async (req: Request, res: Response, next: () => void) => {
  console.log('Intercept all request'); // eslint-disable-line
  next();
});

app.post('/graphql', (req: Request, res: any, next: () => void) => {
  try {
    console.log('Get user from jwt'); // eslint-disable-line no-console
    const token = req.headers['authorization']; //.split(' ')[1]
    console.log('Token: ' + token); // eslint-disable-line no-console
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    console.log('payload: ' + JSON.stringify(payload, null, 2)); // eslint-disable-line no-console

    req.jwtpayload = payload as JwtDecoded;

    console.log('req.jwtpayload: ' + JSON.stringify(req.jwtpayload, null, 2)); // eslint-disable-line no-console
    // UserModel.findOne({ _id: req.jwtpayload.userId })
    //   .then(user => {
    //     console.log('user: ' + JSON.stringify(user, null, 2)); // eslint-disable-line no-console
    //     req.user = user;
    //   })
    //   .catch((error: Error) => {
    //     throw error;
    //   });

    //console.log('userId: ' + req.jwtpayload.userId); // eslint-disable-line no-console

    debugger;
  } catch (err) {
    //console.log(err); // eslint-disable-line no-console
    console.log('No valid token!!!'); // eslint-disable-line no-console
    //throw new Error('not authenticated');
  }

  next();
});

app.post('/refresh_token', async (req: Request, res: Response) => {
  //console.log('res: ' + JSON.stringify(res.cookie, null, 2)); // eslint-disable-line
  const cookies = parseCookies(req);

  console.log('cookies: ' + JSON.stringify(cookies, null, 2));// eslint-disable-line
  console.log('cookies.refresh_token: ' + cookies.refresh_token);// eslint-disable-line
  //console.log('req.cookies: ' + JSON.stringify(req.cookies, null, 2)); // eslint-disable-line

  const token = cookies.refresh_token; //req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload: any = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
        console.log(err); // eslint-disable-line
    return res.send({ ok: false, accessToken: '' });
  }

  console.log('payload: ' + JSON.stringify(payload, null, 2));// eslint-disable-line

  console.log('payload.userId: ' + payload.userId);// eslint-disable-line

  // token is valid and
  // we can send back an access token
  const user = await UserModel.findOne({ _id: payload.userId });
  console.log('user: ' + JSON.stringify(user, null, 2));// eslint-disable-line
  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

// Setup Apollo
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    let user = null;
    if (req.jwtpayload) {
      // console.log(
      //   'ctx - req.jwtpayload: ' + JSON.stringify(req.jwtpayload, null, 2)
      // ); // eslint-disable-line no-console
      console.log('Create context - req.jwtpayload.userId: ' + req.jwtpayload.userId); // eslint-disable-line
      //const user = UserModel.findOne({ _id: req.jwtpayload.user._id });
      user = UserModel.findOne({ _id: req.jwtpayload.userId });
    }
    return { req, res, user };
  },
  validationRules: [depthLimit(7)],
  playground: true,
  introspection: true
});

server.applyMiddleware({
  app: app,
  path: '/graphql',
  cors: false
});

export default app;
