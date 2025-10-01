"use client";
import "@uploadthing/react/styles.css"

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/utils/uploadthing";
import { FileChangeProps } from "./file-save-form";

interface FileUploadProps {
  onChange: (res: FileChangeProps) => void;
  value: FileChangeProps | null;
}

export const FileUpload = ({ onChange, value }: FileUploadProps) => {
  const fileType = value?.type?.split("/").pop();
  const url = value?.ufsUrl;
  console.log("value?>>>", value);
  if (url && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={url}
          alt="Upload"
          className="rounded-full"
        />
        <button onClick={() => onChange({ufsUrl: ""})}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (url && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {url}
        </a>
        <button onClick={() => onChange({ufsUrl: ""})}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm" type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={"file"}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  )
}