import { z } from "zod";

const CalendarSchema = z.object({
  name: z.string().min(1).max(32),
});

export default CalendarSchema;
