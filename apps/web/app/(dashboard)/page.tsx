"use client";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUSer = useMutation(api.users.add);
  return (
    
      <div className="flex flex-col  items-center justify-center min-h-svh">
        <UserButton />
        <OrganizationSwitcher hidePersonal/>
        <Button onClick={() => addUSer()}> Add New User </Button>
      </div>
    
  );
}
