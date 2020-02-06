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

class App {
  public express: any;

  constructor() {
    setupMongoose();
    this.express = express();
    this.getUserFromJwt();
    this.setupApollo();
    this.mountRoutes();
  }

  private setupApollo(): void {
    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      validationRules: [depthLimit(7)],
      playground: true,
      introspection: true
    });

    this.express.use('*', cors());
    this.express.use(compression());

    server.applyMiddleware({ app: this.express, path: '/graphql' });
  }

  private getUserFromJwt(): void {
    this.express.post(
      '/graphql',
      (req: Request, res: any, next: () => void) => {
        const authorization = req.headers['authorization'];

        try {
          const token = authorization.split(' ')[1];
          const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
          console.log('payload: ' + JSON.stringify(payload, null, 2)); // eslint-disable-line no-console
          req.jwtpayload = payload as JwtDecoded;
          debugger;
        } catch (err) {
          //console.log(err);
          //throw new Error('not authenticated');
        }

        next();
      }
    );
  }

  private mountRoutes(): void {
    this.express.get('/', index);
    this.express.post('/refresh_token', async (req: Request, res: Response) => {
      const token = req.cookies.jid;
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

      // token is valid and
      // we can send back an access token
      const user = await UserModel.findOne({ id: payload.userId });

      if (!user) {
        return res.send({ ok: false, accessToken: '' });
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: '' });
      }

      sendRefreshToken(res, createRefreshToken(user));

      return res.send({ ok: true, accessToken: createAccessToken(user) });
    });
  }
}

export default new App().express;
