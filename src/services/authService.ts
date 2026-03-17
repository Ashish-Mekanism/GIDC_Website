import BlackListTokenService from './blackListTokenService';

abstract class BaseAuthService {
  private blackListTokenService: BlackListTokenService;

  constructor() {
    this.blackListTokenService = new BlackListTokenService();
  }

  public async logout(token: string, expiresAt: number) {
    await this.blackListTokenService.addTokenToBlacklist(token, expiresAt);
  }
}

export default BaseAuthService;
