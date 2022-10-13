import reloaderMiddleware from './express-middleware/reload';

const applyConfig = (config) => {
  if (__SERVER__) {
    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      reloaderMiddleware(),
    ];
  }
  return config;
};

export default applyConfig;
