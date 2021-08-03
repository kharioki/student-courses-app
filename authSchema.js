import { gql } from "apollo-server-express";

export const typeDefs = gql`
  extend type Mutation {
    login(email: String!, password: String!): AccessToken
  }

  type AccessToken {
    accessToken: ID
  }
`;

export const resolvers = {
  Mutation: {
    login(_, { email, password }, context) {
      const accessToken = process.env.SIGNED_ACCESS_TOKEN;
      const cookieName = process.env.SIGNED_COOKIE_NAME;
      const cookieDomain = 'localhost';
      const cookieToken = process.env.SIGNED_COOKIE_TOKEN;
      const cookieExpiration = new Date(new Date().getTime() + 10 * 60000);

      context.res.cookie(cookieName, cookieToken, {
        domain: cookieDomain,
        secure: false,
        httpOnly: false,
        expires: cookieExpiration,
        maxAge: cookieExpiration.getTime(),
      });

      context.res.status(200);
      return { accessToken };
    }
  }
};
