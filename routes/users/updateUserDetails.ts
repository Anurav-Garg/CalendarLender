import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../../lib/initializeClients";
import UserSchema from "../../types/zodSchemas/user";

export default async function (req: Request, res: Response) {
  if (!req.session.auth) {
    res
      .status(401)
      .json({ message: "User not logged in, or session was timed out." });
    return;
  }

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

  if (user.username && user.username !== req.session.auth.username) {
    const existingUser: User | null = await prisma.user.findUnique({
      where: { username: user.username },
    });

    if (existingUser) {
      res.status(400).json({ message: "That username has already been taken" });
      return;
    }
  }

  const oldUser: User | null = await prisma.user.findUnique({
    where: { username: req.session.auth.username },
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
    where: { username: req.session.auth.username },
    data: { username: username, name: name, password: password },
  });

  req.session.regenerate(() => {
    req.session.auth = { username: username };
    res.status(200).json({
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
    });
  });
}
