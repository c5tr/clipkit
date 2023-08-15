import { z } from "zod";
import { PasswordType } from "./password";

export const UsernameType = z.string().min(1).max(20).regex(/^\w+$/, "Username can only contain numbers and letters");

export const UserType = z.object({
  username: UsernameType,
  password: PasswordType,
});
