import express from "express";
import { getCalendarDetails, unshareFromSelf } from "./calendar-id/index";

export { default as getSharedCalendars } from "./getSharedCalendars";

const calendarIdRouter: express.Router = express.Router();

calendarIdRouter.get("/", getCalendarDetails);
calendarIdRouter.delete("/", unshareFromSelf);

export { calendarIdRouter };
