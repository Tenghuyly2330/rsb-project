FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# security
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

COPY --chown=nodeuser:nodejs package*.json ./
COPY --chown=nodeuser:nodejs --from=dependencies /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs . .

USER nodeuser

EXPOSE 5000
CMD ["node", "src/server.js"]