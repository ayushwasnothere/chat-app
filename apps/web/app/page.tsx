import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <div className="text-red-900">HOME</div>
      <div>{JSON.stringify(session)}</div>
    </div>
  );
}
