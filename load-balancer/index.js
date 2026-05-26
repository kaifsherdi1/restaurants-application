/**
 * FoodRush – Node.js Load Balancer & API Gateway
 * Round-robin load balancing for microservices
 * Port: 3000
 */
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

// ── Service registry (each service can have multiple instances) ──
const services = {
  '/api/v1/auth':        { instances: ['http://localhost:3001'], current: 0 },
  '/api/v1/restaurants': { instances: ['http://localhost:3003'], current: 0 },
  '/api/v1/menu':        { instances: ['http://localhost:3004'], current: 0 },
  '/api/v1/cart':        { instances: ['http://localhost:3006'], current: 0 },
  '/api/v1/orders':      { instances: ['http://localhost:3007'], current: 0 },
  '/api/v1/reviews':     { instances: ['http://localhost:3010'], current: 0 },
  '/api/v1/analytics':   { instances: ['http://localhost:3009'], current: 0 },
  '/api/v1/users':       { instances: ['http://localhost:3002'], current: 0 },
};

// Round-robin selector
function getTarget(serviceKey) {
  const svc = services[serviceKey];
  if (!svc) return null;
  const target = svc.instances[svc.current % svc.instances.length];
  svc.current++;
  return target;
}

// Match route prefix
function matchService(url) {
  const sorted = Object.keys(services).sort((a, b) => b.length - a.length);
  return sorted.find(prefix => url.startsWith(prefix)) || null;
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-user-id,x-user-role');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      service: 'load-balancer',
      timestamp: new Date().toISOString(),
      routes: Object.keys(services)
    }));
  }

  const serviceKey = matchService(req.url);
  const target = getTarget(serviceKey);

  if (!target) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, message: `No service found for ${req.url}` }));
  }

  console.log(`[LB] ${req.method} ${req.url} → ${target}`);

  proxy.web(req, res, { target, changeOrigin: true }, (err) => {
    console.error(`[LB] Proxy error for ${target}: ${err.message}`);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Service unavailable', service: serviceKey }));
  });
});

const PORT = process.env.GATEWAY_PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Load Balancer running on http://localhost:${PORT}`);
  console.log(`📋 Registered services:`);
  Object.entries(services).forEach(([route, svc]) => {
    console.log(`   ${route} → ${svc.instances.join(', ')}`);
  });
  console.log('');
});

module.exports = server;
