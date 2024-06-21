import prisma from '@/prisma';
import { HotelUpdateDTOSchema } from '@/schemas';
import { Request, Response, NextFunction } from 'express';

const updateHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // verify if the request body is valid
        const parsedBody = HotelUpdateDTOSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }

        // check if the hotel exists
        const hotel = await prisma.hotel.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!hotel) {
            return res.status(404).json({ message: 'hotel not found' });
        }

        // update the hotel
        const updatedHotel = await prisma.hotel.update({
            where: {
                id: req.params.id,
            },
            data: parsedBody.data,
        });

        res.status(200).json({ data: updatedHotel });
    } catch (error) {
        next(error);
    }
};

export default updateHotel;
