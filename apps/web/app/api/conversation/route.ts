import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import db from "@repo/db/client";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const parsedUrl = parseUrl(req.url);
  const convoId = parsedUrl.query.id;
  if (!session) {
    return NextResponse.json({
      convoId,
    });
  }

  if (convoId) {
    const data = await db.conversation.findUnique({
      where: {
        id: convoId as string,
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        participants: {
          where: {
            userId: session?.user.id,
          },
          select: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
    if (!data) {
      return NextResponse.json({
        error: 403,
        message: "conversation id doesnt exist",
      });
    }
    return NextResponse.json(data);
  }

  try {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session?.user.id,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: error?.message,
    });
  }
}
