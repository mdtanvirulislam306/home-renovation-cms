import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json<ApiResponse>({ success: false, error: message }, { status });
}
