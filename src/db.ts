import mongoose from 'mongoose';

export const setupMongoose = () => {
  const connectionUris = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASENAME}?authSource=${process.env.MONGO_DATABASENAME}&authMechanism=SCRAM-SHA-1`;

  if (process.env.NODE_ENV == 'development') {
    console.log(`connectionUris: ${connectionUris}`); // eslint-disable-line no-console
    mongoose.set('debug', true);
  }

  mongoose.connect(connectionUris, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export default setupMongoose;
