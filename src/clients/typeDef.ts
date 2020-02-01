import { gql } from 'apollo-server-express';

const typeDef = gql`
  type Client {
    _id: ID!
    email: String
    firstName: String
    lastName: String
    matters: [Matter]
  }
  extend type Query {
    clients: [Client]
  }

  input CreateClientInput {
    email: String
    firstName: String
    lastName: String
  }

  type Mutation {
    CreateClient(input: CreateClientInput): Client
  }

  type Query {
    helloWorld: String!
  }
`;

export default typeDef;
