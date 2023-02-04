import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  const user: User = await prisma.user.delete({
    where: {
      username: req.session.auth?.username,
    },
  });

  if (!user) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }

  req.session.destroy(() => {
    res
      .status(200)
      .json({ username: user.username, email: user.email, name: user.name });
  });
}
