"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { FileUpload } from "./file-upload";
import { Button } from "./ui/button";
import { useState } from "react";
import { createFile } from "@/actions/file";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface FileChangeProps {
  fileHash?: string;
  key?: string;
  name?: string;
  size?: number;
  type?: string;
  ufsUrl: string;
}
const fileSaveSchema = z.object({
  file: z.string().min(1, {
    message: "File is required"
  }),
})

export const FileSaveForm = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof fileSaveSchema>>({
    resolver: zodResolver(fileSaveSchema),
    defaultValues: {
      file: ""
    }
  });
  const [currentFileObject, setCurrentFileObject] = useState<FileChangeProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!currentFileObject) {
        toast.error("Upload File first")
        return;
      }
      await createFile(currentFileObject, userId);
      setCurrentFileObject(null);
      router.refresh();
    } catch (err) {
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          name="file"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <FileUpload
                  value={currentFileObject}
                  onChange={(res: FileChangeProps) => {
                    setCurrentFileObject(res);
                    field.onChange(res)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="button"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </form>
    </Form>
  )
}