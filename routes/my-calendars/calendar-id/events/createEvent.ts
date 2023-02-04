import { CalendarEvent } from "@prisma/client";
import { Request, Response } from "express";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../../../../lib/initializeClients";
import EventSchema from "../../../../types/zodSchemas/event";

export default async function (req: Request, res: Response) {
  const event = { title: "", description: "", startTime: "", endTime: "" };
  ({
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
  } = req.body);

  const parsed = EventSchema.safeParse(event);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid input",
      error: fromZodError(parsed.error),
    });
    return;
  }

  if (event.startTime > event.endTime) {
    res.status(400).json({
      message: "Event start time can't be after end time",
    });
    return;
  }

  const newEvent: CalendarEvent = await prisma.calendarEvent.create({
    data: {
      description: event.description,
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      calendarId: req.calendarId as string,
    },
  });

  res.status(201).json(newEvent);
}
