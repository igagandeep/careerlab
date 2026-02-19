function getAppMode() {
  if (process.env.LOCAL_MODE === 'true') {
    return 'local';
  }

  if (
    process.env.NODE_ENV === 'development' &&
    process.env.APP_MODE === 'local'
  ) {
    return 'local';
  }

  return 'demo';
}

const appConfig = {
  mode: getAppMode(),
  isLocal: getAppMode() === 'local',
  isDemo: getAppMode() === 'demo',

  database: {
    url: 'file:./local.db',
    type: 'sqlite',
  },
};

module.exports = {
  appConfig,
  getAppMode,
  isLocalMode: () => appConfig.isLocal,
  isDemoMode: () => appConfig.isDemo,
};
