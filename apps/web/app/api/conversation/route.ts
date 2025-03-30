import { NextRequest, NextResponse } from "next/server";
import { getSessionOrThrow } from "../../lib/auth";
import prisma from "@repo/db/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow(req);

    const { userId } = await req.json();

    if (!userId || userId === session.user.id) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (
      await prisma.blockedUser.findFirst({
        where: { blockedId: userId, blockerId: session.user.id },
      })
    ) {
      return NextResponse.json({ error: "User is blocked" }, { status: 403 });
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingConversation = await prisma.conversationParticipant.findFirst(
      {
        where: {
          OR: [
            {
              userId: session.user.id,
              conversation: { participants: { some: { userId } } },
            },
            {
              userId,
              conversation: {
                participants: { some: { userId: session.user.id } },
              },
            },
          ],
        },
        include: { conversation: true },
      },
    );

    if (existingConversation) {
      return NextResponse.json(existingConversation.conversation);
    }

    const conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId: session.user.id }, { userId }],
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow(req);

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
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
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
