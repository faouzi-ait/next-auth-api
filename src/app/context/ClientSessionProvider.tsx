"use client";

import { SessionProvider } from "next-auth/react";

interface ClientSessionProviderProps {
  session: any;
  children: React.ReactNode;
}

export default function ClientSessionProvider({
  session,
  children,
}: ClientSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
