"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { toast } from "sonner";
import { createClip } from "@/actions/clip";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";


interface Props {
  userId: string;
}

const clipSaveSchema = z.object({
  content: z.string(),
  type: z.enum(["TEXT", "CODE"]).default("TEXT"),
  language: z.string().optional(),
})
export const ClipSaveForm = ({ userId }: Props) => {
  const router = useRouter();
  type ClipFormInput = z.input<typeof clipSaveSchema>;
  const form = useForm<ClipFormInput>({
    resolver: zodResolver(clipSaveSchema),
    defaultValues: {
      content: "",
      type: "TEXT",
      language: "",
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<ClipFormInput> = async (values) => {
    try {
      setIsLoading(true);
      const t = values.type ?? "TEXT";
      const lang = t === "CODE" ? values.language : undefined;
      await createClip(values.content, userId, t, lang);
      // Clear textarea on successful save
      form.reset({ content: "", type: "TEXT", language: "" });
      router.refresh();
    } catch (err) {
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="CODE">Code</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="language"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. javascript, python, tsx" disabled={form.watch("type") !== "CODE"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Hi there!"
                  className="max-h-[40vh] overflow-y-auto"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  )
}