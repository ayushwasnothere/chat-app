import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";

interface Payload {
  toSendId: string;
  content: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const payload: Payload = await req.json();
  const message = await prisma.message.create({
    data: {
      senderId: userId,
      content: payload.content,
      conversationId: await getOrCreateConversation(userId, payload.toSendId),
    },
    select: {
      id: true,
      senderId: true,
      content: true,
      createdAt: true,
    },
  });
  return NextResponse.json(message);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.error();
  }
  const parsedUrl = parseUrl(req.url);
  const messageId = parsedUrl.query.id;
  if (messageId) {
    const message = await prisma.message.findUnique({
      where: {
        id: Number(messageId),
      },
      select: {
        id: true,
        senderId: true,
        content: true,
        createdAt: true,
      },
    });
    return NextResponse.json(message);
  }
  const userId = session.user.id;
  const messages = await prisma.message.findMany({
    where: {
      conversation: {
        participants: {
          some: {
            userId,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      senderId: true,
      content: true,
      createdAt: true,
    },
  });
  return NextResponse.json(messages);
}

async function getOrCreateConversation(
  userId: string,
  toSendId: string,
): Promise<string> {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          userId: { in: [userId, toSendId] },
        },
      },
    },
  });

  if (existingConversation) {
    return existingConversation.id;
  }

  const newConversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { user: { connect: { id: userId } } },
          { user: { connect: { id: toSendId } } },
        ],
      },
    },
  });

  return newConversation.id;
}
