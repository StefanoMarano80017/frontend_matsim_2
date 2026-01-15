# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copio solo i file che servono per installare dipendenze
COPY package.json package-lock.json ./

# Installazioni deterministiche
RUN npm ci

# Copio tutto il codice sorgente
COPY . .

# Build produzione Vite
RUN npm run build

# -----------------------------------

# Production stage
FROM nginx:alpine

# Copio i file generati da Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copio la configurazione nginx (path relativo!)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
