import prisma from '../prisma';
import { Request, Response, NextFunction } from 'express';


const getRooms = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        let ID = req.body.hotelId
        const rooms = await prisma.room.findMany({ where: { hotel_id: ID } });
        res.json({ data: rooms });

    } catch (err) {
        console.log(err)
        next(err);
    }
};

export default getRooms;
