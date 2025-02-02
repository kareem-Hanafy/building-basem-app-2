import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.basemShamry.app',
  appName: 'باسم الشمري',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['*'],
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    CapacitorFirebaseDynamicLinks: {
      webClientId: 'AIzaSyAtrzsFKs5my3BEsaHWoXVetSOM2Za6XEg',
    },
  },
};

export default config;
