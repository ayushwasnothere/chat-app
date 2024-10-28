"use client";

import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";

export function AppbarClient() {
  const { data: session } = useSession();

  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          await signIn();
        }}
        user={session?.user}
      />
    </div>
  );
}
