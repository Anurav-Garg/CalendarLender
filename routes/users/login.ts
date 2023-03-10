import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { prisma, redisClient } from "../../lib/initializeClients";
import { sign } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export default async function (req: Request, res: Response) {
  const {
    email,
    password,
  }: { email: string | undefined; password: string | undefined } = req.body;

  if (!(email && password)) {
    res.status(400).json({
      message: "Both Email and Password are required",
    });
    return;
  }

  const existingUser: User | null = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!existingUser) {
    res.status(404).json({ message: `No user found with email "${email}"` });
    return;
  }

  if (!(await compare(password, existingUser.password))) {
    res.status(400).json({ message: "Incorrect password" });
    return;
  }

  const token: string = sign(
    { username: existingUser.username },
    process.env.TOKEN_KEY as string,
    {
      expiresIn: parseInt(process.env.SESSION_TIMEOUT as string),
    }
  );

  await redisClient.set(token, 1, {
    EX: parseInt(process.env.SESSION_TIMEOUT as string),
  });

  if (req.cookies.token) {
    await redisClient.del(req.cookies.token);
  }

  res.cookie("token", token);
  res
    .status(200)
    .json({ message: "Logged in and created session successfully" });
}
