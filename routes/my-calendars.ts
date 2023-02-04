import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/initializeClients";
import {
  createCalendar,
  getAllCalendars,
  calendarIdRouter,
} from "./my-calendars/index";
import { default as auth } from "./_authenticate";

const router: express.Router = express.Router();

router.use(auth);

router.post("/", createCalendar);

router.get("/", getAllCalendars);

router.use("/:calendarId", authorize, calendarIdRouter);

async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.calendarId = req.params.calendarId;

  const calendar = await prisma.calendar.findUnique({
    where: { id: req.calendarId },
  });

  if (!calendar) {
    res.status(404).json({ message: "Invalid calendar ID" });
    return;
  }

  if (calendar.ownerUsername !== req.session.auth?.username) {
    res.status(403).json({ message: "User does not own this calendar" });
    return;
  }

  next();
}

export default router;
