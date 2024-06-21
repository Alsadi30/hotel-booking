import { z } from 'zod';

export const HotelCreateDTOSchema = z.object({
	name: z.string().min(3).max(255),
	description: z.string().max(1000),
	location: z.string().max(1000),
	star_rating: z.number().optional(),

});

export const HotelUpdateDTOSchema = HotelCreateDTOSchema.omit({
	name: true
}).partial();
