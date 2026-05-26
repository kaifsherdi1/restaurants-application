const amqp = require('amqplib');
const logger = require('../utils/logger');

let channel = null;

const connectRabbitMQ = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      channel = await conn.createChannel();
      await channel.assertExchange('restaurant-saas', 'topic', { durable: true });
      logger.info('✅ Connected to RabbitMQ');
      conn.on('close', () => {
        logger.warn('RabbitMQ connection closed, reconnecting...');
        setTimeout(() => connectRabbitMQ(), 5000);
      });
      return;
    } catch (err) {
      logger.error(`RabbitMQ connection failed (attempt ${i + 1}): ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  logger.warn('Could not connect to RabbitMQ, running without messaging');
};

const publishEvent = async (routingKey, data) => {
  if (!channel) return;
  try {
    channel.publish(
      'restaurant-saas',
      routingKey,
      Buffer.from(JSON.stringify({ ...data, timestamp: new Date().toISOString() })),
      { persistent: true }
    );
    logger.info(`📤 Published event: ${routingKey}`);
  } catch (err) {
    logger.error(`Failed to publish event ${routingKey}: ${err.message}`);
  }
};

module.exports = { connectRabbitMQ, publishEvent };
