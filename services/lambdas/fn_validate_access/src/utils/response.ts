import { Logger } from '../infrastructure/logging/logs';

interface APIGatewayEvent {
  methodArn?: string;
  [key: string]: any;
}

interface TokenValidationResult {
  username?: string;
  email?: string;
  role?: string;
  status?: boolean;
}

export class Response {
  static ResponseSuccess(event: APIGatewayEvent, username: string, result: TokenValidationResult) {
    const methodArn = event.methodArn || '';
    const apiArn = methodArn ? methodArn.split('/').slice(0, 2).join('/') + '/*' : '*';

    const response = {
      principalId: username,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: '*',
            Effect: 'Allow',
            Resource: apiArn
          }
        ]
      },
      context: {
        username: result.username || '',
        email: result.email || '',
        role: result.role || '',
        status: result.status || false
      }
    };

    Logger.info('response: ', response);
    return response;
  }

  static ResponseUnauthorized(event: APIGatewayEvent, username: string) {
    const methodArn = event.methodArn || '';
    const apiArn = methodArn ? methodArn.split('/').slice(0, 2).join('/') + '/*' : '*';

    const response = {
      principalId: username,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: '*',
            Effect: 'Deny',
            Resource: apiArn
          }
        ]
      }
    };

    Logger.info('response: ', response);
    return response;
  }
}
