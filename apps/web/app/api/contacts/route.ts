import { NextRequest, NextResponse } from "next/server";
import { getSessionOrThrow } from "../../lib/auth";
import prisma from "@repo/db/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow(req);
    const contacts = await prisma.contact.findMany({
      where: { userId: session.user.id },
      include: {
        contact: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(contacts.map((c: any) => c.contact));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow(req);
    const { contactId } = await req.json();

    if (!contactId || contactId === session.user.id) {
      return NextResponse.json(
        { error: "Invalid contact ID" },
        { status: 400 },
      );
    }

    const existingContact = await prisma.contact.findFirst({
      where: {
        contactId: contactId,
        userId: session.user.id,
      },
    });
    if (existingContact) {
      return NextResponse.json(
        {
          error: "Contact already exists",
        },
        { status: 400 },
      );
    }

    const contact = await prisma.contact.create({
      data: {
        userId: session.user.id,
        contactId: contactId,
      },
      include: {
        contact: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(contact.contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
