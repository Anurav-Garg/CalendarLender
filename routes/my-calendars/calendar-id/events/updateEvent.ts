import { CalendarEvent } from "@prisma/client";
import { Request, Response } from "express";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../../../../lib/initializeClients";
import EventSchema from "../../../../types/zodSchemas/event";

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
    res.status(404).json({
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
  const startTime = req.body.startTime || event.startTime.toISOString();
  const endTime = req.body.endTime || event.endTime.toISOString();

  if (startTime > endTime) {
    res.status(400).json({
      message: "Event start time can't be after end time",
    });
    return;
  }

  const parsed = EventSchema.safeParse({
    description: description,
    title: title,
    startTime: startTime,
    endTime: endTime,
  });

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid input",
      error: fromZodError(parsed.error),
    });
    return;
  }

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
