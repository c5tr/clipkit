import { z } from "zod";
import { zfd } from "zod-form-data";

export const accountSchema = zfd.formData({
  email: z.string(),
  password: z.string().min(8),
});
