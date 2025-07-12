import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressLayouts from 'express-ejs-layouts';
import 'dotenv/config';
import { fileURLToPath } from 'url';

// Session Imports
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

// Route Imports
import indexRouter from './routes/index.routes.js';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Initialize Redis Store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'kipux-ai-app:',
});

// Session Middleware Setup
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'your-default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(expressLayouts); // Removing layouts completely
// app.set('layout', 'layout'); // We will set layout on a per-router basis

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: `Error ${err.status || 500}` });
});

export default app;
