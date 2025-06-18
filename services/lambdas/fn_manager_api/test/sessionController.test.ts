import request from 'supertest';
import express from 'express';
import { sessionController } from '../src/application/controllers/sessionControllers';
import { Security } from '../src/utils/security';
import { MSG_SUCCESS, MSG_INTERNAL_ERROR } from '../src/utils/env';

// Mockear dependencias
jest.mock('../src/utils/security', () => ({
  Security: {
    generateToken: jest.fn(),
  },
}));

jest.mock('../src/infrastructure/logging/logs', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('POST /generate-token', () => {
  const app = express();
  app.use(express.json());
  app.use('/', sessionController);

  it('debe retornar 200 y un token generado', async () => {
    const fakeTokens = { accessToken: 'token123', refreshToken: 'refresh123' };
    (Security.generateToken as jest.Mock).mockReturnValue(fakeTokens);

    const res = await request(app).post('/generate-token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: MSG_SUCCESS,
      result: fakeTokens,
    });
    expect(Security.generateToken).toHaveBeenCalledWith({ anonymous: true, role: 'guest' });
  });

  it('debe retornar 500 si ocurre un error', async () => {
    (Security.generateToken as jest.Mock).mockImplementation(() => {
      throw new Error('Fallo interno');
    });

    const res = await request(app).post('/generate-token');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(MSG_INTERNAL_ERROR);
    expect(res.body.error).toBe('Fallo interno');
  });
});
