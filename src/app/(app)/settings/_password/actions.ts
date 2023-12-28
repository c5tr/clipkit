"use server";

import { ZodError, z } from "zod";
import { zfd } from "zod-form-data";
import { updateAccountPassword } from "~/data/accounts";
import { requireUser } from "~/data/auth";

const UpdatePasswordSchema = zfd.formData({
  oldPassword: z.string().min(8, "Old password has to contain at least 8 characters."),
  newPassword: z.string().min(8, "New password has to contain at least 8 characters."),
  repeatedNewPassword: z.string(),
});

type UpdatePasswordResponse =
  | {
      success?: never;
      errors: {
        oldPassword?: string;
        newPassword?: string;
        repeatedNewPassword?: string;
      };
    }
  | {
      success: true;
      errors?: never;
    };

export async function updatePassword(
  previousState: any,
  formData: FormData,
): Promise<UpdatePasswordResponse> {
  const user = await requireUser();
  try {
    const data = UpdatePasswordSchema.parse(formData);

    if (data.newPassword !== data.repeatedNewPassword) {
      return {
        errors: {
          repeatedNewPassword: "Passwords don't match.",
        },
      };
    }

    if (data.oldPassword === data.newPassword) {
      return {
        errors: {
          newPassword: "New password is the same as the old password.",
        },
      };
    }

    if (
      !(await updateAccountPassword(
        user.id,
        data.newPassword,
      ))
    ) {
      return {
        errors: {
          oldPassword: "Old password is incorrect.",
        },
      };
    }
    return {
      success: true,
    };
  } catch (e) {
    if (e instanceof ZodError) {
      const flattened = e.flatten().fieldErrors;
      const errors: Record<string, string> = {};
      for (const key of Object.keys(flattened)) {
        errors[key] = flattened[key]![0];
      }
      
      return {
        errors,
      };
    }
    throw e;
  }
}
