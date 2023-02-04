import { CalendarEvent } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../../lib/initializeClients";

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

  const title = req.body.title || event.title;
  const description = req.body.description || event.description;
  const startTime = req.body.startTime || event.startTime;
  const endTime = req.body.endTime || event.endTime;

  const updatedEvent: CalendarEvent = await prisma.calendarEvent.update({
    where: {
      id: id,
    },
    data: {
      description: description,
      title: title,
      startTime: startTime,
      endTime: endTime,
    },
  });

  res.status(200).json(updatedEvent);
}
