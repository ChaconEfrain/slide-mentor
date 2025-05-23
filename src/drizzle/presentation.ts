import { db } from "@/db";
import { presentations, User, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function savePresentation({title, fileUrl}: {title: string, fileUrl: string}) {
  const { userId: clerkId } = await auth();

  if (!clerkId) throw new Error("Unauthorized");

  try {
    const { id: userId } = (await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    })) as User;

    const [presentation] = await db
      .insert(presentations)
      .values({
        userId,
        title,
        fileUrl,
      })
      .returning();

    return presentation;
  } catch (error) {
    console.error("Error saving presentation:", error);
    throw new Error("Failed to save presentation to the database.");
  }
}

export async function getPresentationById({id}: {id: number}) {
  try {
    const presentation = await db.query.presentations.findFirst({
      where: eq(presentations.id, id),
    });

    if (!presentation) throw new Error("Presentation not found");

    return presentation;
  } catch (error) {
    console.error("Error fetching presentation:", error);
    throw new Error("Failed to fetch presentation from the database.");
  }
}
