import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  if (!req.session.auth) {
    res
      .status(401)
      .json({ message: "User not logged in, or session was timed out." });
    return;
  }

  req.session.destroy(() => {
    res.status(200).json({ message: "Successfully logged out" });
  });
}
