import { Request, Response } from "express";
import { prisma, redisClient } from "../lib/initializeClients";
import { User } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

interface RequestParams {}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {
  token?: string;
}

export default async function (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) {
  const token: string | undefined = req.query.token;
  if (!token) {
    res.status(400).json({ message: "token is required" });
    return;
  }

  // TEMP:
  console.log(token);

  const userString: string | null = await redisClient.get(token);
  await redisClient.del(token);

  if (!userString) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  const user = JSON.parse(userString);

  if (!(user.username && user.password && user.email && user.name)) {
    res.status(500).json({
      message:
        "Error storing user details, please contact owner if you see this",
    });
    return;
  }

  const existingUser: User | null =
    (await prisma.user.findUnique({ where: { email: user.email } })) ||
    (await prisma.user.findUnique({ where: { username: user.username } }));

  if (existingUser) {
    res.status(400).json({
      message:
        "Sorry, it looks like another account with this email or username was created before your registration could finish",
    });
    return;
  }

  const newUser: User = await prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
      name: user.name,
      username: user.username,
    },
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    name: newUser.name,
  });
}
