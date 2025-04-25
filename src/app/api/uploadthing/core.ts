import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { auth } from '@clerk/nextjs/server';
import 'dotenv/config';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  presentationUploader: f({
    'application/vnd.ms-powerpoint': {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    'application/pdf': {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { userId } = await auth()

      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export type OurFileRouter = typeof ourFileRouter;
