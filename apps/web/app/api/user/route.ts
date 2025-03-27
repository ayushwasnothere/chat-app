import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { getToken } from "next-auth/jwt";
import prisma from "@repo/db/client";

export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: 403,
      message: "Unauthorized",
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true,
    },
  });
  const data = {
    ...user,
    token: await getToken({ req, secret: process.env.SECRET, raw: true }),
  };
  return NextResponse.json(data);
}
