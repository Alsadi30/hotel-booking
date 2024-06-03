import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import {
	createRoom,
	getRoomDetails,
	getRooms,
	updateRoom,
} from './controllers';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));



app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'UP' });
});


app.get('/rooms/:id', getRoomDetails);
app.put('/rooms/:id', updateRoom);
app.get('/rooms', getRooms);
app.post('/rooms', createRoom);

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5005;
const serviceName = process.env.SERVICE_NAME || 'Room-Service';

app.listen(port, () => {
	console.log(`${serviceName} is running on port ${port}`);
});
