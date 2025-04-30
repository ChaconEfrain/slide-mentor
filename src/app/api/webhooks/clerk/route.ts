import { db } from "@/db";
import { users } from "@/db/schema";
import type { UserWebhookEvent, WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { Webhook, WebhookRequiredHeaders } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    } as IncomingHttpHeaders & WebhookRequiredHeaders) as UserWebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  //Create user if doesn't exist
  if (evt.type === "user.created") {
    //insert user if not exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, evt.data.email_addresses[0].email_address),
    });

    if (existingUser) {
      return new Response("User already exists", { status: 200 });
    }

    await db.insert(users).values({
      firstName: evt.data.first_name as string,
      lastName: evt.data.last_name ?? "",
      email: evt.data.email_addresses[0].email_address,
      clerkId: evt.data.id,
    });
  }

  // Return a response to acknowledge receipt of the event
  return new Response("", { status: 200 });
}