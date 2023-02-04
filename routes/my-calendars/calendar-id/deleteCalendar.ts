import { Calendar } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  const deletedCalendar: Calendar | null = await prisma.calendar.delete({
    where: { id: req.calendarId },
  });

  res.status(200).json(deletedCalendar);
}
