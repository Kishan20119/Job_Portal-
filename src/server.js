import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { User} from './models/User.js'; 
import applicationRoutes from './routes/applications.js';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Optional middleware to trim newline/space from URL
app.use((req, res, next) => {
  req.url = decodeURIComponent(req.url).trim();
  next();
});

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users.length) {
      return res.status(200).json({ message: 'No users found', data: [] });
    }

    res.status(200).json({ message: 'Users fetched successfully', data: users });
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log( `Server running on port ${PORT}`));
});
