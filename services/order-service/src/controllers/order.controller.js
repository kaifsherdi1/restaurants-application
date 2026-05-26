const Order = require('../models/Order');
const { publishEvent } = require('../config/rabbitmq');
const logger = require('../utils/logger');

/**
 * Generate WhatsApp message text for order
 */
const generateWhatsAppMessage = (order) => {
  const items = order.items.map((item, i) =>
    `${i + 1}. ${item.quantity}x ${item.name} — ₹${((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}`
      + (item.customizations?.length
        ? `\n   (${item.customizations.map(c => c.option).join(', ')})`
        : '')
  ).join('\n');

  const address = order.deliveryAddress?.fullAddress || order.deliveryAddress?.city || 'Not provided';

  const message = `Hello ${order.restaurantName} 👋

I would like to place an order:

${items}

━━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
${order.deliveryFee > 0 ? `Delivery Fee: ₹${order.deliveryFee}\n` : ''}${order.discount > 0 ? `Discount: -₹${order.discount}\n` : ''}*Total: ₹${order.totalAmount.toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━

👤 Customer: ${order.customerName}
📱 Phone: ${order.customerPhone || 'Not provided'}
📍 Address: ${address}
${order.orderType === 'pickup' ? '🏃 Order Type: Self Pickup\n' : ''}${order.specialInstructions ? `📝 Instructions: ${order.specialInstructions}\n` : ''}
🔖 Order #${order.orderNumber}

Please confirm availability and estimated delivery time. 🙏`;

  return message;
};

/**
 * Generate WhatsApp URL
 */
const generateWhatsAppUrl = (phoneNumber, message) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const withCountryCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
};

// POST /api/v1/orders
const createOrder = async (req, res) => {
  const customerId = req.headers['x-user-id'];

  const orderData = {
    ...req.body,
    customerId: customerId || 'guest',
    status: 'pending'
  };

  // Calculate totals
  const subtotal = req.body.items.reduce((sum, item) => {
    const price = item.discountedPrice || item.price;
    const customCost = item.customizations?.reduce((s, c) => s + (c.additionalPrice || 0), 0) || 0;
    return sum + (price + customCost) * item.quantity;
  }, 0);

  orderData.subtotal = subtotal;
  orderData.totalAmount = subtotal + (orderData.deliveryFee || 0) - (orderData.discount || 0);

  const order = await Order.create(orderData);

  // Generate WhatsApp message
  const message = generateWhatsAppMessage(order);
  const whatsappUrl = generateWhatsAppUrl(order.restaurantWhatsapp, message);

  order.whatsappUrl = whatsappUrl;
  order.whatsappMessageSent = true;
  await order.save();

  // Publish to analytics
  await publishEvent('order.created', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    restaurantId: order.restaurantId,
    customerId: order.customerId,
    totalAmount: order.totalAmount,
    items: order.items.map(i => ({ menuItemId: i.menuItemId, name: i.name, quantity: i.quantity }))
  });

  logger.info(`✅ Order created: ${order.orderNumber} → WhatsApp: ${order.restaurantName}`);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order,
      whatsappUrl,
      whatsappMessage: message
    }
  });
};

// GET /api/v1/orders/my
const getMyOrders = async (req, res) => {
  const customerId = req.headers['x-user-id'];
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find({ customerId }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    Order.countDocuments({ customerId })
  ]);

  res.json({
    success: true,
    data: { orders, pagination: { total, page: parseInt(page), limit: parseInt(limit) } }
  });
};

// GET /api/v1/orders/restaurant/:restaurantId
const getRestaurantOrders = async (req, res) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 20, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { restaurantId };
  if (status) query.status = status;

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    Order.countDocuments(query)
  ]);

  res.json({ success: true, data: { orders, pagination: { total, page: parseInt(page), limit: parseInt(limit) } } });
};

// GET /api/v1/orders/:id
const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: { order } });
};

// PATCH /api/v1/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  await publishEvent('order.status_updated', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    restaurantId: order.restaurantId,
    customerId: order.customerId,
    status
  });

  res.json({ success: true, data: { order } });
};

// POST /api/v1/orders/whatsapp-url
const generateWhatsAppOrderUrl = async (req, res) => {
  const { items, restaurantName, restaurantWhatsapp, customerName, customerPhone, address, instructions, orderType } = req.body;

  const subtotal = items.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0);
  const itemsText = items.map((item, i) =>
    `${i + 1}. ${item.quantity}x ${item.name} — ₹${((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}`
  ).join('\n');

  const message = `Hello ${restaurantName} 👋

I would like to place an order:

${itemsText}

━━━━━━━━━━━━━━━━━━━━
*Total: ₹${subtotal.toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━

👤 Customer: ${customerName}
${customerPhone ? `📱 Phone: ${customerPhone}\n` : ''}📍 Address: ${address || 'Not provided'}
${orderType === 'pickup' ? '🏃 Order Type: Self Pickup\n' : ''}${instructions ? `📝 Instructions: ${instructions}\n` : ''}
Please confirm availability and delivery time. 🙏`;

  const url = generateWhatsAppUrl(restaurantWhatsapp, message);
  res.json({ success: true, data: { url, message } });
};

// GET /api/v1/orders/analytics/restaurant/:restaurantId
const getOrderAnalytics = async (req, res) => {
  const { restaurantId } = req.params;
  const { period = '7d' } = req.query;

  const days = period === '30d' ? 30 : period === '7d' ? 7 : 1;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalRevenue, orderCount, topItems] = await Promise.all([
    Order.aggregate([
      { $match: { restaurantId, createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ restaurantId, createdAt: { $gte: startDate } }),
    Order.aggregate([
      { $match: { restaurantId, createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', count: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])
  ]);

  res.json({
    success: true,
    data: {
      totalRevenue: totalRevenue[0]?.total || 0,
      orderCount,
      topItems,
      period
    }
  });
};

module.exports = {
  createOrder, getMyOrders, getRestaurantOrders, getOrder,
  updateOrderStatus, generateWhatsAppOrderUrl, getOrderAnalytics
};
