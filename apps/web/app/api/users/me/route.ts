import { getSessionOrThrow } from "../../../lib/auth";
import prisma from "@repo/db/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow(req);
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
      },
    });
    const data = {
      ...user,
      token: await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        raw: true,
      }),
    };
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
