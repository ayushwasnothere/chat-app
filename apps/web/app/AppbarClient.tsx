"use client";

import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          await signIn();
        }}
        user={session.data?.user}
      />
    </div>
  );
}
