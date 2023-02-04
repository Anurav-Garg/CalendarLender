import { Calendar } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../lib/initializeClients";

export default async function (req: Request, res: Response) {
  const { name }: { name: string } = req.body;
  const username: string = req.session.auth?.username as string;
  if (!name) {
    res.status(400).json({
      message: "Calendar name is required",
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
