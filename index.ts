import express, { application } from "express";
import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import { RedisStore } from "connect-redis";
import * as dotenv from "dotenv";
dotenv.config();

const app: express.Application = express();
const port: number = 3000;
const redisStore: RedisStore = connectRedis(session);
const redisClient = createClient({
  legacyMode: true, // Apparently needed for connect-redis to work right
  socket: { port: 6379 },
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});
redisClient.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: new redisStore({ client: redisClient }),
    secret: process.env.SECRET_KEY as string,
    resave: false, // As redis implements the touch method (I think) this should be unnecessary
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message:
      "Hello, welcome to the Calendar Lender API. One day when documentation for it exists, this endpoint will lead to it.",
  });
});

import userRouter from "./routes/users";
app.use("/users", userRouter);

import myCalendarsRouter from "./routes/my-calendars";
app.use("/my-calendars", myCalendarsRouter);

app.listen(port, () => {
  console.log("Server started on port " + port);
});
