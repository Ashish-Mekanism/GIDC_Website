import bcrypt from 'bcrypt';

class PasswordService {
  private saltRounds = 10;
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  async verifyPassword(
    inputPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw new Error('Failed to verify password');
    }
  }
}

export default PasswordService;
