FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ---------- Desarrollo ----------
FROM base AS development

EXPOSE 3000

CMD ["npm", "start"]

# ---------- Build ----------
FROM base AS build

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ---------- Producción ----------
FROM nginx:alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080