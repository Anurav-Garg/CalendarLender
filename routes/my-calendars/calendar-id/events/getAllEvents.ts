import { CalendarEvent } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  const events: CalendarEvent[] = await prisma.calendarEvent.findMany({
    where: { calendarId: req.calendarId },
  });

  res.status(200).json(events);
}
