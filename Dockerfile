FROM node:20-alpine

WORKDIR /app

# Install system deps
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
