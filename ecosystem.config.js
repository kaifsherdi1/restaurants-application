module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: './api-gateway/src/index.js',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'auth-service',
      script: './services/auth-service/src/index.js',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'user-service',
      script: './services/user-service/src/index.js',
      env: {
        PORT: 3002,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'restaurant-service',
      script: './services/restaurant-service/src/index.js',
      env: {
        PORT: 3003,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'menu-service',
      script: './services/menu-service/src/index.js',
      env: {
        PORT: 3004,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'cart-service',
      script: './services/cart-service/src/index.js',
      env: {
        PORT: 3006,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'order-service',
      script: './services/order-service/src/index.js',
      env: {
        PORT: 3007,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'notification-service',
      script: './services/notification-service/src/index.js',
      env: {
        PORT: 3008,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'analytics-service',
      script: './services/analytics-service/src/index.js',
      env: {
        PORT: 3009,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'review-service',
      script: './services/review-service/src/index.js',
      env: {
        PORT: 3010,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'location-service',
      script: './services/location-service/src/index.js',
      env: {
        PORT: 3011,
        NODE_ENV: 'production'
      }
    }
  ]
};
