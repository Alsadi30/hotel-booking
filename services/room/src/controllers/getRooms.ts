import prisma from '@/prisma';
import { Request, Response, NextFunction } from 'express';

const getRooms = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("Request Header", { userId: req.headers['x-user-id'], email: req.headers['x-user-email'] })

        console.log(req.query)
        let quer = {}
        Object.keys(req.query).forEach((query) => {
            quer[query] = req.query[query]
        })
        console.log(quer)
        const rooms = await prisma.room.findMany({
            where: {
                ...quer
            },
        });

        // TODO: Implement pagination
        // TODO: Implement filtering

        res.json({ data: rooms });
    } catch (err) {
        next(err);
    }
};

export default getRooms;
