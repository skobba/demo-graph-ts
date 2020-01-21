import app from './app';
import dotenv from 'dotenv';
import fs from 'fs';

if (process.env.NODE_ENV === 'development') {
  try {
    const fileContent = fs.readFileSync('.env.override');
    let envConfig;
    if (fileContent) {
      console.log('config: .env.override'); // eslint-disable-line no-console
      envConfig = dotenv.parse(fileContent);
    }
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (err) {
    console.log('config: .env'); // eslint-disable-line no-console
    dotenv.config({ path: './.env' });
  }
}

const port = process.env.PORT;

app.listen(port, (err: any) => {
  if (err) {
    return console.log(err); // eslint-disable-line no-console
  }

  // eslint-disable-next-line no-console
  return console.log(`${process.env.NODE_ENV} server is listening on ${port}`);
});
