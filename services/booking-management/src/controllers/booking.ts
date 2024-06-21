// import { CART_SERVICE, EMAIL_SERVICE, PRODUCT_SERVICE } from '@/config';
import { BOOKING_TTL, EMAIL_SERVICE, ROOM_SERVICE } from '@/config';
import prisma from '@/prisma';
import sendToQueue from '@/queue';
import redis from '@/redis';
import { BookingDTOSchema } from '@/schemas';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';


const booking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.headers['x-user-id'] as string
        const email = req.headers['x-user-email'] as string

        // validate request
        const parsedBody = BookingDTOSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }

        const roomIds = parsedBody.data.room_id

        if (!roomIds) {
            return res.status(400).json({ errors: "No Room Id Found" });
        }
        const roomDetails = await Promise.all(
            Object.values(roomIds).map(async (id) => {

                //! HTTP request
                // const { data: room } = await axios.get(`${ROOM_SERVICE}/rooms/${id}`)

                //**   API CALL TO RABBITMQ
                let room: any = await sendToQueue('get-room', JSON.stringify({ roomId: id, action: "single-get" }));
                let ParsedRoom = JSON.parse(room)
                return {
                    price: ParsedRoom.body.price_per_day,
                    discount: ParsedRoom.body.discount_price
                }
            })
        )


        const date1 = new Date(parsedBody.data.check_in_date);
        const date2 = new Date(parsedBody.data.check_out_date);

        const differenceInMilliseconds: number = Math.abs(date2.getTime() - date1.getTime());

        const day = differenceInMilliseconds / (1000 * 60 * 60 * 24)
        const sub = roomDetails.reduce((acc, item) => acc + item.price, 0)
        const discount = roomDetails.reduce((acc, item) => acc + item.discount, 0)

        const subtotal = sub * day

        let total_price = subtotal
        if (discount) {
            total_price = subtotal - discount
        }


        // update room
        await Promise.all(
            Object.values(roomIds).map(async (id) => {
                //! Http request
                // await axios.put(
                //     `${ROOM_SERVICE}/rooms/${id}`,
                //     {
                //         actionType: 'IN',
                //     }
                // );
                await sendToQueue('update-room', JSON.stringify({ roomId: id, actionType: "IN", action: "update" }))
            })
        )

        // create order
        const booking = await prisma.booking.create({
            data: {
                ...parsedBody.data,
                subtotal,
                discount,
                total_price,
                user_id
            }

        });


        const bookingSessionId = randomUUID();

        await redis.setex(`sessions:${bookingSessionId}`, BOOKING_TTL, bookingSessionId);


        await redis.hset(
            `booking:${bookingSessionId}`,
            booking.id,
            JSON.stringify(booking)
        );


        booking.userEmail = email

        //** Sending mail
        sendToQueue('send-email', JSON.stringify(booking));

        return res.status(201).json(booking);

    } catch (error) {
        console.log(error)
        next(error)
    }
};

export default booking;