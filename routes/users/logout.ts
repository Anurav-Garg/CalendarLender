import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  req.session.destroy(() => {
    res.status(200).json({ message: "Successfully logged out" });
  });
}
