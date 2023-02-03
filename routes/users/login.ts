import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../../prisma/client";

export default async function(req: Request, res: Response){
  const {
    username,
    password,
  }: { username: string | undefined; password: string | undefined } = req.body;

  if (!(username && password)) {
    res.status(400).json({
      message:
        "Both Username and Password are required, as well as Application/JSON header",
    });
    return;
  }

  const existingUser: User | null = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!existingUser) {
    res
      .status(400)
      .json({ message: `No user found with username "${username}"` });
    return;
  }

  if (!(await compare(password, existingUser.password))) {
    res.status(400).json({ message: "Incorrect password" });
    return;
  }

  req.session.regenerate((err) => {
    req.session.auth = { username: username };
    res
      .status(200)
      .json({ message: "Logged in and created session successfully" });
  });
}