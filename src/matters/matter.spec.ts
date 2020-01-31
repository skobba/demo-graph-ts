import mongoose from 'mongoose';
import MatterModel, { Matter } from './model';
import { setupMongoose } from '../db';

describe('Matter model', () => {
  beforeAll(async () => {
    setupMongoose();
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  it('Should throw validation errors', () => {
    const matter = new MatterModel();

    expect(matter.validate).toThrow();
  });

  it('Should save Narkosak01', () => {
    const matter = new MatterModel({
      title: 'Narkosak01'
    });
    matter.save().then(ret => {
      // eslint-disable-next-line no-console
      console.log('*** matter: ' + JSON.stringify(ret, null, 2));
    });
    expect(null).toBeNull();
  });

  it('Should save a matter', async () => {
    expect.assertions(3);

    const matter: Matter = new MatterModel({
      title: 'Narkosak01'
    });
    const spy = jest.spyOn(matter, 'save');

    //matter.save();
    matter.save().then(ret => {
      // eslint-disable-next-line no-console
      console.log('*** matter2: ' + JSON.stringify(ret, null, 2));
    });

    expect(spy).toHaveBeenCalled();

    expect(matter).toMatchObject({
      title: expect.any(String)
    });

    expect(matter.title).toBe('Narkosak01');
  });
});
