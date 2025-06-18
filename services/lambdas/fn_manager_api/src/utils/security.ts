import jwt from 'jsonwebtoken';
import { JWT_KEY } from './env';

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
}
