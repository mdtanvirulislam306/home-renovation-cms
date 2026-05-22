"use client";

import { ThemeProvider } from "./theme-provider";
import { AuthSessionProvider } from "./session-provider";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </QueryProvider>
    </AuthSessionProvider>
  );
}
