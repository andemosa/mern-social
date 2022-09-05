import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import helmet from 'helmet'
import compress from 'compression'

import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'

import { errorHandler } from "./middleware/errorhandler";
import { invalidRouteHandler } from "./middleware/norouteHandler";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(helmet())
app.use(compress())

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)

app.use(errorHandler);

//If no route is matched by now, it must be a 404
app.use(invalidRouteHandler);

export default app
