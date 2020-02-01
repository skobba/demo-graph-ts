import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { gql } from 'apollo-server-express';

const typeDef = gql`
  type Query {
    helloWorld: String!
  }
`;

const resolver = {
  Query: {
    helloWorld: () => 'Hello!!'
  }
};

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [typeDef],
  resolvers: [resolver]
});

export default schema;
