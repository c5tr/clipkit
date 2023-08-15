import { z } from "zod";

export const PasswordType = z.string().min(8);

export const UpdatePasswordType = z.object({
    oldPassword: PasswordType,
    newPassword: PasswordType,
    confirmNewPassword: PasswordType,
})