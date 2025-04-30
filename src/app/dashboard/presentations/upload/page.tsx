"use client"

import type React from "react";
import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import { savePresentationAction } from "@/actions/presentation-actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function UploadPresentation() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const saveFile = async () => {
    if (!file) return;

    const result = await savePresentationAction({ file });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result?.success);
      redirect(`/dashboard/presentations/${result?.presentationId}/enhance`);
    }
  };

  return (
    <section className="p-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Upload new presentation</h1>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25",
            "transition-colors duration-200"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileUp className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Drag and drop here</h3>
              <p className="text-muted-foreground mt-1">
                or click to select a file
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                Select file
              </Button>
            </label>
            <p className="text-xs text-muted-foreground max-w-60">
              Make sure to upload your presentation in a PDF format for best
              results.
            </p>
          </div>
        </div>

        {file && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-primary flex items-center justify-center text-white">
                  <FileUp className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <form action={saveFile}>
                <SubmitButton
                  type="submit"
                  loadingText="Uploading..."
                  text="Upload and enhance"
                  variant="default"
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
