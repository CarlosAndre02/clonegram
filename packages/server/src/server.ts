import Koa from 'koa';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL
} from 'graphql-helix';
import { graphqlUploadKoa } from 'graphql-upload-cjs';
import { ExecutionResult, GraphQLError } from 'graphql';

import { schema } from './schema/schema';

const formatResult = (result: ExecutionResult) => {
  const formattedResult: ExecutionResult = {
    data: result.data
  };

  if (result.errors) {
    formattedResult.errors = result.errors.map((error) => {
      console.log(error);
      return new GraphQLError(error.message, { ...error });
    });
  }

  return formattedResult;
};

const app = new Koa();

app.use(bodyparser());
app.use(cors());

app.use(graphqlUploadKoa({ maxFileSize: 10000000, maxFiles: 10 }));

app.use(async (ctx) => {
  const request = {
    body: ctx.request.body,
    headers: ctx.req.headers,
    method: ctx.request.method,
    query: ctx.request.query
  };

  if (shouldRenderGraphiQL(request)) {
    ctx.body = renderGraphiQL({});
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema
    });

    ctx.respond = false;
    sendResult(result, ctx.res, formatResult);
  }
});

export default app;
