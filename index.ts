import { Request, Response } from "express";
import { app } from "./lib/startup";

const port: number = 3000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message:
      "Hello, welcome to the Calendar Lender API. One day when documentation for it exists, this endpoint will lead to it.",
  });
});

import userRouter from "./routes/users";
app.use("/users", userRouter);

import myCalendarsRouter from "./routes/my-calendars";
app.use("/my-calendars", myCalendarsRouter);

import sharedCalendarsRouter from "./routes/shared-calendars";
app.use("/shared-calendars", sharedCalendarsRouter);

import verifyEmail from "./routes/verifyEmail";
app.get("/verify", verifyEmail);

import authenticate from "./lib/authenticate";
app.use(authenticate);

import acceptInvite from "./routes/acceptInvite";
app.get("/accept-invite", acceptInvite);

app.listen(port, () => {
  console.log("Server started on port " + port);
});
