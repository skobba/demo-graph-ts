import MatterModel, { Matter } from './model';
import ClientModel from '../clients/model';
import { client } from '../clients/db';

export interface CreateMatterInput {
  title: string;
  client: string;
}

const createMatter = ({
  title,
  client
}: CreateMatterInput): Promise<Matter | Error> => {
  return MatterModel.create({
    title,
    client
  })
    .then((matter: Matter) => {
      // Add matter to client.matters
      const filter = { _id: client };
      const update = {
        $push: {
          matters: matter._id
        }
      };

      ClientModel.updateOne(filter, update, function(data, err) {
        if (err) {
          // console.log('***ERROR' + JSON.stringify(err, null, 2));
        }
        // console.log('** updated: ' + JSON.stringify(data, null, 2));
      });
      return matter;
    })
    .catch((error: Error) => {
      throw error;
    });
};

interface GetAllMattersInput {
  limit?: number;
}

function getAllMatters({ limit }: GetAllMattersInput) {
  return MatterModel.find({})
    .limit(limit ? limit : 0)
    .then((matters: Matter[]) => {
      return matters.map(matter => {
        return {
          ...matter._doc,
          _id: matter.id,
          //client: client.bind(this, matter.client)
          client: client(matter.client._id)
        };
      });
    })
    .catch((error: Error) => {
      throw error;
    });
}

const resolvers = {
  Query: {
    matters: (_: null, { input }: { input: any }) => getAllMatters({ ...input })
  },
  Mutation: {
    CreateMatter: (_: null, { input }: { input: CreateMatterInput }) =>
      createMatter({ ...input })
  }
};

export default resolvers;
