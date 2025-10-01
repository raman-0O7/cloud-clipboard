import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FileSaveForm } from "@/components/file-save-form";

export default async function FilesPage() {
  const hdrs = await headers();
  const sessionRes = await auth.api.getSession({ headers: hdrs });
  if (!sessionRes) {
    redirect("/login");
  }
  const user = sessionRes.user;
  const userId = user.id as string;
  const files = await prisma.file.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Upload Files</h2>
        <p className="text-sm text-muted-foreground">Drag and drop or click to select files.</p>
      </div>
      <FileSaveForm userId={userId} />

      <Separator />

      <div className="grid gap-4">
        {files.length === 0 && (
          <div className="text-sm text-muted-foreground">No files yet</div>
        )}
        {files.map((file) => (
          <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="border rounded-lg p-4 flex items-center gap-4 hover:bg-muted">
            {file.mimeType.startsWith("image") ? (
              <Image src={file.url} alt={file.name} width={64} height={64} className="rounded" />
            ) : (
              <div className="w-16 h-16 rounded bg-muted" />
            )}
            <div className="flex-1">
              <div className="font-medium leading-none">{file.name}</div>
              <div className="text-xs text-muted-foreground">{file.mimeType} • {(file.size / 1024).toFixed(1)} KB</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}