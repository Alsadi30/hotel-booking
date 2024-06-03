import prisma from '@/prisma';
import { Request, Response, NextFunction } from 'express';

const getHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("Request Header", { userId: req.headers['x-user-id'], email: req.headers['x-user-email'] })

        const hotels = await prisma.hotel.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                star_rating: true
            },
        });

        // TODO: Implement pagination
        // TODO: Implement filtering

        res.json({ data: hotels });
    } catch (err) {
        next(err);
    }
};

export default getHotels;
