import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma: PrismaClient = new PrismaClient();

const redisClient = createClient();

redisClient.on("error", function (err) {
  console.log(
    "Main Client: Could not establish a connection with redis. " + err
  );
});
redisClient.on("connect", function (err) {
  console.log("Main Client: Connected to redis successfully");
});
redisClient.connect();

export { prisma, redisClient };
