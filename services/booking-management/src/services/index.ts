
import { ROOM_SERVICE } from '@/config';
import redis from '@/redis';
import axios from 'axios';

export const clearBooking = async (id: string) => {
	try {
		const data: object = await redis.hgetall(`booking:${id}`);
		if (Object.keys(data).length === 0) {
			return;
		}

		const roomIds = Object.values(data).map(value => JSON.parse(value))

		await Promise.all(
			Object.values(roomIds[0].room_id).map(async (id) => {
				await axios.put(
					`${ROOM_SERVICE}/rooms/${id}`,
					{
						actionType: 'OUT',
					}
				);
			})
		)


		// clear the booking
		await redis.del(`booking:${id}`);
	} catch (error) {
		console.log(error);
	}
};
