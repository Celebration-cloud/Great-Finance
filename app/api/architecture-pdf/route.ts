import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const file = await readFile(path.join(process.cwd(), "output", "pdf", "great-finance-production-architecture.pdf"));
    return new Response(file, { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="great-finance-production-architecture.pdf"', "Cache-Control": "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ success: false, message: "Architecture PDF is unavailable." }, { status: 404 });
  }
}
