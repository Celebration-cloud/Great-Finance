import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { hasAuthConfig } from "@/lib/env/server";

type Context = { params: Promise<{ path: string[] }> };
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handle(method: Method, request: Request, context: Context) {
  if (!hasAuthConfig()) return NextResponse.json({ success: false, message: "Neon Auth is not configured." }, { status: 503 });
  return getAuth().handler()[method](request, context);
}

export const GET = (request: Request, context: Context) => handle("GET", request, context);
export const POST = (request: Request, context: Context) => handle("POST", request, context);
export const PUT = (request: Request, context: Context) => handle("PUT", request, context);
export const PATCH = (request: Request, context: Context) => handle("PATCH", request, context);
export const DELETE = (request: Request, context: Context) => handle("DELETE", request, context);
