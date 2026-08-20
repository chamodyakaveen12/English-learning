import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { appData } from "../../db/schema.js";

export default async (req: Request) => {
  const id = new URL(req.url).searchParams.get("id");

  if (req.method === "GET") {
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    const [row] = await db.select().from(appData).where(eq(appData.id, id));
    return Response.json({ data: row?.data ?? null });
  }

  if (req.method === "POST") {
    const body = await req.json();
    if (!body?.id) return Response.json({ error: "Missing id" }, { status: 400 });

    await db
      .insert(appData)
      .values({ id: body.id, data: body.data })
      .onConflictDoUpdate({
        target: appData.id,
        set: { data: body.data, updatedAt: new Date() },
      });

    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/app-data",
};
