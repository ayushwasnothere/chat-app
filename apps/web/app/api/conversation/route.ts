import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import db from "@repo/db/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;
  const data = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      conversations: {
        select: {
          conversation: {
            select: {
              id: true,
              participants: {
                select: {
                  user: {
                    select: {
                      username: true,
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              messages: {
                select: {
                  message: {
                    select: {
                      content: true,
                      id: true,
                      senderId: true,
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
  const responseData = data?.conversations.map((c) => {
    return {
      conversationId: c.conversation.id,
      participants: c.conversation.participants.map((p) => p.user),
      messages: c.conversation.messages.map((m) => {
        return {
          messageId: m.message.id,
          senderId: m.message.senderId,
          content: m.message.content,
        };
      }),
    };
  });

  return NextResponse.json({
    conversations: responseData,
  });
}
