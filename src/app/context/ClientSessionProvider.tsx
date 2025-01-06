"use client";

import { SessionProvider } from "next-auth/react";

interface ClientSessionProviderProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  session: any;
  children: React.ReactNode;
  /* eslint-disable @typescript-eslint/no-explicit-any */
}

export default function ClientSessionProvider({
  session,
  children,
}: ClientSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
