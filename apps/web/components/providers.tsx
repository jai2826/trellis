"use client";

import * as React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

/**
 * Wraps children with a ConvexProvider configured with the Convex client.
 *
 * @param children - The React nodes to render inside the provider
 * @returns A React element that renders `children` within the ConvexProvider
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}