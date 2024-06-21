import prisma from '@/prisma';
import sendToQueue from '@/queue';
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

        // TODO: Check the booking sessionId is valid or not

        // update the hotel
        const updatedBooking = await prisma.booking.update({
            where: {
                id: req.params.id,
            },
            data: {
                booking_status: "Confirmed"
            }
        });

        // send confirmation email 
        sendToQueue('send-email', JSON.stringify(updatedBooking))

        res.status(200).json({ data: updatedBooking });
    } catch (error) {
        next(error);
    }
};

export default confirmBooking;
