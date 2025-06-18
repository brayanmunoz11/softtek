import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { lambda_handler } from './src/expressAdapter';
import { Logger } from './src/infrastructure/logging/logs';

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  const startTime = Date.now();
  Logger.info('<--------------- Inicio Manager API---------------->');
  Logger.info(`Event: ${JSON.stringify(event)}`);
  Logger.info(`Context: ${JSON.stringify(context)}`);

  try {
    return await lambda_handler(event, context, callback);
  } catch (error) {
    Logger.error(`Error: ${error}`);
    return {
      statusCode: 500,
      body: 'Internal Server Error :(',
    };
  } finally {
    const executionTime = (Date.now() - startTime) / 1000;
    Logger.info(`<--------------- Fin Manager API: ${executionTime.toFixed(4)} seg. ---------------->`);
  }
};
