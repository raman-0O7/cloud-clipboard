"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import kotlin from "highlight.js/lib/languages/kotlin";
import java from "highlight.js/lib/languages/java";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("go", go);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("java", java);

type ClipItemProps = {
  id: string;
  createdAt: string;
  content: string;
  type?: "TEXT" | "CODE";
  language?: string | null;
};

function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
      return;
    }
  } catch { }
  // Fallback for huge content and older browsers
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Failed to copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

export function ClipItem({ createdAt, content, type = "TEXT", language }: ClipItemProps) {
  const [open, setOpen] = useState(false);
  const maxPreviewHeight = 200; // px, mixed height constraint
  const snippet = content;

  function normalizeLanguage(input?: string | null): string | undefined {
    if (!input) return undefined;
    const key = input.trim().toLowerCase();
    const aliases: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      rb: "ruby",
      sh: "bash",
      shell: "bash",
      yml: "yaml",
      md: "markdown",
      golang: "go",
      kt: "kotlin",
      rs: "rust",
      html: "xml",
      docker: "dockerfile",
    };
    return aliases[key] ?? key;
  }

  function renderHighlighted(text: string) {
    try {
      const lang = normalizeLanguage(language);
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(text, { language: lang }).value;
      }
      return hljs.highlightAuto(text).value;
    } catch {
      return text;
    }
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <Card className="border rounded-lg p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-xs text-muted-foreground truncate">
          {new Date(createdAt).toISOString()}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => copyText(content)}>Copy</Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>View</Button>
        </div>
      </div>
      {type === "CODE" ? (
        <pre style={{ maxHeight: maxPreviewHeight }} className="overflow-y-auto">
          <code
            className={`hljs text-sm whitespace-pre-wrap`}
            dangerouslySetInnerHTML={{ __html: renderHighlighted(snippet) }}
          />
        </pre>
      ) : (
        <pre
          className="whitespace-pre-wrap text-sm overflow-y-auto"
          style={{ maxHeight: maxPreviewHeight }}
        >
          {snippet}
        </pre>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm">
          <div className="bg-card text-card-foreground w-[min(90vw,900px)] max-h-[80vh] rounded-xl border shadow-lg">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b">
              <div className="text-sm font-medium">Clip – {new Date(createdAt).toLocaleString()}</div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => copyText(content)}>Copy All</Button>
                <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: "calc(80vh - 56px)" }}>
              {type === "CODE" ? (
                <pre>
                  <code
                    className="hljs text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: renderHighlighted(content) }}
                  />
                </pre>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{content}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}