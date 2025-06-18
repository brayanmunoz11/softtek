import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../infrastructure/logging/logs';
import { CodeDataBase } from '../../utils/tracer';
import { TABLE_NAME } from '../../utils/env';

export class DynamoDBConnector {
  private static client: AWS.DynamoDB.DocumentClient;

  public static getClient(): AWS.DynamoDB.DocumentClient {
    if (!this.client) {
      this.client = new AWS.DynamoDB.DocumentClient({
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'fakeKey',
        secretAccessKey: 'fakeSecret'
      });
    }
    return this.client;
  }

  public static async testConnection(): Promise<void> {
    const rawClient = new AWS.DynamoDB({
      region: 'us-east-1',
      endpoint: 'http://localhost:8000',
      accessKeyId: 'fakeKey',
      secretAccessKey: 'fakeSecret'
    });

    try {
      const response = await rawClient.listTables().promise();
      console.log('📋 Tablas disponibles:', response.TableNames);
    } catch (err) {
      console.error('❌ Error al listar tablas:', err);
    }
  }

  static async findAllConfigurate(): Promise<any[]> {
    try {
      const client = this.getClient();
      const result = await client.scan({ TableName: TABLE_NAME }).promise();
      if (!result.Items || result.Items.length === 0) {
        Logger.warn(CodeDataBase.MSG_LIST_EMPTY_DB);
        return [];
      }
      return result.Items;
    } catch (err: any) {
      Logger.error(err.stack || err.message);
      throw new Error(err.message);
    }
  }

  static async insertConfigurate(document: Record<string, any>): Promise<void> {
    try {
      console.log('-- <OK> Iniciando inserción de documento en DynamoDB --');
      const client = this.getClient();
      const item = {
        ...document,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };
      await client.put({
        TableName: 'FusionHistorial',
        Item: item
      }).promise();
    } catch (err: any) {
      Logger.error(err.stack || err.message);
      throw new Error(CodeDataBase.MSG_ERROR_PROCESS_DB + err.message);
    }
  }

  static async updateConfigurate(key: Record<string, any>, update: Record<string, any>): Promise<void> {
    try {
      const client = this.getClient();

      const updateExpressions = Object.keys(update)
        .map(k => `#${k} = :${k}`)
        .join(', ');

      const expressionAttributeNames = Object.fromEntries(
        Object.keys(update).map(k => [`#${k}`, k])
      );

      const expressionAttributeValues = Object.fromEntries(
        Object.keys(update).map(k => [`:${k}`, update[k]])
      );

      await client.update({
        TableName: TABLE_NAME,
        Key: key,
        UpdateExpression: `SET ${updateExpressions}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      }).promise();
    } catch (err: any) {
      Logger.error(err.stack || err.message);
      throw new Error(CodeDataBase.MSG_ERROR_GENERAL_DB + err.message);
    }
  }

  static async deleteConfigurate(key: Record<string, any>): Promise<void> {
    try {
      const client = this.getClient();
      await client.delete({
        TableName: TABLE_NAME,
        Key: key
      }).promise();
    } catch (err: any) {
      Logger.error(err.stack || err.message);
      throw new Error(CodeDataBase.MSG_LIST_EMPTY_DB);
    }
  }
}
