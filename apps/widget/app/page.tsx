"use client";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";

export default function Page() {
  const users = useQuery(api.users.getMany);
  return (
    <div className="flex flex-col  items-center justify-center min-h-svh">
      <div className="max-w-sm w-full  mx-auto">

      {JSON.stringify(users)}
      </div>
      </div>
  );
}
