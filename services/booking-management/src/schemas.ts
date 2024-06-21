import prisma from '@/prisma';
import { z } from 'zod';

const literalSchema = z.union([z.string(), z.string().uuid()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const BookingDTOSchema = z.object({
	room_id: z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
	hotel_id: z.string(),
	check_in_date: z.string().datetime(),
	check_out_date: z.string().datetime(),
});


