import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import axios from 'axios';
// import { INVENTORY_URL } from '@/config';

const getRoomDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const room = await prisma.room.findUnique({
            where: { id },
        });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }


        // await prisma.room.update({
        //     where: { id: room.id },
        // data: {
        //     inventoryId: inventory.id,
        // },
        // });
        // console.log(
        //     'Product updated successfully with inventory id',
        //     inventory.id
        // );

        return res.status(200).json({
            ...room
        })

    } catch (err) {
        next(err);
    }
};

export default getRoomDetails;
