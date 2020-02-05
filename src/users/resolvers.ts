import { hash, compare } from 'bcryptjs';
import UserModel, { User } from './model';
import { sendRefreshToken } from './sendRefreshToken';
import { UserContext } from '../UserContext';
import { createRefreshToken, createAccessToken } from './auth';

export interface RegisterInput {
  email: string;
  password: string;
  tokenVersion: number;
}

const Register = async ({
  email,
  password
}: RegisterInput): Promise<User | Error> => {
  const hashedPassword = await hash(password, 12);

  return UserModel.create({
    email,
    password: hashedPassword,
    tokenVersion: 1
  })
    .then((user: User) => {
      return user;
    })
    .catch((error: Error) => {
      throw error;
    });
};

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginRespons {
  user: User;
  accessToken: string;
}

// fieldName(obj, args, context, info) { result }
const Login = async (
  { email, password }: LoginInput,
  { req, res }: UserContext
): Promise<LoginRespons | Error> => {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new Error('could not find user');
  }

  const valid = await compare(password, user.password);

  if (!valid) {
    throw new Error('bad password');
  }

  // login successful
  sendRefreshToken(res, createRefreshToken(user));

  return { user, accessToken: createAccessToken(user) };
};

function getMe(context: UserContext) {
  const userId = context.req.jwtpayload.userId;
  return UserModel.findOne({ _id: userId }).catch((error: Error) => {
    throw error;
  });
}

const resolvers = {
  Query: {
    me: (_: null, { input }: { input: RegisterInput }, context: UserContext) =>
      getMe(context)
  },
  Mutation: {
    Register: (_: null, { input }: { input: RegisterInput }) =>
      Register({ ...input }),
    Login: (
      _: null,
      { input }: { input: RegisterInput },
      context: UserContext
    ) => Login(input, context)
  }
};

export default resolvers;
