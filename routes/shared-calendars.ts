import express, { NextFunction, Request, Response } from "express";
import { default as authenticate } from "../lib/authenticate";
import { prisma } from "../lib/initializeClients";
import { getSharedCalendars, calendarIdRouter } from "./shared-calendars/index";

const router: express.Router = express.Router();

router.use(authenticate);

router.get("/", getSharedCalendars);

router.use("/:calendarId", authorize, calendarIdRouter);

async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.calendarId = req.params.calendarId;

  const calendarSharedList = await prisma.calendar.findUnique({
    where: { id: req.calendarId },
    select: {
      sharedTo: { select: { username: true } },
    },
  });

  if (!calendarSharedList) {
    res.status(404).json({ message: "Invalid calendar ID" });
    return;
  }

  if (
    !calendarSharedList.sharedTo
      .map((obj) => {
        return obj.username;
      })
      .includes(req.username as string)
  ) {
    res
      .status(403)
      .json({ message: "User does not have access to this calendar" });
    return;
  }

  next();
}

export default router;
