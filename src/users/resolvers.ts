import { hash, compare } from 'bcryptjs';
import UserModel, { User } from './model';
import { sendRefreshToken } from './sendRefreshToken';
import { UserContext } from '../UserContext';
import { createRefreshToken, createAccessToken } from './auth';
import parseCookies from '../parseCookie';

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
  { req, res, user }: UserContext
): Promise<LoginRespons | Error> => {
  console.log('Login'); // eslint-disable-line no-console
  const userFromEmail = await UserModel.findOne({ email: email });

  if (!userFromEmail) {
    throw new Error('could not find user');
  }

  const valid = await compare(password, userFromEmail.password);

  if (!valid) {
    throw new Error('bad password');
  }
  // login successful
  console.log('User loged in: ' + userFromEmail.email); // eslint-disable-line
  // create refresh_token
  const refreshToken = createRefreshToken(userFromEmail);

  // // set refreshToken on user
  // userFromEmail.refreshToken = refreshToken;

  // // save user
  // userFromEmail.save(function(err, user) {
  //   if (err) return console.error(err);
  // });

  // set cookie "jid"
  sendRefreshToken(res, refreshToken);

  return { user: userFromEmail, accessToken: createAccessToken(userFromEmail) };
};

function getMe({ req, res, user }: UserContext) {
  return user;

  // return UserModel.findOne({}).catch((error: Error) => {
  //   throw error;
  // });

  // const userId = context.req.jwtpayload.user._id; //userId;
  // return UserModel.findOne({ _id: userId }).catch((error: Error) => {
  //   throw error;
  // });
}
export interface GetAccessTokenInput {
  refreshToken: string;
}

export interface GetAccessTokenRespons {
  user: User;
  accessToken: string;
}

const GetAccessToken = async ({
  req,
  res
}: UserContext): Promise<GetAccessTokenRespons | Error> => {
  const user = await UserModel.findOne();

  console.log('GetAccessToken'); // eslint-disable-line

  // console.log('request.headers.cookie: ' + req.headers.cookie); // eslint-disable-line
  // const cookies = parseCookies(req);
  // console.log('cookies: ' + JSON.stringify(cookies, null, 2)); // eslint-disable-line
  //console.log('req.cookies: ' + JSON.stringify(req.cookies, null, 2)); // eslint-disable-line

  return { user: user, accessToken: 'new TOKEN!!!' };
};

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
    ) => Login(input, context),
    GetAccessToken: (_: null, context: UserContext) => GetAccessToken(context)
  }
};

export default resolvers;
