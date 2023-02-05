import { Request, Response } from "express";
import { prisma, redisClient } from "../../../lib/initializeClients";
import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";
import { randomBytes } from "crypto";
import { Calendar, User } from "@prisma/client";
dotenv.config();

sgMail.setApiKey(process.env.EMAIL_API_KEY as string);

export default async function (req: Request, res: Response) {
  const { email }: { email: string } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email ID of the receiver is required" });
    return;
  }

  const userExists = await prisma.user.count({ where: { email: email } });
  if (userExists === 0) {
    res.status(400).json({ message: "No user found with that email." });
    return;
  }

  const user: User | null = await prisma.user.findUnique({
    where: { username: req.username },
  });

  if (!user) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }

  if (user.email === email) {
    res.status(400).json({ message: "Can't share calendar with self" });
    return;
  }

  const sharedList = await prisma.calendar.findUnique({
    where: { id: req.calendarId },
    select: { sharedTo: true },
  });

  if (sharedList === null) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }

  sharedList.sharedTo.forEach((userObject) => {
    if (userObject.email === email) {
      res
        .status(400)
        .json({ message: "Calendar is already shared to that user" });
      return;
    }
  });

  const token: string = randomBytes(48).toString("hex");

  await redisClient.set(
    token,
    JSON.stringify({
      receiverEmail: email,
      calendarId: req.calendarId,
    })
  );

  const msg1 = {
    to: email,
    from: process.env.VERIFIED_EMAIL as string,
    subject: "Shared Calendar from another User",
    text: `User ${user.email} would like to share their calendar (ID: ${req.calendarId}) with you.`,
    html: `<a href="http://localhost:3000/accept-invite?token=${token}">Click here to accept</a>`,
  };

  sgMail.send(msg1).then(
    () => {
      console.log("Email sent, hopefully");
      console.log(msg1);
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );

  const msg2 = {
    to: user.email,
    from: process.env.VERIFIED_EMAIL as string,
    subject: "Shared your Calendar",
    text: `Your calendar (ID: ${req.calendarId}) was successfully shared with User ${email}.
    If you think this was a mistake... Uhh customer support wasn't in my tasks so cope`,
  };

  sgMail.send(msg2).then(
    () => {
      console.log("Email sent, hopefully");
      console.log(msg2);
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );

  res
    .status(200)
    .json({ message: "Sharing successful, waiting for recipient to accept" });
}
