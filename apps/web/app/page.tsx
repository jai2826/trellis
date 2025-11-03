"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUSer = useMutation(api.users.add);
  return (
    <>
      <Authenticated>
        <div className="flex flex-col  items-center justify-center min-h-svh">
          <UserButton/>
          <Button onClick={() => addUSer()}> Add New User </Button>
          <div className="max-w-sm w-full  mx-auto">
            {JSON.stringify(users)}
          </div>

        </div>
      </Authenticated>
      <Unauthenticated>
        <p>Must be signed in</p>{" "}
        <SignInButton>
          Sign In
        </SignInButton>
      </Unauthenticated>
    </>
  );
}
