import { getMockSettings, saveMockSettings } from './mockMenuStore';

export const settingsService = {
  async get() {
    return getMockSettings();
  },

  async update(settings) {
    return saveMockSettings(settings);
  },
};
