import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.practicemaestro.app',
  appName: 'Practice Maestro',
  webDir: '../web/out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config; 