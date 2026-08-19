import { getUser } from "@netlify/identity";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema.js";

export default async (req) => {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  if (req.method === "GET") {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id));
    return Response.json(profile ?? { userId: user.id, vocabList: [], stats: {} });
  }

  if (req.method === "PUT") {
    const body = await req.json();
    const vocabList = Array.isArray(body.vocabList) ? body.vocabList : [];
    const stats = body.stats && typeof body.stats === "object" ? body.stats : {};

    const [saved] = await db
      .insert(profiles)
      .values({ userId: user.id, vocabList, stats })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: { vocabList, stats, updatedAt: new Date() },
      })
      .returning();

    return Response.json(saved);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/profile",
  method: ["GET", "PUT"],
};
