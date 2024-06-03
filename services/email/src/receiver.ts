import amqp from 'amqplib';
import { defaultSender, transporter } from './config';
import prisma from './prisma';

const receiveFromQueue = async (
	queue: string,
	callback: (message: string) => void
) => {
	const connection = await amqp.connect('amqp://host.docker.internal');

	const channel = await connection.createChannel();

	const exchange = 'booking';
	await channel.assertExchange(exchange, 'direct', { durable: true });

	const q = await channel.assertQueue(queue, { durable: true });
	await channel.bindQueue(q.queue, exchange, queue);

	channel.consume(
		q.queue,
		(msg) => {
			if (msg) {
				callback(msg.content.toString());
			}
		},
		{ noAck: true }
	);
};

receiveFromQueue('send-email', async (msg) => {
	const parsedBody = JSON.parse(msg);
	const userEmail = 'abd@gmail.com'
	const { id, total_price } = parsedBody;
	const from = defaultSender;
	const subject = 'Booking Confirmation';
	const body = `Thank you for your Booking. Your Booking id is ${id}. Your order total is $${total_price}`;

	const emailOption = {
		from,
		to: userEmail,
		subject,
		text: body,
	};

	// send the email
	const { rejected } = await transporter.sendMail(emailOption);
	if (rejected.length) {
		console.log('Email rejected: ', rejected);
		return;
	}

	await prisma.email.create({
		data: {
			sender: from,
			recipient: userEmail,
			subject: 'Booking Confirmation',
			body,
			source: 'BookingConfirmation',
		},
	});
	console.log('Email sent');
});
