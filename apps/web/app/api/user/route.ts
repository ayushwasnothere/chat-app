import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session.user) return NextResponse.json(session);
}
