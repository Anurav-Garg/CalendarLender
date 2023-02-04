import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  if (!req.session.auth) {
    res
      .status(401)
      .json({ message: "User not logged in, or session was timed out." });
    return;
  }

  const user: User | null = await prisma.user.findUnique({
    where: {
      username: req.session.auth.username,
    },
  });

  if (!user) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }

  res
    .status(200)
    .json({ username: user.username, email: user.email, name: user.name });
}
