import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.patidost.app',
  appName: 'PatiDost',
  webDir: 'dist',
  server: { androidScheme: 'https' },
};

export default config;
