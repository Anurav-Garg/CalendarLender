import { User } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { hash } from "bcryptjs";

export default async function (req: Request, res: Response) {
  const user: User = { name: "", email: "", password: "", username: "" };
  ({
    name: user.name,
    email: user.email,
    password: user.password,
    username: user.username,
  } = req.body);

  if (!(user.username && user.password && user.email && user.name)) {
    res.status(400).json({
      message: "All user info parameters are required",
    });
    return;
  }

  const existingUser1: User | null = await prisma.user.findUnique({
    where: { username: user.username },
  });
  if (existingUser1) {
    res.status(400).json({ message: "Username taken" });
    return;
  }

  const existingUser2: User | null = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (existingUser2) {
    res
      .status(400)
      .json({ message: "Email already registered with another account" });
    return;
  }

  const hashedPassword: string = await hash(user.password, 10);

  const newUser: User = await prisma.user.create({
    data: {
      email: user.email,
      password: hashedPassword,
      name: user.name,
      username: user.username,
    },
  });

  req.session.regenerate((err) => {
    req.session.auth = { username: user.username };
    res
      .status(201)
      .json({ username: user.username, email: user.email, name: user.name });
  });
}
