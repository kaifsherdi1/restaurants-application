const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis = null;

const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      logger.warn('No REDIS_URL provided. Running restaurant-service without cache.');
      redis = null;
      return;
    }
    redis = new Redis(process.env.REDIS_URL);
    redis.on('connect', () => logger.info('✅ Connected to Redis'));
    redis.on('error', (err) => {
      logger.error(`Redis error: ${err.message}. Disabling cache fallback.`);
      redis = null;
    });
  } catch (err) {
    logger.warn('Redis not available, running without cache');
    redis = null;
  }
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
