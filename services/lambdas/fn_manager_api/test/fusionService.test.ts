import { fusionService } from '../src/application/services/fusionServices';


jest.mock('axios', () => ({
  get: jest.fn((url: string) => {
    if (url.includes('people')) {
      return Promise.resolve({ data: { name: 'Luke', homeworld: 'https://planet.com/1' } });
    } else if (url.includes('planet')) {
      return Promise.resolve({ data: { name: 'Tatooine', climate: 'arid' } });
    } else if (url.includes('forecast')) {
      return Promise.resolve({ data: { current_weather: { temperature: 25 } } });
    }
  })
}));

jest.mock('../src/infrastructure/database/dynamoDBConnector', () => ({
  DynamoDBConnector: {
    insertConfigurate: jest.fn(),
    findAllConfigurate: jest.fn().mockResolvedValue([]),
  }
}));

jest.mock('../src/infrastructure/logging/logs', () => ({
  Logger: { info: jest.fn(), error: jest.fn() }
}));

describe('fusionService', () => {
  test('getFusionData fetches and returns fusion object', async () => {
    const data = await fusionService.getFusionData(1);
    expect(data.name).toBe('Luke');
    expect(data.planet).toBe('Tatooine');
  });

  test('saveCustomData stores new data', async () => {
    await expect(fusionService.saveCustomData({ personId: 5, value: 'test' })).resolves.toBeUndefined();
  });

  test('getHistorial paginates data', async () => {
    const result = await fusionService.getHistorial(1, 10);
    expect(Array.isArray(result)).toBe(true);
  });
});
