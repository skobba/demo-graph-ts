import ClientModel from './model';
import { matters } from '../matters/db';

export const client = (clientId: string) => {
  return ClientModel.findById(clientId).then(client => {
    return {
      ...client._doc,
      _id: client.id,
      matters: matters.bind(this, client.matters)
    };
  });
};
