import { Router, Request, Response } from 'express';
import { fusionService } from '../services/fusionServices';
import { MSG_SUCCESS, MSG_INTERNAL_ERROR } from '../../utils/env';
import { Logger } from '../../infrastructure/logging/logs';

export const fusionController = Router();

fusionController.get('/fusionados/:idPeople', async (req: Request, res: Response): Promise<any> => {
  try {
    Logger.info('✅ Ingresando al endpoint /fusionados/:idPeople');

    const personId = parseInt(req.params.idPeople);

    if (!personId || isNaN(personId)) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "idPeople" es obligatorio y debe ser un número válido.',
      });
    }

    const result = await fusionService.getFusionData(personId);

    return res.status(200).json({
      success: true,
      message: MSG_SUCCESS,
      result,
    });
  } catch (err) {
    Logger.error('❌ Error en /fusionados/:idPeople:', err);

    return res.status(500).json({
      success: false,
      message: MSG_INTERNAL_ERROR,
      error: (err as Error).message || 'Unexpected error',
    });
  }
});

fusionController.post('/almacenar', async (req: Request, res: Response): Promise<any> => {
  try {
    Logger.info('✅ Ingresando al endpoint /almacenar');

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    Logger.info('Datos recibidos para almacenar:', data);

    await fusionService.saveCustomData(data);

    return res.status(201).json({
      success: true,
      message: MSG_SUCCESS,
    });
  } catch (err) {
    Logger.error('❌ Error en /almacenar:', err);

    return res.status(500).json({
      success: false,
      message: MSG_INTERNAL_ERROR,
      error: (err as Error).message || 'Unexpected error',
    });
  }
});

fusionController.get('/historial', async (req: Request, res: Response): Promise<any> => {
  try {
    Logger.info('✅ Ingresando al endpoint /historial');

    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const result = await fusionService.getHistorial(page, size);

    return res.status(200).json({
      success: true,
      message: MSG_SUCCESS,
      result,
    });
  } catch (err) {
    Logger.error('❌ Error en /historial:', err);

    return res.status(500).json({
      success: false,
      message: MSG_INTERNAL_ERROR,
      error: (err as Error).message || 'Unexpected error',
    });
  }
});
