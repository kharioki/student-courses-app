import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildFederatedSchema } from '@apollo/federation';
import { typeDefs, resolvers } from './authSchema';

const app = express();
app.use(express.json());

async function startServer() {
  const apolloServer = new ApolloServer({
    schema: buildFederatedSchema(typeDefs, resolvers),
    context: ({ req, res }) => ({ req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });
}
startServer();

app.listen(parseInt(process.env.AUTH_PORT)); // 4001
console.log(`Auth server started on domain: ${process.env.AUTH_DOMAIN}`); // http://localhost:4001
