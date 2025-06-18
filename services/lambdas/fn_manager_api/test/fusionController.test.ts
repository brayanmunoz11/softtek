import request from 'supertest';
import express from 'express';
import { fusionController } from '../src/application/controllers/fusionContollers';

jest.mock('../src/application/services/fusionServices', () => ({
  fusionService: {
    getFusionData: jest.fn().mockResolvedValue({ name: 'Luke', planet: 'Tatooine', climate: 'arid', weather: {} }),
    saveCustomData: jest.fn().mockResolvedValue(undefined),
    getHistorial: jest.fn().mockResolvedValue([{ name: 'Leia' }]),
  }
}));
jest.mock('../src/infrastructure/logging/logs', () => ({
  Logger: { info: jest.fn(), error: jest.fn() }
}));

const app = express();
app.use(express.json());
app.use('/fusion', fusionController);

describe('Fusion Controller', () => {
  test('GET /fusion/fusionados/:idPeople - válido', async () => {
    const res = await request(app).get('/fusion/fusionados/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.name).toBe('Luke');
  });

  test('GET /fusion/fusionados/:idPeople - inválido', async () => {
    const res = await request(app).get('/fusion/fusionados/abc');
    expect(res.status).toBe(400);
  });

  test('POST /fusion/almacenar - válido', async () => {
    const res = await request(app).post('/fusion/almacenar').send({ personId: 10, info: 'test' });
    expect(res.status).toBe(201);
  });

  test('GET /fusion/historial', async () => {
    const res = await request(app).get('/fusion/historial?page=1&size=1');
    expect(res.status).toBe(200);
    expect(res.body.result.length).toBe(1);
  });
});
