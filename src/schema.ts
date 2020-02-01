import { makeExecutableSchema } from 'graphql-tools';
import ClientTypeDefs from './clients/typeDef';
import ClientResolvers from './clients/resolvers';
import { GraphQLSchema } from 'graphql';

import MatterTypeDefs from './matters/typeDef';
import MatterResolvers from './matters/resolvers';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [ClientTypeDefs, MatterTypeDefs],
  resolvers: [ClientResolvers, MatterResolvers]
});

export default schema;
