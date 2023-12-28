import * as bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import * as jose from "jose";

type AuthData = {
  id: number;
};

// JWT secret for usage with jose (the library used to handle JWTs)
const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);

/**
 * Log in a user
 * @returns `true` if email and password were correct.
 */
export async function login(email: string, password: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      password: true,
      tokensValidAfter: true,
    },
  });
  if (!user || !bcrypt.compareSync(password, user.password)) return false;
  await createToken(user.id);
  return true;
}

/**
 * Creates a JWT and adds it to a cookie called `accessToken`
 *
 * This method can only be called within a Next.js request context.
 */
export async function createToken(id: number) {
  const token = await new jose.SignJWT({ id })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(secret);
  cookies().set("accessToken", token, {
    secure: true,
    sameSite: "strict",
    httpOnly: true,
  });
}

/**
 * Get the current logged in user.
 *
 * This method can only be called within a Next.js request context.
 */
export const getUser = cache(async (): Promise<AuthData | undefined> => {
  const accessToken = cookies().get("accessToken");
  if (!accessToken) {
    return;
  }

  try {
    const { payload: data } = await jose.jwtVerify(accessToken.value, secret);
    const userId = data["id"] as number;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        tokensValidAfter: true,
      },
    });

    if (!user || new Date(data["iat"]! * 1000) < user.tokensValidAfter) {
      return;
    }

    return { id: userId };
  } catch (e) {
    if (e instanceof jose.errors.JWSSignatureVerificationFailed) {
      return;
    }
    throw e;
  }
});

/**
 * Gets the currently logged in user. If user is not logged in, automatically redirects to
 * the login page.
 *
 * This method can only be called within a Next.js request context.
 */
export const requireUser = cache(async (): Promise<AuthData> => {
  const user = await getUser();
  if (!user) throw redirect("/login");
  return user;
});
