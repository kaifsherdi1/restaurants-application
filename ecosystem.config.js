module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: './api-gateway/src/index.js',
      env: {
        PORT: 10000,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        AUTH_SERVICE_URL: 'http://localhost:3001',
        USER_SERVICE_URL: 'http://localhost:3002',
        RESTAURANT_SERVICE_URL: 'http://localhost:3003',
        MENU_SERVICE_URL: 'http://localhost:3004',
        CART_SERVICE_URL: 'http://localhost:3006',
        ORDER_SERVICE_URL: 'http://localhost:3007',
        ANALYTICS_SERVICE_URL: 'http://localhost:3009',
        REVIEW_SERVICE_URL: 'http://localhost:3010',
        LOCATION_SERVICE_URL: 'http://localhost:3011',
      }
    },
    {
      name: 'auth-service',
      script: './services/auth-service/src/index.js',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'user-service',
      script: './services/user-service/src/index.js',
      env: {
        PORT: 3002,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'restaurant-service',
      script: './services/restaurant-service/src/index.js',
      env: {
        PORT: 3003,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'menu-service',
      script: './services/menu-service/src/index.js',
      env: {
        PORT: 3004,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'cart-service',
      script: './services/cart-service/src/index.js',
      env: {
        PORT: 3006,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'order-service',
      script: './services/order-service/src/index.js',
      env: {
        PORT: 3007,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'notification-service',
      script: './services/notification-service/src/index.js',
      env: {
        PORT: 3008,
        NODE_ENV: 'production',
      }
    },
    {
      name: 'analytics-service',
      script: './services/analytics-service/src/index.js',
      env: {
        PORT: 3009,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'review-service',
      script: './services/review-service/src/index.js',
      env: {
        PORT: 3010,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    },
    {
      name: 'location-service',
      script: './services/location-service/src/index.js',
      env: {
        PORT: 3011,
        NODE_ENV: 'production',
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      }
    }
  ]
};
