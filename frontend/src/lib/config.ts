export type AppMode = 'local' | 'demo';

export function getAppMode(): AppMode {
  if (process.env.NEXT_PUBLIC_LOCAL_MODE === 'true') {
    return 'local';
  }

  if (
    process.env.NODE_ENV === 'development' &&
    (process.env.NEXT_PUBLIC_APP_MODE === 'local' ||
      (typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'))
  ) {
    return 'local';
  }

  return 'demo';
}

export const appConfig = {
  mode: getAppMode(),
  isLocal: getAppMode() === 'local',
  isDemo: getAppMode() === 'demo',

  features: {
    localWelcome: getAppMode() === 'local',
    demoLimitations: getAppMode() === 'demo',
  },

  ui: {
    showLocalWelcome: getAppMode() === 'local',
    appTitle: 'Career Lab',
  },
};

export const isLocalMode = () => appConfig.isLocal;
export const isDemoMode = () => appConfig.isDemo;
