import { prisma } from "./db.server";
import * as fs from "fs/promises";

/**
 * Count all the clips stored in the server. 
 * 
 * @param id Optional user ID to count all the clips coming from an user
 */
export async function countClips(id?: string) {
  return await prisma.clip.count({
    where: {
      userId: id
    }
  })
}

export async function getAllClips() {
  return await prisma.clip.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      userId: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getClipsByUserId(id: string) {
  return await prisma.clip.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getClipBySlug(slug: string) {
  return await prisma.clip.findUnique({
    where: {
      slug,
    },
  });
}

export async function getClipById(id: string) {
  return await prisma.clip.findUnique({
    where: {
      id,
    },
  });
}

export async function createClipUpload(userId: string, filename: string) {
  return await prisma.clip.create({
    data: {
      title: filename.substring(0, filename.lastIndexOf(".")),
      userId,
    },
  });
}

export async function addClipUrl(id: string, url: string, thumbnailUrl: string) {
  return await prisma.clip.update({
    where: {
      id,
    },
    data: {
      url,
      thumbnailUrl,
    },
  });
}

export async function deleteClip(id: string, videoFile?: string) {
  if (!videoFile) {
    const query = await prisma.clip.findUnique({
      where: {
        id,
      },
    });
    videoFile = query?.url?.substring(query.url.lastIndexOf("/"));
  }
  await fs.unlink("./public/uploads/" + videoFile);
  await fs.unlink(`./public/uploads/${id}.webp`);
  return await prisma.clip.delete({
    where: {
      id,
    },
  });
}
