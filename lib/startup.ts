import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
dotenv.config();

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

export { app };
