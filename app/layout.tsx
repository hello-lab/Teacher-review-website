import "./globals.css";
import { inter } from "./fonts";
import { Toaster } from "@/components/ui/sonner";
import HeaderNavigationBase from "@/components/navigation";
import { dbConnectionStatus } from "@/lib/connection-status";
import { Badge } from "@/components/ui/badge";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dbStatus = await dbConnectionStatus();

  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>
        <HeaderNavigationBase dbStatus={dbStatus} />

        <main className="min-h-screen">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
