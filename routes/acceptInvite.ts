import { Request, Response } from "express";
import { prisma, redisClient } from "../lib/initializeClients";
import { User } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

interface RequestParams {}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {
  token?: string;
}

export default async function (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) {
  const token: string | undefined = req.query.token;
  if (!token) {
    res.status(400).json({ message: "token is required" });
    return;
  }

  const details: string | null = await redisClient.get(token);

  if (!details) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  const { receiverEmail, calendarId } = JSON.parse(details);

  if (!(receiverEmail && calendarId)) {
    res.status(500).json({
      message: "Error storing details, please contact owner if you see this",
    });
    return;
  }

  const existingUser: User | null = await prisma.user.findUnique({
    where: { email: receiverEmail },
  });

  if (!existingUser || existingUser.username !== req.username) {
    res.status(403).json({
      message:
        "Please log in with the account that the calendar is being shared to",
    });
    return;
  }

  await prisma.calendar.update({
    where: { id: calendarId },
    data: { sharedTo: { connect: [{ email: receiverEmail }] } },
  });

  await redisClient.del(token);

  res.status(201).json({
    message: "User successfully added to calendar share list",
  });
}
