import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prisma, redisClient } from "../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  const user: User = await prisma.user.delete({
    where: {
      username: req.username,
    },
  });

  if (!user) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }

  const token = req.cookies.token;
  await redisClient.del(token);
  res.clearCookie("token");

  res
    .status(200)
    .json({ username: user.username, email: user.email, name: user.name });
}
