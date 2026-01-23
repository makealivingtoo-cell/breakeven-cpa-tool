import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const licenseKey =
      typeof body?.licenseKey === "string" ? body.licenseKey.trim() : "";

    if (!licenseKey) {
      return NextResponse.json(
        { ok: false, message: "Missing license key." },
        { status: 400 }
      );
    }

    const productId = process.env.GUMROAD_PRODUCT_ID;

    if (!productId) {
      return NextResponse.json(
        { ok: false, message: "Server not configured (missing GUMROAD_PRODUCT_ID)." },
        { status: 500 }
      );
    }

    const form = new URLSearchParams();
    form.append("product_id", productId);
    form.append("license_key", licenseKey);

    // Don't burn "uses" while testing / verifying
    form.append("increment_uses_count", "false");

    const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });

    const data = await res.json();

    // Success means license is valid and active
    if (data?.success === true) {
      return NextResponse.json({
        ok: true,
        message: "License verified.",
        purchase: data?.purchase ?? null,
      });
    }

    // If Gumroad returns failure, map to 401
    return NextResponse.json(
      {
        ok: false,
        message: data?.message || "Invalid or inactive license key.",
      },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Verification failed. Try again." },
      { status: 500 }
    );
  }
}
