import amqp from 'amqplib';
import { QUEUE_URL } from './config';
import { v4 as uuidv4 } from 'uuid';

const sendToQueue = async (queue: string, message: string) => {
	const connection = await amqp.connect(QUEUE_URL);
	const channel = await connection.createChannel();

	const exchange = 'booking';
	await channel.assertExchange(exchange, 'direct', { durable: true });

	const correlationId = uuidv4();
	const responseQueue = await channel.assertQueue('', { exclusive: true }); // Temporary response queue

	// Send message to the queue with replyTo and correlationId
	channel.publish(
		exchange,
		queue,
		Buffer.from(message),
		{
			replyTo: responseQueue.queue,
			correlationId: correlationId,
			contentType: 'application/json',
		}
	);

	console.log(`Sent ${message} to ${queue} with correlationId ${correlationId}`);

	// Return a promise that resolves with the response
	return new Promise<string>((resolve, reject) => {
		channel.consume(
			responseQueue.queue,

			(msg) => {
				if (msg) {
					if (msg?.properties.correlationId === correlationId) {
						console.log(`Received response for correlationId ${correlationId}`);
						resolve(msg.content.toString());
						connection.close();
					}
				}

			},
			{ noAck: true } // Auto acknowledge messages
		);
	});
};

export default sendToQueue;
