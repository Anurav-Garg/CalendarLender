import { CalendarEvent } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../../../prisma/client";

export default async function (req: Request, res: Response) {
  const { id }: { id: string } = req.body;

  if (!id) {
    res.status(400).json({
      message: "Event ID is required",
    });
    return;
  }

  const event: CalendarEvent | null = await prisma.calendarEvent.findUnique({
    where: { id: id },
  });

  if (!event) {
    res.status(400).json({
      message: "Invalid event ID",
    });
    return;
  }

  if (event.calendarId !== req.calendarId) {
    res
      .status(403)
      .json({ message: "Event does not belong to given calendar" });
    return;
  }

  await prisma.calendarEvent.delete({ where: { id: id } });

  res.status(200).json(event);
}
