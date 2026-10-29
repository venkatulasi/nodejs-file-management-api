FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

RUN mkdir -p /app/upload /app/logs \
    && chown -R node:node /app/upload /app/logs

USER  node

EXPOSE 3000

CMD ["node", "app.js"]