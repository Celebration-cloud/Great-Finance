import { readFile } from "node:fs/promises";
import path from "node:path";
import { errors } from "@/lib/errors/app-error";
import { apiError, createApiContext } from "@/lib/http/api-response";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const context = createApiContext(request, "architecture-pdf.download");
  try {
    const file = await readFile(path.join(process.cwd(), "output", "pdf", "great-finance-production-architecture.pdf"));
    return new Response(file, { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="great-finance-production-architecture.pdf"', "Cache-Control": "public, max-age=3600", "x-request-id": context.requestId } });
  } catch {
    return apiError(context, errors.notFound("Architecture PDF is unavailable."));
  }
}
