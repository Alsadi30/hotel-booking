import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import axios from 'axios';
import sendToQueue from '@/queue';
// import { INVENTORY_URL } from '@/config';

const getHotelDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const hotel = await prisma.hotel.findUnique({
            where: { id },
        });

        if (!hotel) {
            return res.status(404).json({ message: 'hotel not found' });
        }

        // Send a message to the queue and wait for the response
        const roomsResponse = await sendToQueue('get-rooms', JSON.stringify({ hotelId: id }));

        // Process the rooms response as needed
        const rooms = JSON.parse(roomsResponse);
        console.log(rooms.body.data)

        return res.status(200).json({
            ...hotel,
            rooms: rooms.body.data
        });
    } catch (err) {
        next(err);
    }
};

export default getHotelDetails
    ;
