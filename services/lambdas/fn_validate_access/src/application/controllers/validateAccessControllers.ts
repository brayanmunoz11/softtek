import { Logger } from '../../infrastructure/logging/logs';
import { ValidateAccessService } from '../services/validateAccessServices';

export class ValidateAccessController {
  static async processRequest(event: any, context: any): Promise<any> {
    Logger.info('<--------------- Inicio Validacion ---------------->');

    Logger.info(`Event: ${JSON.stringify(event)}`);
    Logger.info(`Context: ${JSON.stringify(context)}`);

    const response = await ValidateAccessService.validateAccess(event);

    Logger.info('<--------------- Fin Validacion ---------------->');
    return response;
  }
}
