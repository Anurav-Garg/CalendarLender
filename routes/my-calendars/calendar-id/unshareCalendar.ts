import { Request, Response } from "express";
import { prisma, redisClient } from "../../../lib/initializeClients";
import { Calendar, User } from "@prisma/client";

export default async function (req: Request, res: Response) {
  const { email }: { email: string } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email ID of the receiver is required" });
    return;
  }

  const shareList = await prisma.calendar.findUnique({
    where: { id: req.calendarId },
    select: { sharedTo: { select: { email: true } } },
  });

  if (!shareList) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }

  if (
    !shareList.sharedTo
      .map((obj) => {
        return obj.email;
      })
      .includes(email)
  ) {
    res.status(400).json({
      message:
        "Calendar has not been shared with that user, or user doesn't exist",
    });
    return;
  }

  await prisma.calendar.update({
    where: { id: req.calendarId },
    data: {
      sharedTo: { disconnect: { email: email } },
    },
  });

  res
    .status(200)
    .json({ message: "User successfully removed from calendar share list" });

  return;
}
