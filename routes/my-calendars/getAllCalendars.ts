import { Calendar } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";

export default async function (req: Request, res: Response) {
  const username: string = req.session.auth?.username as string;

  const calendars: Calendar[] = await prisma.calendar.findMany({
    where: { ownerUsername: username },
  });

  res.status(200).json(calendars);
}
