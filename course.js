import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { buildFederatedSchema } from '@apollo/federation';
import { typeDefs, resolvers } from './courseSchema';
import { authCheck } from './middleware';

const app = express();
app.use(cookieParser);
app.use(authCheck());

async function startServer() {
  const apolloServer = new ApolloServer({
    schema: buildFederatedSchema(typeDefs, resolvers),
    context: ({ req, res }) => ({ req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });
}
startServer();

app.listen(parseInt(process.env.COURSE_PORT)); // 4002
console.log(`Course server started on domain: ${process.env.COURSE_DOMAIN}`); // http://localhost:4002
