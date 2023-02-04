import { z } from "zod";

const UserSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(16, { message: "Must be at most 16 characters long" })
    .regex(/^\w+$/, {
      message: "Must contain only alphanumeric characters and underscores",
    }),
  email: z.string().email({ message: "must be a valid email ID" }),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" })
    .max(32, { message: "Must be at most 32 characters long" }),
  name: z
    .string()
    .min(2, { message: "Must be at least 4 characters long" })
    .max(32, { message: "Must be at most 32 characters long" }),
});

export default UserSchema;
