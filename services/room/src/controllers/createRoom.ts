import prisma from '../prisma';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { RoomCreateDTOSchema } from '../schemas';
// import { INVENTORY_URL } from '@/config';

const createRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate request body
        const parsedBody = RoomCreateDTOSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({
                    message: 'Invalid request body',
                    errors: parsedBody.error.errors,
                });
        }

        // check if room with the same number already exists
        const existingRoom = await prisma.room.findFirst({
            where: {
                hotel_id: parsedBody.data.hotel_id,
                room_number: parsedBody.data.room_number,
            },
        });

        if (existingRoom) {
            return res
                .status(400)
                .json({ message: 'Room with the same number already exists' });
        }

        // Create Room
        const room = await prisma.room.create({
            data: parsedBody.data
        });

        res.status(201).json({ ...room });

    } catch (err) {
        next(err);
    }
};

export default createRoom;
