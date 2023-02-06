import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { redisClient } from "./initializeClients";
import * as dotenv from "dotenv";
dotenv.config();

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.cookies.token) {
    res.status(401).json({ message: "User not logged in" });
    return;
  }

  const oldToken = await redisClient.get(req.cookies.token);
  if (!oldToken) {
    res.status(401).json({ message: "Session ID invalid or timed out" });
    return;
  }

  await redisClient.del(req.cookies.token);

  try {
    const decoded = verify(
      req.cookies.token,
      process.env.TOKEN_KEY as string
    ) as JwtPayload;

    if (!decoded.username) {
      throw new Error();
    }

    req.username = decoded.username;

    const token: string = sign(
      { username: decoded.username },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: parseInt(process.env.SESSION_TIMEOUT as string),
      }
    );

    await redisClient.set(token, 1, { EX: parseInt(process.env.SESSION_TIMEOUT as string) });

    res.cookie("token", token);
    req.cookies.token = token;
  } catch (err) {
    res.status(500).json({ message: "Something went VERY wrong" });
    return;
  }

  next();
}
