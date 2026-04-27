# Stage 1: Build the frontend
FROM node:20-slim AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build the app
COPY . .
RUN npm run build

# Stage 2: Serve the frontend with Nginx
FROM nginx:stable-alpine as production-stage

# Copy custom nginx config if you had one, otherwise use default
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from build-stage to nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
