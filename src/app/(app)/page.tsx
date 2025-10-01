import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const sessionRes = await auth.api.getSession({ headers: await headers() });
  if (!sessionRes) {
    redirect("/login");
  }
  const user = sessionRes.user;
  const userId = user.id as string;
  const [clipCount, fileCount] = await Promise.all([
    prisma.clip.count({ where: { userId } }),
    prisma.file.count({ where: { userId } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cloud Clipboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/clipboard" className="border rounded-lg p-6 hover:bg-muted">
          <div className="font-medium">Text Clips</div>
          <div className="text-sm text-muted-foreground">{clipCount} saved</div>
        </Link>
        <Link href="/files" className="border rounded-lg p-6 hover:bg-muted">
          <div className="font-medium">Files</div>
          <div className="text-sm text-muted-foreground">{fileCount} uploaded</div>
        </Link>
      </div>
    </div>
  );
}