import { makeExecutableSchema } from 'graphql-tools';
import ClientTypeDefs from './clients/typeDef';
import ClientResolvers from './clients/resolvers';
import { GraphQLSchema } from 'graphql';

import MatterTypeDefs from './matters/typeDef';
import MatterResolvers from './matters/resolvers';

import UserTypeDefs from './users/typeDef';
import UserResolvers from './users/resolvers';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [ClientTypeDefs, MatterTypeDefs, UserTypeDefs],
  resolvers: [ClientResolvers, MatterResolvers, UserResolvers]
});

export default schema;
