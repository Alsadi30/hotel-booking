import amqp from 'amqplib';
import express from 'express';
import { getRooms } from './controllers'; // Example getRooms function
import processGetRoomsMessage from './processGetRoomsMessage'; // Adapted function to process messages

const receiveFromQueue = async (queue: string) => {
	try {
		const connection = await amqp.connect('amqp://host.docker.internal');
		const channel = await connection.createChannel();

		const exchange = 'hotel';
		await channel.assertExchange(exchange, 'direct', { durable: true });

		const q = await channel.assertQueue(queue, { durable: true });
		await channel.bindQueue(q.queue, exchange, queue);

		console.log(`Waiting for messages in ${q.queue}. To exit press CTRL+C`);

		channel.consume(
			q.queue,
			async (msg) => {
				if (msg) {
					const messageContent = msg.content.toString();
					console.log(`Received message : ${messageContent}`);
					console.log(`Message properties:`, msg.properties);

					// Use the adapted function to process the message
					processGetRoomsMessage(messageContent, (response) => {
						const replyTo = msg.properties.replyTo;
						const correlationId = msg.properties.correlationId;

						if (replyTo) {
							channel.sendToQueue(
								replyTo,
								Buffer.from(response),
								{
									correlationId: correlationId,
									contentType: 'application/json',
								}
							);
							console.log(`Sent response to ${replyTo} with correlationId ${correlationId}`);
						} else {
							console.error(`No replyTo property found in message properties.`);
						}
					});

					channel.ack(msg);
				}
			},
			{ noAck: false }
		);

		process.on('exit', () => {
			channel.close();
			connection.close();
		});

	} catch (error) {
		console.error('Error in RabbitMQ setup:', error);
	}
};

const receiveFromBooking = async (queue: string) => {
	try {
		const connection = await amqp.connect('amqp://host.docker.internal');
		const channel = await connection.createChannel();

		const exchange = 'booking';
		await channel.assertExchange(exchange, 'direct', { durable: true });

		const q = await channel.assertQueue(queue, { durable: true });
		await channel.bindQueue(q.queue, exchange, queue);

		console.log(`Waiting for messages in ${q.queue}. To exit press CTRL+C`);

		channel.consume(
			q.queue,
			async (msg) => {
				if (msg) {
					const messageContent = msg.content.toString();
					console.log(`Received message : ${messageContent}`);
					console.log(`Message properties:`, msg.properties);

					// Use the adapted function to process the message
					processGetRoomsMessage(messageContent, (response) => {
						const replyTo = msg.properties.replyTo;
						const correlationId = msg.properties.correlationId;

						if (replyTo) {
							channel.sendToQueue(
								replyTo,
								Buffer.from(response),
								{
									correlationId: correlationId,
									contentType: 'application/json',
								}
							);
							console.log(`Sent response to ${replyTo} with correlationId ${correlationId}`);
						} else {
							console.error(`No replyTo property found in message properties.`);
						}
					});

					channel.ack(msg);
				}
			},
			{ noAck: false }
		);

		process.on('exit', () => {
			channel.close();
			connection.close();
		});

	} catch (error) {
		console.error('Error in RabbitMQ setup:', error);
	}
};

// Start receiving messages from the queue
receiveFromQueue('get-rooms');
receiveFromBooking('get-room');
receiveFromBooking("update-room")