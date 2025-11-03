"use client";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";

/**
 * Client-side page component that fetches users via Convex and displays the query result as JSON.
 *
 * @returns A JSX element that renders the fetched users (stringified JSON) inside a centered, constrained container.
 */
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