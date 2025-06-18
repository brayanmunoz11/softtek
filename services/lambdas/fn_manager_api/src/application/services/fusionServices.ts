import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../infrastructure/logging/logs';
import { DynamoDBConnector } from '../../infrastructure/database/dynamoDBConnector';

export const fusionService = {
  async getFusionData(personId: number) {
    const cached = await this.getCachedFusion(personId);
    if (cached) {
      Logger.info('✅ Devolviendo datos desde caché');
      return cached;
    }

    try {
      const people = await axios.get(`https://swapi.info/api/people/${personId}`);
      const planet = await axios.get(people.data.homeworld);
      const weather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current_weather=true`);

      Logger.info('🌤️ Weather data:', weather.data);

      const fusion = {
        name: people.data.name,
        planet: planet.data.name,
        climate: planet.data.climate,
        weather: weather.data.current_weather,
      };

      await DynamoDBConnector.insertConfigurate({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        source: `cache-${personId}`, // identificador único por persona
        data: JSON.stringify(fusion),
      });

      return fusion;
    } catch (error) {
      Logger.error('❌ Error al obtener datos de las APIs externas', error);
      throw new Error('No se pudo obtener la información de las fuentes externas.');
    }
  },

  async getCachedFusion(personId: number) {
    const items = await DynamoDBConnector.findAllConfigurate();

    const fusionItems = items
      .filter(item => item.source === `cache-${personId}`)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const latest = fusionItems[0];
    if (!latest) return null;

    const ageInMinutes = (Date.now() - new Date(latest.timestamp).getTime()) / 1000 / 60;
    return ageInMinutes <= 30 ? JSON.parse(latest.data) : null;
  },
  async getCachedManual(personId: number) {
    const items = await DynamoDBConnector.findAllConfigurate();

    const manualItems = items
      .filter(item => item.source === 'manual' && JSON.parse(item.data)?.personId === personId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const latest = manualItems[0];
    if (!latest) return null;

    const ageInMinutes = (Date.now() - new Date(latest.timestamp).getTime()) / 1000 / 60;
    return ageInMinutes <= 30 ? JSON.parse(latest.data) : null;
  },
  async saveCustomData(data: any) {
    const personId = data?.id || data?.personId || null;

    if (!personId) {
      throw new Error('Se requiere un identificador de persona (personId) en los datos manuales.');
    }

    const cached = await this.getCachedManual(personId);
    if (cached) {
      Logger.info(`✅ Datos ya existen en caché reciente para personId=${personId}, no se almacenará nuevamente.`);
      return;
    }

    await DynamoDBConnector.insertConfigurate({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      source: 'manual',
      data: JSON.stringify(data),
    });

    Logger.info(`📝 Datos manuales almacenados para personId=${personId}`);
  }
  ,

  async getHistorial(page: number, size: number) {
    const allItems = await DynamoDBConnector.findAllConfigurate();

    const sorted = allItems.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const start = (page - 1) * size;
    return sorted.slice(start, start + size).map(item => JSON.parse(item.data));
  }
};
