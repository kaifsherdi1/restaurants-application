const Analytics = require('../models/Analytics');

const getDashboard = async (req, res) => {
  const { restaurantId } = req.params;
  const { period = '7d' } = req.query;
  const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [revenueData, dailyOrders, topItems, totalOrders] = await Promise.all([
    Analytics.aggregate([
      { $match: { restaurantId, eventType: 'order', date: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Analytics.aggregate([
      { $match: { restaurantId, eventType: 'order', date: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: 1 }, revenue: { $sum: '$amount' } } }
    ]),
    Analytics.aggregate([
      { $match: { restaurantId, eventType: 'order', date: { $gte: startDate } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } }, { $limit: 5 }
    ]),
    Analytics.countDocuments({ restaurantId, eventType: 'order' })
  ]);

  res.json({
    success: true,
    data: {
      revenueData,
      totalRevenue: dailyOrders[0]?.revenue || 0,
      totalOrdersInPeriod: dailyOrders[0]?.total || 0,
      totalOrdersAllTime: totalOrders,
      topItems,
      period
    }
  });
};

const getPlatformStats = async (req, res) => {
  const [totalOrders, totalRevenue, dailyRevenue] = await Promise.all([
    Analytics.countDocuments({ eventType: 'order' }),
    Analytics.aggregate([{ $match: { eventType: 'order' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Analytics.aggregate([
      { $match: { eventType: 'order', date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({
    success: true,
    data: { totalOrders, totalRevenue: totalRevenue[0]?.total || 0, dailyRevenue }
  });
};

module.exports = { getDashboard, getPlatformStats };
