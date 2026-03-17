import BlackListToken from '../models/BlackListToken'

class BlackListTokenService {
  // Add a token to the blacklist
  public async addTokenToBlacklist(
    token: string,
    expiresAt: number
  ): Promise<void> {
    const expireTimeInMilliseconds: Date = new Date(expiresAt * 1000);
    const blackListedToken = new BlackListToken({
      token: token,
      expiresAt: expireTimeInMilliseconds,
    });
    await blackListedToken.save();
  }

  // Check if a token is blacklisted
  public async isTokenBlacklisted(token: string): Promise<boolean> {
    const currentTime = new Date();
    const blackListedToken = await BlackListToken.findOne({
      token: token,
      expiresAt: { $gte: currentTime },
    });
    return !!blackListedToken;
  }
  public async deleteExpiredTokens(): Promise<void> {
    const currentTime = new Date();
    await BlackListToken.deleteMany({
      expiresAt: { $lt: currentTime },
    });
  }
}

export default BlackListTokenService;
