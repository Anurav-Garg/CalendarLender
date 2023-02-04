import { Calendar } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../../prisma/client";

export default async function (req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({
      message: "New calendar name is required",
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
