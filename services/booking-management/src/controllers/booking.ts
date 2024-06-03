// import { CART_SERVICE, EMAIL_SERVICE, PRODUCT_SERVICE } from '@/config';
import { BOOKING_TTL, EMAIL_SERVICE, ROOM_SERVICE } from '@/config';
import prisma from '@/prisma';
import sendToQueue from '@/queue';
import redis from '@/redis';
import { BookingDTOSchema } from '@/schemas';
// import sendToQueue from '@/queue';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';


const booking = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
                const { data: room } = await axios.get(`${ROOM_SERVICE}/rooms/${id}`)
                return {
                    price: room.price_per_day as number,
                    discount: room.discount_price as number
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
                await axios.put(
                    `${ROOM_SERVICE}/rooms/${id}`,
                    {
                        actionType: 'IN',
                    }
                );
            })
        )
        const user_id = "lsdjflksdj"

        // TODO: will handle tax calculation later
        const tax = 0;
        // const grandTotal = subtotal + tax;

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

        //TODO: Add booking id to Redis



        const bookingSessionId = randomUUID();



        await redis.setex(`sessions:${bookingSessionId}`, BOOKING_TTL, bookingSessionId);



        await redis.hset(
            `booking:${bookingSessionId}`,
            booking.id,
            JSON.stringify(booking)
        );

        let userEmail = "abdullahsadi30@gmail.com"
        //TODO: send email
        // await axios.post(`${EMAIL_SERVICE}/emails/send`, {
        // recipient: parsedBody.data.userEmail,
        // 	subject: 'Order Confirmation',
        // 	body: `Thank you for your order. Your order id is ${order.id}. Your order total is $${grandTotal}`,
        // 	source: 'Checkout',
        // });

        // send to queue
        sendToQueue('send-email', JSON.stringify(booking));
        // sendToQueue(
        // 	'clear-cart',
        // 	JSON.stringify({ cartSessionId: parsedBody.data.cartSessionId })
        // );

        return res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};

export default booking;