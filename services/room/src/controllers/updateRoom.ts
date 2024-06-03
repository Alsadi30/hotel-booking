import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { RoomUpdateDTOSchema } from '@/schemas';

const updateRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // check if the room exists
        const { id } = req.params;
        const room = await prisma.room.findUnique({
            where: { id },
        });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // update the room
        const parsedBody = RoomUpdateDTOSchema.safeParse(req.body);
        if (!parsedBody.success) {
            console.log(parsedBody.error.errors)
            return res.status(400).json(parsedBody.error.errors);
        }

        let status;
        // calculate the new quantity
        if (parsedBody.data.actionType === 'IN') {
            status = "Not_Available"
        } else if (parsedBody.data.actionType === 'OUT') {
            status = "Available"
        }
        else {
            console.log("else")
            return res.status(400).json({ message: 'Invalid action type' });
        }

        // update the room
        const updatedRoom = await prisma.room.update({
            where: { id },
            data: {
                availability_status: status,
            },
            select: {
                id: true,
            },
        });

        return res.status(200).json(updatedRoom);
    } catch (error) {
        next(error);
    }
};

export default updateRoom;