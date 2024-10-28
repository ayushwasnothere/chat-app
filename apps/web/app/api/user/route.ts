import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions);
  session.token = await getToken({ req, secret: "secret" });
  if (session) return NextResponse.json(session.token);
}
