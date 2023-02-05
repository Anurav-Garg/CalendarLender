import { Request, Response } from "express";
import { prisma } from "../../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  await prisma.calendar.update({
    where: { id: req.calendarId },
    data: {
      sharedTo: { disconnect: { username: req.username } },
    },
  });

  res
    .status(200)
    .json({ message: "Successfully removed self from calendar share list" });

  return;
}
