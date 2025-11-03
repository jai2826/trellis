"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";

/**
 * Renders the users page with an "Add New User" button and a JSON view of the current users.
 *
 * Fetches user data from the Convex `users.getMany` query and provides a mutation via `users.add`; clicking the button triggers the add mutation and the component displays the `users` result as JSON.
 *
 * @returns The React element containing the add-user Button and a JSON representation of `users`.
 */
export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUSer = useMutation(api.users.add);
  return (
    <div className="flex flex-col  items-center justify-center min-h-svh">
      <Button onClick={() => addUSer()}> Add New User </Button>
      <div className="max-w-sm w-full  mx-auto">{JSON.stringify(users)}</div>
    </div>
  );
}