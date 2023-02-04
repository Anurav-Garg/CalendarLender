import { Calendar } from "@prisma/client";
import { Request, Response } from "express";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../../lib/initializeClients";
import CalendarSchema from "../../types/zodSchemas/calendar";

export default async function (req: Request, res: Response) {
  const { name }: { name: string } = req.body;
  const username: string = req.username as string;

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

  const existingCalendar: Calendar | null = await prisma.calendar.findUnique({
    where: {
      name_ownerUsername: { ownerUsername: username, name },
    },
  });

  if (existingCalendar) {
    res
      .status(400)
      .json({ message: "Calendar with given name already exists" });
    return;
  }

  const calendar: Calendar = await prisma.calendar.create({
    data: {
      name: name,
      ownerUsername: username,
    },
  });

  res.status(201).json(calendar);
}
