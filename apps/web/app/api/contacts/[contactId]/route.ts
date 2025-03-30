import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getSessionOrThrow } from "../../../lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { contactId: string } },
) {
  try {
    const session = await getSessionOrThrow(req);
    const { contactId } = params;

    try {
      const contact = await prisma.contact.findFirst({
        where: { userId: session.user.id, contactId },
      });

      if (!contact) {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 },
        );
      }

      await prisma.contact.delete({
        where: { id: contact.id },
      });

      return NextResponse.json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
