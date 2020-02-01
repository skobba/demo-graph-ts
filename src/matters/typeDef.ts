import { gql } from 'apollo-server-express';

const typeDef = gql`
  type Matter {
    _id: ID!
    title: String
    client: Client
  }
  extend type Query {
    matters: [Matter]
  }

  input CreateMatterInput {
    title: String
    client: ID!
  }

  extend type Mutation {
    CreateMatter(input: CreateMatterInput): Matter
  }
`;

export default typeDef;
