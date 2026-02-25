import { JetsApiService } from './api';
import { DEFAULT_AUTHORIZATION_SCHEME } from './constants';

describe('JetsApiService', () => {
  describe('_resolveApiKey', () => {
    it('should return the key when apiKey is a string', () => {
      const service = new JetsApiService('appId', 'static-key', 'https://api.example.com', null);
      const result = service._resolveApiKey();
      expect(result).toBe('static-key');
    });

    it('should call sync callback and return its value when apiKey is a function', () => {
      const callback = jest.fn().mockReturnValue('callback-key');
      const service = new JetsApiService('appId', callback, 'https://api.example.com', null);
      const result = service._resolveApiKey();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(result).toBe('callback-key');
    });
  });

  describe('_getToken with apiKey callback', () => {
    it('should use resolved key from sync callback for auth request', async () => {
      const apiKeyCallback = jest.fn().mockReturnValue('resolved-sync-key');
      const service = new JetsApiService('appId', apiKeyCallback, 'https://api.example.com', null);

      const getDataSpy = jest.spyOn(service, 'getData').mockImplementation(async (url) => {
        if (url.startsWith('auth?')) {
          return { accessToken: 'mock-access-token' };
        }
        return {};
      });

      await service._getToken();

      expect(apiKeyCallback).toHaveBeenCalled();
      expect(getDataSpy).toHaveBeenCalledWith(
        'auth?appId=appId',
        expect.objectContaining({
          headers: {
            authorization: `${DEFAULT_AUTHORIZATION_SCHEME} resolved-sync-key`,
          },
        })
      );

      getDataSpy.mockRestore();
    });
  });
});
