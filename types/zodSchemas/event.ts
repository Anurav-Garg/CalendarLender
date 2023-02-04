import { z } from "zod";

const EventSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Must be at least 4 characters long" })
    .max(16, { message: "Must be at most 16 characters long" }),
  description: z.string().max(2048),
  startTime: z
    .string()
    .datetime({ offset: true, message: "Must be a valid date" }),
  endTime: z
    .string()
    .datetime({ offset: true, message: "Must be a valid date" }),
});

export default EventSchema;
