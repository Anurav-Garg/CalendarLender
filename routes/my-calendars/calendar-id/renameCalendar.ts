import { Calendar } from "@prisma/client";
import { Request, Response } from "express";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../../../lib/initializeClients";
import CalendarSchema from "../../../types/zodSchemas/calendar";

export default async function (req: Request, res: Response) {
  const { name } = req.body;

  const parsed = CalendarSchema.safeParse({
    name: name,
  });

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid input",
      error: fromZodError(parsed.error),
    });
    return;
  }

  const updatedCalendar: Calendar | null = await prisma.calendar.update({
    where: { id: req.calendarId },
    data: {
      name: name,
    },
  });

  res.status(200).json(updatedCalendar);
}
