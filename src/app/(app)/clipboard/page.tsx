import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ClipSaveForm } from "@/components/clip-save-form";
import { ClipItem } from "@/components/clip-item";

export default async function ClipboardPage() {
  const hdrs = await headers();
  const sessionRes = await auth.api.getSession({ headers: hdrs });
  if (!sessionRes) {
    redirect("/login");
  }
  const user = sessionRes.user;
  const userId = user.id as string;
  const clips = await prisma.clip.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <ClipSaveForm userId={userId} />

      <div className="space-y-3">
        {clips.map((clip) => (
          <ClipItem
            key={clip.id}
            id={clip.id}
            createdAt={clip.createdAt.toISOString()}
            content={clip.content}
            type={clip.type as "TEXT" | "CODE"}
            language={clip.language}
          />
        ))}
        {clips.length === 0 && (
          <div className="text-sm text-muted-foreground">No clips yet</div>
        )}
      </div>
    </div>
  );
}