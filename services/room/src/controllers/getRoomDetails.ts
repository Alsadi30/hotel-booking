import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import axios from 'axios';
// import { INVENTORY_URL } from '@/config';

const getRoomDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let id = req.params?.id;

        if (!id) {
            id = req.body.roomId
        }
        const room = await prisma.room.findUnique({
            where: { id },
        });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({
            ...room
        })

    } catch (err) {
        next(err);
    }
};

export default getRoomDetails;
