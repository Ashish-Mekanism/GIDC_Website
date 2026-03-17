import { Request } from 'express';
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import Config from '../config';
import crypto from 'crypto';
import dayjs from 'dayjs';
interface TokenPayload {
  userId: string;
}

class TokenService {
  protected readonly tokenExpiry: string;
  protected readonly tokenSecret: string;

  constructor(expiry: string, secret: string) {
    this.tokenExpiry = expiry;
    this.tokenSecret = secret;
  }
  static ExtractTokenFromHeader(req: Request) {
    return req['headers']['authorization']?.split(' ')[1];
  }
  // protected generateToken(payload: TokenPayload): string {
  //   return jwt.sign(payload, this.tokenSecret as string, { expiresIn: this.tokenExpiry as string });
  // }
  protected generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.tokenSecret, { 
        expiresIn: this.tokenExpiry as jwt.SignOptions['expiresIn']
    });
}

  protected verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.tokenSecret) as JwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new Error('Invalid token');
      } else if (error instanceof NotBeforeError) {
        throw new Error('Token not active');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  public generateCryptoToken(tokenSize: number) {
    return crypto.randomBytes(tokenSize).toString('hex');
  }
  //time will be in milliseconds
  public createCryptoTokenExpiry(
    duration: number,
    unit: dayjs.ManipulateType
  ): string {
    return dayjs().add(duration, unit).toISOString();
  }
  public checkCryptoTokenExpiry(time: Date) {
    const currentTimestamp = Date.now();
    const expiryTimestamp = new Date(time).getTime();
    return currentTimestamp > expiryTimestamp;
  }
}

class UserTokenService extends TokenService {
  constructor() {
    super(Config.JWT_TOKEN.USER.EXPIRY, Config.JWT_TOKEN.USER.SECRET);
  }

  public generateUserAccessToken(payload: TokenPayload): string {
    return this.generateToken(payload);
  }

  public verifyUserAccessToken(token: string): JwtPayload {
    return this.verifyToken(token);
  }
}

class AdminTokenService extends TokenService {
  constructor() {
    super(Config.JWT_TOKEN.ADMIN.EXPIRY, Config.JWT_TOKEN.ADMIN.SECRET);
  }

  public generateAdminAccessToken(payload: TokenPayload): string {
    return this.generateToken(payload);
  }

  public verifyAdminAccessToken(token: string): JwtPayload {
    return this.verifyToken(token);
  }
}

export { TokenService, UserTokenService, AdminTokenService };
