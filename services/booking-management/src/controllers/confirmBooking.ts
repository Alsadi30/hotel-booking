import prisma from '@/prisma';
import sendToQueue from '@/queue';
// import { HotelUpdateDTOSchema } from '@/schemas';
import { Request, Response, NextFunction } from 'express';

const confirmBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const booking = await prisma.booking.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!booking) {
            return res.status(404).json({ message: 'booking not found' });
        }

        // update the hotel
        const updatedBooking = await prisma.booking.update({
            where: {
                id: req.params.id,
            },
            data: {
                booking_status: "Confirmed"
            }
        });

      

        //TODO: Send Email

        res.status(200).json({ data: updatedBooking });
    } catch (error) {
        next(error);
    }
};

export default confirmBooking;
