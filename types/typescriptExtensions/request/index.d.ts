import { Request } from "express";

declare module "express" {
  export interface Request {
    calendarId?: string;
    username?: string;
  }
}
