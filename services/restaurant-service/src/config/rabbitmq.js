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
      return;
    } catch (err) {
      logger.error(`RabbitMQ attempt ${i + 1}: ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
};

const publishEvent = async (routingKey, data) => {
  if (!channel) return;
  channel.publish('restaurant-saas', routingKey,
    Buffer.from(JSON.stringify({ ...data, timestamp: new Date().toISOString() })),
    { persistent: true });
};

module.exports = { connectRabbitMQ, publishEvent };
