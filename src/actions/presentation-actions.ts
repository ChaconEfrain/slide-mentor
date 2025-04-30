'use server'

import { utapi } from "@/app/api/uploadthing/core";
import { savePresentation } from "@/drizzle/presentation"
import { auth } from "@clerk/nextjs/server"

export async function savePresentationAction({ file }: { file: File }) {
  const { userId: clerkId } = await auth();

  try {
    if (!clerkId) throw new Error("Unauthorized");
    if (!file) throw new Error("file is required");

    const { data } = await utapi.uploadFiles(file);
    console.log({ data, file });
    const fileUrl = data?.ufsUrl;
    if (!fileUrl) throw new Error("Failed to upload file");

    const presentation = await savePresentation({ title: file.name, fileUrl });

    return {
      success: "File uploaded successfully",
      presentationId: presentation.id,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return { error: "You don't have permission to upload files" };
      } else if (error.message === "file is required") {
        return { error: "The file is required" };
      } else if (error.message === "Failed to upload file") {
        return { error: "Something went wrong, please try again" };
      }
    }
  }
}