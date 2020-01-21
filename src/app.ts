import express, { Request, Response } from 'express';

const index = (req: Request, res: Response) => {
  res
    .status(200)
    .send(`
    <ul>
    <li>
      github repo is <a href="https://github.com/skobba/demo-graph">https://github.com/skobba/demo-graph</a>
    </li>
      <li>
        ${process.env.NODE_ENV} server is listening on ${process.env.PORT}
      </li>
    </ul>
    `);
};

class App {
  public express: any;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    this.express.get('/', index);
  }
}

export default new App().express;
