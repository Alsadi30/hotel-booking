import prisma from '@/prisma';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { HotelCreateDTOSchema } from '@/schemas';
// import { INVENTORY_URL } from '@/config';

const createHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Validate request body
		const parsedBody = HotelCreateDTOSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res
				.status(400)
				.json({
					message: 'Invalid request body',
					errors: parsedBody.error.errors,
				});
		}

		// check if hotel with the same name already exists
		const existingHotel = await prisma.hotel.findFirst({
			where: {
				name: parsedBody.data.name,
			},
		});

		if (existingHotel) {
			return res
				.status(400)
				.json({ message: 'Hotel with the same name already exists' });
		}

		// Create Hotel
		const hotel = await prisma.hotel.create({
			data: parsedBody.data,
		});

		res.status(201).json({ ...hotel });
	} catch (err) {
		next(err);
	}
};

export default createHotel;
