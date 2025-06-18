import jwt from 'jsonwebtoken';
import { JWT_KEY } from './env';
import { Utils } from './utils'; 
import { Logger } from '../infrastructure/logging/logs';

export interface TokenPayload {
  username?: string;
  email?: string;
  role?: string;
  status?: boolean;
  exp?: number;
}


export class Security {
  static generateToken(data: any) {
    const accessToken = jwt.sign(data, JWT_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign(data, JWT_KEY, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  static verifyTokenRefresh(token: string): boolean {
    try {
      jwt.verify(token, JWT_KEY);
      return true;
    } catch {
      return false;
    }
  }

  static verifyToken(headers: Record<string, string>) {
    try {
      if ('Authorization' in headers) {
        const authorization = headers['Authorization'];
        const encodedToken = authorization.split(' ')[1];

        if (encodedToken && encodedToken.split('.').length === 3) {
          try {
            const payload = jwt.verify(encodedToken, JWT_KEY) as TokenPayload;

            const verify_iat = Utils.verifyIat(payload.exp);
            return {
              username: payload.username,
              status: true,
              verify_iat,
            };
          } catch (error) {
            if (
              error instanceof jwt.TokenExpiredError ||
              error instanceof jwt.JsonWebTokenError
            ) {
              return { verify_iat: false };
            }
            throw error;
          }
        }
      }

      return { verify_iat: false };
    } catch (ex) {
      Logger.error(String(ex));
      return { verify_iat: false };
    }
  }
}
