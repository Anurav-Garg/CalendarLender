import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../../lib/initializeClients";

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
    res.status(400).json({ message: `No user found with email "${email}"` });
    return;
  }

  if (!(await compare(password, existingUser.password))) {
    res.status(400).json({ message: "Incorrect password" });
    return;
  }

  req.session.regenerate((err) => {
    req.session.auth = { username: existingUser.username };
    res
      .status(200)
      .json({ message: "Logged in and created session successfully" });
  });
}
