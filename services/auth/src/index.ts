import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import {
    userLogin,
    userRegistration,
    verifyEmail,
    verifyToken,
} from './controllers';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});

// routes
app.post('/register', userRegistration);
app.post('/login', userLogin);
app.post('/verify-token', verifyToken);
app.post('/verify-email', verifyEmail);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5001;
const serviceName = process.env.SERVICE_NAME || 'Auth-Service';

app.listen(port, () => {
    console.log(`${serviceName} is running on port ${port}`);
});
