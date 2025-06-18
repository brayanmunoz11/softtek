import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { ValidateAccessController } from './src/application/controllers/validateAccessControllers';
import { Logger } from './src/infrastructure/logging/logs';

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  const startTime = Date.now();
  Logger.info('<--------------- Inicio Validate Access---------------->');
  Logger.info(`Event: ${JSON.stringify(event)}`);

  try {
    return await ValidateAccessController.processRequest(event, context);
  } catch (error) {
    Logger.error(`Error: ${error}`);
    return {
      statusCode: 500,
      body: 'Internal Server Error :(',
    };
  } finally {
    const executionTime = (Date.now() - startTime) / 1000;
    Logger.info(`<--------------- Fin Validate Access: ${executionTime.toFixed(4)} seg. ---------------->`);
  }
};
