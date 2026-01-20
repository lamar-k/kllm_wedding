FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy .env file if it exists, or use build args
ARG REACT_APP_AZURE_MAPS_SUBSCRIPTION_KEY
ENV REACT_APP_AZURE_MAPS_SUBSCRIPTION_KEY=$REACT_APP_AZURE_MAPS_SUBSCRIPTION_KEY

COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

