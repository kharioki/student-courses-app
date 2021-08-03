import { RemoteGraphQLDataSource } from "@apollo/gateway";

export default class AppSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    if (context.req === undefined) {
      // this means the gateway is starting up
      // it will ping the microservices for their schema
      request.http.headers.set(
        process.env.GATEWAY_INIT_HEADER_NAME,
        process.env.GATEWAY_INIT_HEADER_VALUE
      );
      return;
    }

    const headers = context.req.headers;
    if (headers === undefined) return;

    Object.keys(headers).map(
      key => request.http && request.http.headers.set(key, headers[key])
    );
  }

  didReceiveResponse({ response, context }) {
    if (context.res === undefined) return response;

    const cookie = response.http.headers.get("set-cookie");
    if (cookie) {
      // forward set cookies
      context.res.set("set-cookie", cookie);
    }

    return response;
  }
}
