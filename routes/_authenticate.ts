import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.session.auth) {
    res
      .status(401)
      .json({ message: "User not logged in, or session was timed out." });
    return;
  }

  next();
}
