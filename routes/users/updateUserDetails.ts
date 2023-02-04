import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { fromZodError } from "zod-validation-error";
import { prisma, redisClient } from "../../lib/initializeClients";
import UserSchema from "../../types/zodSchemas/user";
import * as dotenv from "dotenv";
dotenv.config();

export default async function (req: Request, res: Response) {
  const user = { name: "", password: "", username: "", email: "" };
  ({
    name: user.name,
    password: user.password,
    username: user.username,
    email: user.email,
  } = req.body);

  if (user.email) {
    res.status(400).json({ message: "User email can not be changed" });
    return;
  }

  const parsed = UserSchema.partial().safeParse(user);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid input",
      error: fromZodError(parsed.error),
    });
    return;
  }

  if (user.username && user.username !== req.username) {
    const existingUser: User | null = await prisma.user.findUnique({
      where: { username: user.username },
    });

    if (existingUser) {
      res.status(400).json({ message: "That username has already been taken" });
      return;
    }
  }

  const oldUser: User | null = await prisma.user.findUnique({
    where: { username: req.username },
  });

  if (!oldUser) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }

  const username = user.username || oldUser.username;
  const password =
    (user.password ? await hash(user.password, 10) : false) || oldUser.password;
  const name = user.name || oldUser.name;

  const newUser: User = await prisma.user.update({
    where: { username: req.username },
    data: { username: username, name: name, password: password },
  });

  if (req.cookies.token) {
    await redisClient.del(req.cookies.token);
  }

  const token: string = sign(
    { username: username },
    process.env.TOKEN_KEY as string,
    {
      expiresIn: 10 * 60,
    }
  );

  await redisClient.set(token, 1, { EX: 10 * 60 });

  res.cookie("token", token);
  res.status(200).json({
    username: newUser.username,
    email: newUser.email,
    name: newUser.name,
  });
}
