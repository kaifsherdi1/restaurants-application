const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis = null;

const connectRedis = async () => {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    redis.on('connect', () => logger.info('✅ Connected to Redis'));
    redis.on('error', (err) => logger.error(`Redis error: ${err.message}`));
  } catch (err) {
    logger.warn('Redis not available, running without cache');
  }
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
