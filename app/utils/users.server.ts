import { z } from "zod";
import { UserType } from "~/types/user";
import * as bcrypt from "bcrypt";
import { prisma } from "./db.server";
import { generateJwtSecret } from "./sessions.server";

export async function countUsers() {
  return await prisma.user.count();
}

export async function createUser(user: z.infer<typeof UserType>) {
  return await prisma.user.create({
    data: {
      username: user.username,
      password: await bcrypt.hash(user.password, 10),
      secret: await generateJwtSecret(),
    },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      isAdmin: true
    }
  })
}

export async function getUserById(id: string, redacted?: boolean, includeClips?: boolean) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isAdmin: true,
      username: true,
      clips: includeClips,
      password: !redacted,
      secret: !redacted
    }
  });
}

export async function getUserByUsername(username: string, includeClips?: boolean) {
  return await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      clips: includeClips
    }
  });
}

export async function deleteUser() {}

export async function updateUsername(id: string, username: string) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
    },
  });
}

export async function updatePassword(id: string, oldPassword: string, newPassword: string) {
  const query = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      password: true
    }
  })
  if (query && !await bcrypt.compare(oldPassword, query.password)) {
    return undefined;
  }
  await prisma.user.update({
    where: { id },
    data: {
      password: await bcrypt.hash(newPassword, 10),
    },
  });
  return true;
}
