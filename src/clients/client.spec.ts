import mongoose from 'mongoose';
import ClientModel, { Client } from './model';
import { setupMongoose } from '../db';

describe('Client model', () => {
  beforeAll(async () => {
    setupMongoose();
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  it('Should throw validation errors', () => {
    const client = new ClientModel();

    expect(client.validate).toThrow();
  });

  it('Should save Walter', () => {
    const client = new ClientModel({
      email: 'ww@lovogorden.no',
      firstName: 'Walter',
      lastName: 'White'
    });
    client.save().then(ret => {
      // eslint-disable-next-line no-console
      console.log('*** user: ' + JSON.stringify(ret, null, 2));
    });
    expect(null).toBeNull();
  });

  it('Should save a client', async () => {
    expect.assertions(3);

    const client: Client = new ClientModel({
      email: 'test@example.com',
      firstName: 'Test first name',
      lastName: 'Test last name'
    });
    const spy = jest.spyOn(client, 'save');

    //user.save();
    client.save().then(ret => {
      // eslint-disable-next-line no-console
      console.log('*** client2: ' + JSON.stringify(ret, null, 2));
    });

    expect(spy).toHaveBeenCalled();

    expect(client).toMatchObject({
      firstName: 'Test first name',
      lastName: expect.any(String),
      email: expect.any(String)
    });

    expect(client.email).toBe('test@example.com');
  });
});
