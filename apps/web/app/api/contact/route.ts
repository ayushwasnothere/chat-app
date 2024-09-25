import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

interface Payload {
  contactName: string;
  contactId: string;
}
interface Contact {
  id: number;
  contactName: string;
  contactId: string;
  authorId: string;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const myId = session.user.id;
  const data = await prisma.contact.findMany({
    where: {
      authorId: myId,
    },
    select: {
      contactName: true,
      contactUser: {
        select: {
          username: true,
          id: true,
          name: true,
        },
      },
    },
  });
  const contacts = data.map((c) => {
    return {
      name: c.contactName,
      userId: c.contactUser.id,
      username: c.contactUser.username,
    };
  });
  return NextResponse.json({ contacts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const myId = session.user.id;
  const payload: Payload = await req.json();
  const contact = await getOrCreateContact(
    payload.contactId,
    payload.contactName,
    myId,
  );
  return NextResponse.json(contact);
}

async function getOrCreateContact(
  contactId: string,
  contactName: string,
  myId: string,
): Promise<Contact> {
  const existingContact = await prisma.contact.findFirst({
    where: {
      contactId: contactId,
      authorId: myId,
    },
  });

  if (existingContact) {
    return existingContact;
  }
  const newContact = await prisma.contact.create({
    data: {
      contactId: contactId,
      authorId: myId,
      contactName: contactName,
    },
  });

  return newContact;
}
