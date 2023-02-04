import express from "express";
import {
  deleteCalendar,
  getCalendarDetails,
  renameCalendar,
  eventRouter,
} from "./calendar-id/index";
export { default as createCalendar } from "./createCalendar";
export { default as getAllCalendars } from "./getAllCalendars";

const calendarIdRouter: express.Router = express.Router();

calendarIdRouter.get("/", getCalendarDetails);
calendarIdRouter.delete("/", deleteCalendar);
calendarIdRouter.patch("/", renameCalendar);

calendarIdRouter.use("/events", eventRouter);

export { calendarIdRouter };
