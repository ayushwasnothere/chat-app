import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { UUID_REGEX } from "../../../lib/uuidRegex";

export async function GET(
  req: NextRequest,
  { params }: { params: { identifier: string } },
) {
  const { identifier } = params;
  try {
    let user;

    if (UUID_REGEX.test(identifier)) {
      user = await prisma.user.findUnique({
        where: { id: identifier },
        select: {
          id: true,
          username: true,
          name: true,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { username: identifier },
        select: {
          id: true,
          username: true,
          name: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
