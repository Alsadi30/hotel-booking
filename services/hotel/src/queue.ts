import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

const sendToQueue = async (queue: string, message: string) => {
	const connection = await amqp.connect('amqp://host.docker.internal');
	const channel = await connection.createChannel();

	const exchange = 'hotel';
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
