import { accountSchema } from "../schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { AuthForm } from "../form";
import { createAccount } from "~/data/accounts";
import { createToken } from "~/data/auth";

export default function Register() {
  async function action(_: any, formData: FormData) {
    "use server";
    if (process.env.ENABLE_REGISTRATIONS !== "true") throw redirect('/login');

    try {
      const { email, password } = accountSchema.parse(formData);
      const id = await createAccount(email, password);
      if (!id) {
        return {
          message:
            "There was a problem creating your account. Try again later.",
        };
      }
      createToken(id);
    } catch (e) {
      if (e instanceof ZodError) {
        return { message: e.issues[0].message };
      }
      throw e;
    }
    redirect("/dashboard");
  }

  if (process.env.ENABLE_REGISTRATIONS !== "true") {
    throw redirect('/login');
  }

  return (
    <AuthForm
      action={action}
      mode="register"
      enableRegistrations={true}
    />
  );
}
