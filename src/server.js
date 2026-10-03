import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

const app = express();
// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;
//Логер першим — бачить усі запити
app.use(logger);
// Middleware для парсингу тіла JSON
app.use(express.json());
// Дозволяє запити з будь-яких джерел
app.use(cors());
app.use(cookieParser());

app.use(authRoutes);
app.use(notesRoutes);

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);
// обробка помилок від celebrate (валідація)
app.use(errors());
// Error — якщо під час запиту виникла помилка
app.use(errorHandler);
await connectMongoDB();
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
