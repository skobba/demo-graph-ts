import MatterModel from './model';
import { client } from '../clients/db';

// Hvorfor kommer ikke array som string?
export const matters = (matters: [any]) => {
  return MatterModel.find({ _id: { $in: matters } })
    .then(matters => {
      return matters.map(matter => {
        return {
          ...matter._doc,
          //client: client(matter.client._id),
          client: client.bind(this, matter.client._id),
          _id: matter.id
        };
      });
    })
    .catch(err => {
      throw err;
    });
};
