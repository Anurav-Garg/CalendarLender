import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prisma, redisClient } from "../../lib/initializeClients";
import { hash } from "bcryptjs";
import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";
import { randomBytes } from "crypto";
import UserSchema from "../../types/zodSchemas/user";
import { fromZodError } from "zod-validation-error";
dotenv.config();

sgMail.setApiKey(process.env.EMAIL_API_KEY as string);

export default async function (req: Request, res: Response) {
  const user: User = { name: "", email: "", password: "", username: "" };
  ({
    name: user.name,
    email: user.email,
    password: user.password,
    username: user.username,
  } = req.body);

  const parsed = UserSchema.safeParse(user);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid input",
      error: fromZodError(parsed.error),
    });
    return;
  }

  const existingUser1: User | null = await prisma.user.findUnique({
    where: { username: user.username },
  });
  if (existingUser1) {
    res.status(400).json({ message: "Username taken" });
    return;
  }

  const existingUser2: User | null = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (existingUser2) {
    res
      .status(400)
      .json({ message: "Email already registered with another account" });
    return;
  }

  const hashedPassword: string = await hash(user.password, 10);
  user.password = hashedPassword;
  const token: string = randomBytes(48).toString("hex");

  await redisClient.set(token, JSON.stringify(user), { EX: 60 * 60 });

  const msg = {
    to: user.email,
    from: process.env.VERIFIED_EMAIL as string,
    subject: "Verify your CalendarLender API Account",
    html: `<a href="http://localhost:3000/verify?token=${token}">Verify Registration</a>`,
  };

  sgMail.send(msg).then(
    () => {
      console.log("Email sent, hopefully");
      console.log(msg);
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
    .json({ message: "Registration successful, awaiting validation" });
}
