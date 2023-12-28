import "server-only";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";
import * as bcrypt from "bcryptjs";
import { db } from "./db";

/**
 * Create an account
 * @returns ID of newly created account. `undefined` if the account was not created.
 */
export async function createAccount(
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

/**
 * Update the password of a certain user
 * @returns `true` if password was updated successfully
 */
export async function updateAccountPassword(
  userId: number,
  newPassword: string,
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      password: true,
    },
  });

  if (!user) return false;

  await db
    .update(users)
    .set({ password: bcrypt.hashSync(newPassword) })
    .where(eq(users.id, userId));
  return true;
}
