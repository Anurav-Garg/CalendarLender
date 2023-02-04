import express from "express";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} from "./events/index";
export { default as getCalendarDetails } from "./getCalendarDetails";
export { default as deleteCalendar } from "./deleteCalendar";
export { default as renameCalendar } from "./renameCalendar";

const eventRouter: express.Router = express.Router();

eventRouter.get("/", getAllEvents);
eventRouter.post("/", createEvent);
eventRouter.delete("/", deleteEvent);
eventRouter.patch("/", updateEvent);

export { eventRouter };
