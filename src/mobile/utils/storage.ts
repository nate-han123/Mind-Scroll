import * as SecureStore from 'expo-secure-store';

// Secure storage for sensitive data
export const storage = {
  // Save data securely
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  },

  // Get data securely
  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  // Delete data
  async delete(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  },

  // Save user
  async saveUser(user: any): Promise<void> {
    await this.set('user', JSON.stringify(user));
  },

  // Get user
  async getUser(): Promise<any | null> {
    const userString = await this.get('user');
    return userString ? JSON.parse(userString) : null;
  },

  // Clear user
  async clearUser(): Promise<void> {
    await this.delete('user');
  },

  // Save auth token (if needed)
  async saveToken(token: string): Promise<void> {
    await this.set('auth_token', token);
  },

  // Get auth token
  async getToken(): Promise<string | null> {
    return await this.get('auth_token');
  },

  // Clear all data
  async clearAll(): Promise<void> {
    await this.clearUser();
    await this.delete('auth_token');
  },
};




