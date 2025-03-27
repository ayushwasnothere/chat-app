"use client";

import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AppbarClient() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div>
      {pathname === "/signin" || pathname === "/signup" ? (
        <div></div>
      ) : (
        <Appbar
          onSignin={signIn}
          onSignout={async () => {
            await signOut();
            await signIn();
          }}
          user={session?.user}
        />
      )}
    </div>
  );
}
