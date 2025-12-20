#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."

# wait for postgres
until nc -z postgres 5432; do
  sleep 1
done

echo "✅ PostgreSQL is ready"

echo "🧹 Running migrate:fresh..."
npm run migrate:fresh

echo "📦 Running migrate..."
npm run migrate

echo "🌱 Running seed..."
npm run seed

echo "🚀 Starting NestJS (dev mode)..."
npm run start:dev
