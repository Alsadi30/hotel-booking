import { REDIS_HOST, REDIS_PORT } from '@/config';
import { clearBooking } from '../services';
import { Redis } from 'ioredis';

const redis = new Redis({
	host: REDIS_HOST,
	port: REDIS_PORT,
});

const CHANNEL_KEY = '__keyevent@0__:expired';
redis.config('SET', 'notify-keyspace-events', 'Ex');
redis.subscribe(CHANNEL_KEY);

redis.on('message', async (ch, message) => {
	if (ch === CHANNEL_KEY) {
		console.log('Key expired: ', message);
		const bookingKey = message.split(':').pop();
		if (!bookingKey) return;

		clearBooking(bookingKey);
	}
});
