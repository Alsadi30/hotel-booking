import { z } from 'zod';



// export enum ActionType {
// 	"BOOKED",
// 	"IN",
// 	"OUT"
// }

export const RoomCreateDTOSchema = z.object({
	hotel_id: z.string(),
	room_number: z.number(),
	capacity: z.number(),
	room_type: z.string(),
	price_per_day: z.number(),
	discount_price: z.number().optional(),


});

export const RoomUpdateDTOSchema = z.object({
	actionType: z.string(),
});
