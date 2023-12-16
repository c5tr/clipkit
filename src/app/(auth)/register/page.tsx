import { AuthService } from "~/data/auth";
import { accountSchema } from "../schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { AuthForm } from "../form";

export default function Register() {
  async function action(_: any, formData: FormData) {
    "use server";
    try {
      const { email, password } = accountSchema.parse(formData);
      const id = await AuthService.createAccount(email, password);
      if (!id) {
        return {
          message:
            "There was a problem creating your account. Try again later.",
        };
      }
      AuthService.createToken(id);
    } catch (e) {
      if (e instanceof ZodError) {
        return { message: e.issues[0].message };
      }
      throw e;
    }
    redirect("/dashboard");
  }
  return (
    <AuthForm
      action={action}
      mode="register"
      enableRegistrations={process.env.ENABLE_REGISTRATIONS === "true"}
    />
  );
}
