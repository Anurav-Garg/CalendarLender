import { Request, Response } from "express";
import { redisClient } from "../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  const token = req.cookies.token;
  await redisClient.del(token);
  res.clearCookie("token");

  res.status(200).json({ message: "Successfully logged out" });
}
