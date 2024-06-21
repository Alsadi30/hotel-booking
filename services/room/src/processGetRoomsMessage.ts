import { Request, Response, NextFunction } from 'express';
import { getRoomDetails, getRooms, updateRoom } from './controllers';

// Mock implementation of the Request object
class MockRequest {
    public body: any;

    constructor(body: any = {}) {
        this.body = body;
    }
}

// Mock implementation of the Response object
class MockResponse {
    private responseBody: any;
    private statusCode: number = 200;
    private headers: Record<string, string> = {};

    json(data: any) {
        this.responseBody = data;
    }

    status(code: number) {
        this.statusCode = code;
        return this;
    }

    send(data: any) {
        this.responseBody = data;
    }

    getResponse() {
        return {
            statusCode: this.statusCode,
            body: this.responseBody,
            headers: this.headers,
        };
    }

    setHeader(name: string, value: string) {
        this.headers[name] = value;
    }
}

// Function to process messages using getRooms
const processGetRoomsMessage = async (message: string, respond: (response: string) => void) => {
    console.log(message)
    const mockReq = new MockRequest(JSON.parse(message)); // Parse message as JSON for request body
    const mockRes = new MockResponse();

    try {
        let msg = JSON.parse(message)
        if (msg["action"] === 'single-get') {
            await getRoomDetails(mockReq as any as Request, mockRes as any as Response, () => { })
            respond(JSON.stringify(mockRes.getResponse()));
        } else if (msg["action"] === "update") {
            console.log('iam calling from if else')
            await updateRoom(mockReq as any as Request, mockRes as any as Response, () => { })
            respond(JSON.stringify(mockRes.getResponse()));
        }
        else {
            // Call getRooms with the mock request and response objects
            await getRooms(mockReq as any as Request, mockRes as any as Response, () => { });

            // Send the response back via RabbitMQ
            respond(JSON.stringify(mockRes.getResponse()));
        }
    } catch (error) {
        console.error('Error processing message:', error);
        // Send error response if there is an issue processing the message
        respond(JSON.stringify({ error: 'Failed to process request', details: error }));
    }
};

export default processGetRoomsMessage;
