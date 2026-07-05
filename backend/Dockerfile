FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ---------- Desarrollo ----------
FROM base AS development

EXPOSE 3001

CMD ["npm", "run", "dev"]

# ---------- Producción ----------
FROM base AS production

EXPOSE 3001

CMD ["npm", "start"]