import reloaderMiddleware from './express-middleware/reload';

const applyConfig = (config) => {
  if (__SERVER__ && process.env.NODE_ENV == 'development') {
    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      reloaderMiddleware(),
    ];
  }
  return config;
};

export default applyConfig;
