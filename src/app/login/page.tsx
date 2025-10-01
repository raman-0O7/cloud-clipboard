"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSignIn = async () => {
    setLoading(true);
    setError(null);
    authClient.signIn.email(
      {
        email: email,
        password: password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.replace("/ ");
        },
        onError: ({ error }) => {
          setError(error.message);
          setLoading(false);
        },
      }
    );
  };

  // const onSignUp = async () => {
  //   setLoading(true);
  //   setError(null);
  //   authClient.signUp.email(
  //     {
  //       name: name,
  //       email: email,
  //       password: password,
  //       callbackURL: "/"
  //     },
  //     {
  //       onSuccess: () => {
  //         setLoading(false);
  //       },
  //       onError: ({ error }) => {
  //         setError(error.message);
  //         setLoading(false);
  //       },
  //     }
  //   );
  // };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div>
            {error}
          </div>}
          <div className="flex gap-2">
            <Button onClick={onSignIn} disabled={loading} className="flex-1">Sign In</Button>
            {/* <Button onClick={onSignUp} disabled={loading} variant="secondary" className="flex-1">Sign Up</Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}