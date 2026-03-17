// src/middleware/authMiddleware.ts

import { Response, NextFunction } from 'express';
import { UserTokenService, AdminTokenService } from '../services/tokenService';
import ApiError from '../utils/ApiError';
import { ACCOUNT_STATUS, RESPONSE_CODE, USER_TYPE } from '../utils/constants';
import { JwtPayload } from 'jsonwebtoken';
import { CustomRequest } from '../types/common';
import BlackListTokenService from '../services/blackListTokenService'
import UserService from '../services/user';
import { toObjectId } from '../utils/helper';
import AdminService from '../services/admin';
import User from '../models/User';

// Base class for shared functionality
abstract class AuthMiddleware {
  protected tokenService: UserTokenService | AdminTokenService;
  protected blackListTokenService: BlackListTokenService;

  constructor(tokenService: UserTokenService | AdminTokenService) {
    this.tokenService = tokenService;
    this.blackListTokenService = new BlackListTokenService();
  }

  // Abstract method for verifying tokens
  protected abstract verifyToken(token: string): JwtPayload;
  protected abstract getUser(id: string):any;
  

  public authenticate = async (
    req: CustomRequest,
    _res: Response,
    next: NextFunction
  ) => {
    const token = req['headers']['authorization']?.split(' ')[1];
    if (!token) {
      return next(
        new ApiError(RESPONSE_CODE.UNAUTHORIZED, 'Please log in and try again.')
      );
    }
    try {
      const decodedToken = this.verifyToken(token);
      const userId = decodedToken['userId'];
      const { errorMessage = 'Account Inactive Or Deleted', user } =
        await this.getUser(userId);
      if (!user) {
        return next(new ApiError(RESPONSE_CODE.FORBIDDEN, errorMessage));
      }
      const loggedOutSession =
        await this.blackListTokenService.isTokenBlacklisted(token);
      if (loggedOutSession) {
        return next(
          new ApiError(
            RESPONSE_CODE.FORBIDDEN,
            'Session Expired! Please log in again'
          )
        );
      }
      req.user = user; 
      req.user_id = user._id;
      req.account_status = user.account_status;
      req.is_user = user.is_user;
      req.is_admin = user.is_admin;

      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new ApiError(RESPONSE_CODE.FORBIDDEN, error.message));
      }
    }
  };
}

// UserAuthMiddleware extending the base AuthMiddleware class
class UserAuthMiddleware extends AuthMiddleware {
  constructor() {
    super(new UserTokenService());
  }

  protected verifyToken(token: string): JwtPayload {
    return (this.tokenService as UserTokenService).verifyUserAccessToken(token);
  }
  protected async getUser(userId: string) {
    const userService = new UserService();
    const user = await userService.findActiveUserByUserTypeAndId(
      USER_TYPE.USER,
      toObjectId(userId)
    );
    // const user = await userService.findById(
    //   toObjectId(userId)
    // );

    return {
      user,
    };
  }
}


class AdminAuthMiddleware extends AuthMiddleware {
  constructor() {
    super(new AdminTokenService());
  }

  protected verifyToken(token: string): JwtPayload {
    return (this.tokenService as AdminTokenService).verifyAdminAccessToken(
      token
    );
  }
  protected async getUser(userId: string) {
    const adminService = new AdminService();
    const user = await adminService.findActiveUserByUserTypeAndId(
      USER_TYPE.SUPER_ADMIN ,
      toObjectId(userId)
    );
    // const user = await User.findOne({
    //   _id: toObjectId(userId),
    //   is_Admin: true,
    // });
    

    return {
      validUser: true,
      user: user,
    };
  }
}

class AdminOrSubAdminAuthMiddleware extends AuthMiddleware {
  constructor() {
    super(new AdminTokenService());
  }

  protected verifyToken(token: string): JwtPayload {
    return (this.tokenService as AdminTokenService).verifyAdminAccessToken(token);
  }
  protected async getUser(userId: string) {
    const adminService = new AdminService();
    // const user = await userService.findUserByUserTypeAndId(
    //   USER_TYPE.USER,
    //   userId
    // );
    const user = await adminService.findActiveSubAdminByUserTypeAndId(
      [USER_TYPE.SUPER_ADMIN, USER_TYPE.SUB_ADMIN],
      toObjectId(userId));


    return {
      user: user,
    };
  }
}


const userAuth = new UserAuthMiddleware();
const adminAuth = new AdminAuthMiddleware();
 const adminOrSubAdminAuth = new AdminOrSubAdminAuthMiddleware();
// const hostOrUserAuth = new HostOrUserAuthMiddleware();
export { userAuth,adminAuth ,adminOrSubAdminAuth};
