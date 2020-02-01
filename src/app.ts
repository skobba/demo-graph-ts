import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import schema from './schema';
import { setupMongoose } from './db';

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
    this.setupApollo();
    this.mountRoutes();
  }

  private setupApollo(): void {
    const server = new ApolloServer({
      schema,
      validationRules: [depthLimit(7)],
      playground: true,
      introspection: true
    });

    this.express.use('*', cors());
    this.express.use(compression());

    server.applyMiddleware({ app: this.express, path: '/graphql' });
  }

  private mountRoutes(): void {
    this.express.get('/', index);
  }
}

export default new App().express;
