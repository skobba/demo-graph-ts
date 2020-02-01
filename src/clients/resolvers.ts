import ClientModel, { Client } from './model';
import { matters } from '../matters/db';

export interface CreateClientInput {
  email: string;
  firstName: string;
  lastName: string;
}

const createClient = ({
  email,
  firstName,
  lastName
}: CreateClientInput): Promise<Client | Error> => {
  return ClientModel.create({
    email,
    firstName,
    lastName
  })
    .then((data: Client) => data)
    .catch((error: Error) => {
      throw error;
    });
};

export interface GetAllClientsInput {
  limit?: number;
}

function getAllClients({ limit }: GetAllClientsInput) {
  return ClientModel.find({})
    .limit(limit ? limit : 0)
    .then((clients: Client[]) => {
      return clients.map(client => {
        return {
          ...client._doc,
          _id: client.id,
          //client: client.bind(this, matter.client)
          matters: matters(client.matters)
        };
      });
    })
    .catch((error: Error) => {
      throw error;
    });
}

const ClientResolvers = {
  Query: {
    clients: (_: null, { input }: { input: any }) =>
      getAllClients({ ...input }),
    helloWorld: () => 'Hello!!'
  },
  Mutation: {
    CreateClient: (_: null, { input }: { input: CreateClientInput }) =>
      createClient({ ...input })
  }
};

export default ClientResolvers;
