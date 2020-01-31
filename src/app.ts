import express, { Request, Response } from 'express';
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
    </ul>
    `);
};

class App {
  public express: any;

  constructor() {
    setupMongoose();
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    this.express.get('/', index);
  }
}

export default new App().express;
