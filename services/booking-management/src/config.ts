import dotenv from 'dotenv';
dotenv.config({
    path: '.env',
});

export const REDIS_PORT = process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT)
    : 6379;
export const BOOKING_TTL = 20

export const REDIS_HOST = process.env.REDIS_HOST || 'host.docker.internal';

export const ROOM_SERVICE =
    process.env.ROOM_SERVICE_URL || 'http://host.docker.internal:6005';
export const EMAIL_SERVICE =
    process.env.EMAIL_SERVICE_URL || 'http://host.docker.internal:6003';

export const QUEUE_URL = process.env.QUEUE_URL || 'amqp://host.docker.internal';