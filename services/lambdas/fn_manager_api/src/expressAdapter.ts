import serverlessExpress from '@vendia/serverless-express';
import app from './app';

export const lambda_handler = serverlessExpress({ app });
