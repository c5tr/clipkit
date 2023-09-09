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

/**
 * Extract the user's ID and username from a JWT included with the request.
 * 
 * @param request HTTP Request
 * @param returnToken Include JWT in return object
 * @returns User's ID and username
 */
export async function decodeJwtFromRequest(request: Request, returnToken?: boolean) {
  const cookieHeader = request.headers.get("Cookie");
  const token: string | undefined = await tokenCookie.parse(cookieHeader);
  if (!token) return undefined;

  const jwtData = jwt.decode(token, { json: true });
  if (!jwtData) return undefined;
  return { id: jwtData["id"] as string, username: jwtData["username"] as string, token: returnToken ? token : undefined };
}

/**
 * Helper to identify a user based on the token included with the request.
 * To protect a route, use `requireUser()` instead.
 * 
 * @param request HTTP Request
 * @returns User
 */
export async function getUser(request: Request) {
  try {
    const jwtUser = await decodeJwtFromRequest(request, true);
    if (!jwtUser) return null;

    const user = await getUserById(jwtUser.id);
    if (!user) return null;

    jwt.verify(jwtUser.token!, user.secret);
    return user;
  } catch (e) {
    return null;
  }
}

/**
 * Helper to protect a route. It has to be used in a route that requires the user
 * to be logged in.
 * 
 * @param request HTTP Request
 * @param redirectTo URL to redirect to after a successful login
 * @returns User
 */
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

/**
 * 
 * @param request HTTP Request
 * @returns 
 */
export async function requireAdmin(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const user = await requireUser(request);
  if (!user.isAdmin) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return user;
}

export async function createUserSession(userId: string, username: string, secret: string, redirectTo: string) {
  const token = jwt.sign({ id: userId, username }, secret);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(token),
    },
  });
}

export async function logout(request: Request) {
  throw redirect("/", {
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
