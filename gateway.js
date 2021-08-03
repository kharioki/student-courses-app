import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import AppSource from './gatewaySource';

// create three microservices; auth, student and course

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'auth',
      url: `${process.env.AUTH_DOMAIN}${process.env.GRAPHQL_PATH}`,
      // http://localhost:4001/graphql
    },
    {
      name: 'course',
      url: `${process.env.COURSE_DOMAIN}${process.env.GRAPHQL_PATH}`,
      // http://localhost:4002/graphql
    },
    {
      name: 'student',
      url: `${process.env.STUDENT_DOMAIN}${process.env.GRAPHQL_PATH}`,
      // http://localhost:4003/graphql
    },
  ],
  buildService({ name, url }) {
    return new AppSource({ url });
  },
});

const app = express();

async function startServer() {
  const apolloServer = new ApolloServer({
    gateway,
    subscriptions: false, // subscriptions not supported in federation
    context: ({ req }) => ({ req: req, res: req.res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });
}
startServer();

app.listen(process.env.GATEWAY_PORT);
console.log(`Gateway server listening on port ${process.env.GATEWAY_DOMAIN}`);
