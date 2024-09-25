import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

interface Payload {
  toSendId: string;
  content: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;
  const payload: Payload = await req.json();
  const message = await prisma.message.create({
    data: {
      senderId: userId,
      content: payload.content,
      links: {
        create: {
          conversationId: await getOrCreateConversation(
            userId,
            payload.toSendId,
          ),
        },
      },
    },
    select: {
      senderId: true,
      content: true,
      links: {
        select: {
          conversationId: true,
          conversation: {
            select: {
              participants: {
                select: {
                  user: {
                    select: {
                      username: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return NextResponse.json(message);
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
