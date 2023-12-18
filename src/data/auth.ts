import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

type JwtPayload = {
  id: number;
  iat: number;
};

type JwtTokens = {
  accessToken: string;
};

export class AuthService {
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
    this.createToken(user.id);
    return true;
  }

  /**
   * This method can only be called within a Next.js request context.
   */
  static createToken(id: number) {
    cookies().set(
      "accessToken",
      jwt.sign({ id }, process.env.JWT_ACCESS_SECRET!),
      {
        secure: true,
        sameSite: "strict",
        httpOnly: true,
      },
    );
  }

  /**
   * This method can only be called within a Next.js request context.
   */
  static requireUser = cache(async (redirectToLogin: boolean = true) => {
    const accessToken = cookies().get("accessToken");
    if (!accessToken) {
      throw redirect("/login");
    }

    try {
      const data = jwt.verify(
        accessToken.value,
        process.env.JWT_ACCESS_SECRET!,
      ) as JwtPayload;

      const user = await db.query.users.findFirst({
        where: eq(users.id, data.id),
        columns: {
          tokensValidAfter: true,
        },
      });

      if (!user || new Date(data.iat * 1000) < user.tokensValidAfter)
        throw redirect("/login");

      return data;
    } catch (e) {
      if (
        e instanceof jwt.TokenExpiredError ||
        e instanceof jwt.JsonWebTokenError
      ) {
        if (redirectToLogin) throw redirect("/login");
      }
      throw e;
    }
  })
}
