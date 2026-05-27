FROM node:20-alpine

# Install PM2 globally
RUN npm install -g pm2

WORKDIR /app

# ── Copy ALL package.json files first (layer caching) ──────────────
COPY package*.json ./
COPY load-balancer/package*.json ./load-balancer/
COPY api-gateway/package*.json ./api-gateway/
COPY services/auth-service/package*.json ./services/auth-service/
COPY services/restaurant-service/package*.json ./services/restaurant-service/
COPY services/menu-service/package*.json ./services/menu-service/
COPY services/cart-service/package*.json ./services/cart-service/
COPY services/order-service/package*.json ./services/order-service/
COPY services/user-service/package*.json ./services/user-service/
COPY services/review-service/package*.json ./services/review-service/
COPY services/location-service/package*.json ./services/location-service/
COPY services/analytics-service/package*.json ./services/analytics-service/
COPY services/notification-service/package*.json ./services/notification-service/

# ── Install dependencies ────────────────────────────────────────────
RUN npm install --omit=dev
RUN cd load-balancer && npm install --omit=dev
RUN cd api-gateway && npm install --omit=dev
RUN cd services/auth-service && npm install --omit=dev
RUN cd services/restaurant-service && npm install --omit=dev
RUN cd services/menu-service && npm install --omit=dev
RUN cd services/cart-service && npm install --omit=dev
RUN cd services/order-service && npm install --omit=dev
RUN cd services/user-service && npm install --omit=dev
RUN cd services/review-service && npm install --omit=dev
RUN cd services/location-service && npm install --omit=dev
RUN cd services/analytics-service && npm install --omit=dev
RUN cd services/notification-service && npm install --omit=dev

# ── Copy all source code ────────────────────────────────────────────
COPY . .

# ── Expose main gateway port ────────────────────────────────────────
EXPOSE 10000

# ── Start all microservices via PM2 ────────────────────────────────
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
