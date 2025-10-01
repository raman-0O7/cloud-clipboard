import Link from "next/link";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Auth is checked within pages; layout remains static.

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">Cloud Clipboard</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">Dashboard</Link>
          <Link href="/clipboard" className="hover:underline">Clipboard</Link>
          <Link href="/files" className="hover:underline">Files</Link>
        </nav>
      </header>
      <main className="px-6 py-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}