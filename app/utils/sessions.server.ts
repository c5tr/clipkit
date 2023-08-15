import { createCookie, json, redirect } from "@remix-run/node";
import * as jwt from "jsonwebtoken";
import * as crypto from "node:crypto";
import { createUser, getUserById, getUserByUsername } from "./users.server";
import { UserType } from "~/types/user";
import { z } from "zod";
import * as bcrypt from "bcrypt";

const tokenCookie = createCookie("token", {
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: true,
  sameSite: "strict",
  path: "/",
  secure: true,
});

export async function generateJwtSecret() {
  return crypto.randomBytes(32).toString("hex");
}

export async function decodeJwtFromRequest(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const token: string | undefined = await tokenCookie.parse(cookieHeader);
  if (!token) return null;

  const jwtData = jwt.decode(token, { json: true });
  if (!jwtData) return undefined;
  return { id: jwtData["userId"], username: jwtData["username"] };
}

export async function getUser(request: Request) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const token: string | undefined = await tokenCookie.parse(cookieHeader);
    if (!token) return null;

    const jwtData = jwt.decode(token, { json: true });
    if (!jwtData) return null;
    const userId: string = jwtData["userId"];

    const user = await getUserById(userId);
    if (!user) return null;

    jwt.verify(token, user.secret);
    return { id: user.id, username: user.username };
  } catch (e) {
    return null;
  }
}

export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  // TODO: implement logging
  const user = await getUser(request);
  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return user;
}

export async function createUserSession(userId: string, username: string, secret: string, redirectTo: string) {
  const token = jwt.sign({ userId }, secret);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(token),
    },
  });
}

export async function logout(request: Request) {
  return redirect("/", {
    headers: {
      "Set-Cookie": "token=\"\"; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  })
}

export async function createNewUserSession() {}

export async function registerUser(user: z.infer<typeof UserType>) {
  const query = await createUser(user);
  return createUserSession(query.id, query.username, query.secret, "/app");
}

export async function loginUser(user: z.infer<typeof UserType>) {
  const query = await getUserByUsername(user.username);
  if (!query || !(await bcrypt.compare(user.password, query.password)))
    return json({ error: "Username not found or wrong password" });
  return createUserSession(query.id, query.username, query.secret, "/app");
}
