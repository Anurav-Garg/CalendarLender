import { CalendarEvent } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../../../prisma/client";

export default async function (req: Request, res: Response) {
  const {
    title,
    description,
    startTime,
    endTime,
  }: {
    title: string | undefined;
    description: string | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
  } = req.body;

  if (!(title && description && startTime && endTime)) {
    res.status(400).json({
      message: "All event info parameters are required",
    });
    return;
  }

  const startTimeVal: Number = Date.parse(startTime);
  const endTimeVal: Number = Date.parse(endTime);

  if (Number.isNaN(startTimeVal) || Number.isNaN(endTimeVal)) {
    res.status(400).json({
      message:
        'Date(s) not properly formatted, please format them as: "YYYY-MM-DDTHH:mm:ss.sssZ"',
    });
    return;
  }

  if (startTimeVal > endTimeVal) {
    res.status(400).json({
      message: "Event start time can't be after end time",
    });
    return;
  }

  const event: CalendarEvent = await prisma.calendarEvent.create({
    data: {
      description: description,
      title: title,
      startTime: startTime,
      endTime: endTime,
      calendarId: req.calendarId as string,
    },
  });

  res.status(201).json(event);
}
