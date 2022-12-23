import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

type AppErrorProps = {
  message: string;
  statusCode: number;
  code: string;
};

export class AppError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor({ message, statusCode, code }: AppErrorProps) {
    super(message);
    this.extensions = { statusCode, code };
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super({ message, statusCode: 400, code: 'BAD_REQUEST' });
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super({ message, statusCode: 401, code: 'UNAUTHENTICATED' });
  }
}
