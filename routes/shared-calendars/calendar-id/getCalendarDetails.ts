import { Request, Response } from "express";
import { prisma } from "../../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  const metadata = await prisma.calendar.findUnique({
    where: { id: req.calendarId },
    select: {
      ownerUsername: true,
      CalendarEvent: true,
      _count: {
        select: { CalendarEvent: true },
      },
    },
  });

  res.status(200).json({
    id: req.calendarId,
    ownerUsername: metadata?.ownerUsername,
    numberOfEvents: metadata?._count.CalendarEvent,
    events: metadata?.CalendarEvent,
  });
}
