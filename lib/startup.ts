import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import { RedisStore } from "connect-redis";
import * as dotenv from "dotenv";
dotenv.config();

const maxAge: number = 1000 * 60 * 10;

const app: express.Application = express();
const redisStore: RedisStore = connectRedis(session);
const redisClientLegacy = createClient({
  legacyMode: true, // Apparently needed for connect-redis to work right
  socket: { port: 6379 },
});

redisClientLegacy.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClientLegacy.on("connect", function (err) {
  console.log("Connected to redis successfully");
});
redisClientLegacy.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: new redisStore({ client: redisClientLegacy }),
    secret: process.env.SECRET_KEY as string,
    resave: false, // As redis implements the touch method (I think) this should be unnecessary
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: maxAge,
    },
  })
);

export {app};