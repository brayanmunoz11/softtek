import { Security } from '../../utils/security';
import { Response } from '../../utils/response';
import { Logger } from '../../infrastructure/logging/logs';

export class ValidateAccessService {
  static async validateAccess(event: any): Promise<any> {
    const startTime = Date.now();
    const initDate = new Date().toISOString();

    Logger.info(`<--------------- Inicio validate_access: ${initDate} ---------------->`);

    try {
      const headers = event.headers || {};
      const currentRoute = event.resource || '';

      const result = await Security.verifyToken(headers);

      if (!result?.verify_iat) {
        return Response.ResponseUnauthorized(event, result?.username || 'unknown_user');
      }

      if (!result?.status) {
        return Response.ResponseUnauthorized(event, result?.username || 'unknown_user');
      }

      return Response.ResponseSuccess(event, result?.username|| 'unknown_user', result);

    } catch (ex: any) {
      Logger.error(`Error: ${ex.message}`);
      return Response.ResponseUnauthorized(event,'unknown_user');
    } finally {
      const executionTime = (Date.now() - startTime) / 1000;
      Logger.info(`<--------------- Fin validate_access: ${executionTime.toFixed(4)} seg. ---------------->`);
    }
  }
}
