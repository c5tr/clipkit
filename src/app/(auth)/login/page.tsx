import { ZodError } from "zod";
import { AuthForm } from "../form";
import { accountSchema } from "../schema";
import { AuthService } from "~/data/auth";
import { redirect } from "next/navigation";

export default function Login() {
  async function action(_: any, formData: FormData) {
    "use server";
    try {
      const { email, password } = accountSchema.parse(formData);
      if (!(await AuthService.login(email, password))) {
        return { message: "Invalid email or password." };
      }
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
      mode="login"
      action={action}
      enableRegistrations={process.env.ENABLE_REGISTRATIONS === "true"}
    />
  );
}
