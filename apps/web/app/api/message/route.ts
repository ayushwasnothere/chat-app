import { getSessionOrThrow } from "../../lib/auth";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow(req);

    const { toId, content } = await req.json();
    if (!toId || !content) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const conversationId = await getOrCreateConversation(session.user.id, toId);
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        content,
        conversationId,
      },
      select: {
        id: true,
        senderId: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow(req);

    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const cursor = url.searchParams.get("cursor");
    const limit = parseInt(url.searchParams.get("limit") || "20", 20);

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    const otherUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: session.user.id } } },
          { participants: { some: { userId: otherUser.id } } },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "No conversation found" },
        { status: 404 },
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: Number(cursor) } } : {}),
      select: { id: true, senderId: true, content: true, createdAt: true },
    });

    const nextCursor =
      messages.length === limit ? messages[messages.length - 1]?.id : null;

    return NextResponse.json({ messages, nextCursor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function getOrCreateConversation(
  userId: string,
  toSendId: string,
): Promise<string> {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: toSendId } } },
      ],
    },
  });

  if (existingConversation) return existingConversation.id;

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
