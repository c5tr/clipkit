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

export class AuthService {
  private static secret = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET!,
  );

  /**
   * @returns ID of newly created account
   */
  static async createAccount(
    email: string,
    password: string,
  ): Promise<number | undefined> {
    const [newAccount] = await db
      .insert(users)
      .values({
        email,
        password: bcrypt.hashSync(password),
      })
      .returning({
        id: users.id,
      });
    if (!newAccount) return undefined;
    return newAccount.id;
  }

  static async login(email: string, password: string): Promise<boolean> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        password: true,
        tokensValidAfter: true,
      },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) return false;
    await this.createToken(user.id);
    return true;
  }

  /**
   * This method can only be called within a Next.js request context.
   */
  static async createToken(id: number) {
    const token = await new jose.SignJWT({ id })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(this.secret);
    cookies().set("accessToken", token, {
      secure: true,
      sameSite: "strict",
      httpOnly: true,
    });
  }

  /**
   * This method can only be called within a Next.js request context.
   */
  static getUser = cache(async (): Promise<AuthData | undefined> => {
    const accessToken = cookies().get("accessToken");
    if (!accessToken) {
      return;
    }

    try {
      const { payload: data } = await jose.jwtVerify(
        accessToken.value,
        this.secret,
      );
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

  static requireUser = cache(async (): Promise<AuthData> => {
    const user = await this.getUser();
    if (!user) throw redirect("/login");
    return user;
  });

  static async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        password: true,
      },
    });

    if (!user) return false;

    if (!bcrypt.compareSync(oldPassword, user.password)) return false;

    await db
      .update(users)
      .set({ password: bcrypt.hashSync(newPassword) })
      .where(eq(users.id, userId));
    return true;
  }
}
