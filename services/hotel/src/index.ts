import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import {
	createHotel,
	getHotelDetails,
	getHotels,
	updateHotel,
} from './controllers';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'UP' });
});


app.get('/hotels/:id', getHotelDetails);
app.put('/hotels/:id', updateHotel);
app.get('/hotels', getHotels);
app.post('/hotels', createHotel);

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5004;
const serviceName = process.env.SERVICE_NAME || 'Product-Service';

app.listen(port, () => {
	console.log(`${serviceName} is running on port ${port}`);
});
