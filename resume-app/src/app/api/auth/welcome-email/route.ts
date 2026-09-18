import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/welcome-email";
import { handleApiError, ApiError } from "@/lib/errors/api-error";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, fullName } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw ApiError.badRequest("Valid email address is required");
    }

    const result = await sendWelcomeEmail({
      email,
      fullName: fullName || email.split("@")[0],
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
