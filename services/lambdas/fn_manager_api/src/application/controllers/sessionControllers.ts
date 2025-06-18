import { Router, Request, Response } from 'express';
import { Security } from '../../utils/security';
import { MSG_SUCCESS, MSG_INTERNAL_ERROR } from '../../utils/env';
import { Logger } from '../../infrastructure/logging/logs';

export const sessionController = Router();

sessionController.post('/generate-token', async (_req: Request, res: Response): Promise<any> => {
  try {
    Logger.info('✅ Ingresando al endpoint /generate-token');
    
    const payload = { anonymous: true, role: 'guest' };
    const tokens = Security.generateToken(payload); // Asegúrate de que esto no sea async si no devuelves una promesa

    return res.status(200).json({
      success: true,
      message: MSG_SUCCESS,
      result: tokens,
    });
  } catch (err) {
    Logger.error('❌ Error en /generate-token:', err);

    return res.status(500).json({
      success: false,
      message: MSG_INTERNAL_ERROR,
      error: (err as Error).message || 'Unexpected error',
    });
  }
});
