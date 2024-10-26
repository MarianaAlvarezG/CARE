module.exports = function override(config, env) {
  if (env === 'development') {
    config.devServer = {
      ...config.devServer,
      public: 'https://care-l90v.onrender.com/', // Set this to your public domain or IP
      disableHostCheck: true, // Optional: Disable host check for development
    };
  }
  return config;
}; 
