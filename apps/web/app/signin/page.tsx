"use client";

import { SigninPage, SigninPageProps } from "@repo/ui/signinPage";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Signin() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errObject, setErrObject] = useState({ err: false, message: "" });

  const props: SigninPageProps = {
    signinQuoteProps: {
      quote: "",
      author: "",
      authorDescription: "",
    },
    signinTemplateProps: {
      onChangeUsername: (e) => setUsername(e.target.value),
      onChangePassword: (e) => setPassword(e.target.value),
      onClickButton: async () => {
        const res = await signIn("credentials", {
          username,
          password,
          redirect: false,
          mode: "signin",
        });
        if (res?.error) {
          setErrObject({ err: true, message: res?.error });
        } else {
          router.push("/");
        }
      },
      errObject,
      linkComponent: Link,
    },
  };

  if (status === "loading" || status === "authenticated") {
    return null;
  }
  return <SigninPage {...props} />;
}
