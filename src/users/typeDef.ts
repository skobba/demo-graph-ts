import { gql } from 'apollo-server-express';

const typeDef = gql`
  type User {
    _id: ID!
    email: String
    password: String
    tokenVersion: Int
  }
  extend type Query {
    me: User
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    user: User!
    accessToken: String!
  }

  extend type Mutation {
    Register(input: RegisterInput): User
    Login(input: LoginInput): LoginResponse
  }
`;

export default typeDef;
