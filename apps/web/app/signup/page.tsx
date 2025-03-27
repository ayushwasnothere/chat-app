"use client";

import { SignupPage, SignupPageProps } from "@repo/ui/signupPage";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errObject, setErrObject] = useState({ err: false, message: "" });

  const props: SignupPageProps = {
    signupQuoteProps: {
      quote: "",
      author: "",
      authorDescription: "",
    },
    signupTemplateProps: {
      onChangeName: (e) => setName(e.target.value),
      onChangeUsername: (e) => setUsername(e.target.value),
      onChangePassword: (e) => setPassword(e.target.value),
      onChangeConfirmPassword: (e) => setConfirmPassword(e.target.value),
      onClickButton: async () => {
        const res = await signIn("credentials", {
          username,
          password,
          confirmPassword,
          name,
          mode: "signup",
          redirect: false,
        });
        if (res?.error) {
          setErrObject({ err: true, message: res.error });
        } else {
          router.push("/");
        }
      },
      errObject,
      linkComponent: Link,
      passwordsmatch: !confirmPassword ? true : password === confirmPassword,
      passwordcheck: password.length >= 6,
    },
  };

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return <SignupPage {...props} />;
}
