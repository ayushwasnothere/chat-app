import { NextRequest, NextResponse } from "next/server";
import { getSessionOrThrow } from "../../../lib/auth";
import prisma from "@repo/db/client";
import { UUID_REGEX } from "../../../lib/uuidRegex";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSessionOrThrow(req);
    const { id } = params;

    let conversation;

    if (UUID_REGEX.test(id)) {
      conversation = await prisma.conversation.findUnique({
        where: {
          id,
          participants: { some: { userId: session.user.id } },
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
          messages: true,
        },
      });
    } else {
      const otherUser = await prisma.user.findUnique({
        where: { username: id },
      });

      if (!otherUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: { userId: session.user.id },
              },
            },
            {
              participants: {
                some: { userId: otherUser.id },
              },
            },
          ],
        },
        include: {
          participants: {
            select: {
              user: { select: { id: true, username: true, name: true } },
            },
          },
          messages: true,
        },
      });
    }

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(conversation);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSessionOrThrow(req);

    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        userId: session.user.id,
        conversationId: params.id,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Unauthorized or conversation not found" },
        { status: 403 },
      );
    }

    await prisma.conversation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Conversation deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
