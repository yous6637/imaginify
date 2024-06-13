/* eslint-disable camelcase */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Checkout, verifySignature } from "@/vendor/chargily/src";

import { updateCredits } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
    const CHARGILY_SK = process.env.CHARGILY_SK;
  
    if (!CHARGILY_SK) {
      throw new Error("Please add CHARGILY_SK from Chargily Dashboard to .env or .env.local");
    }
  
    const headerPayload = headers();
  
    let payload: any;
    try {
      payload = await req.json();
    } catch {
      return new NextResponse("Payload is missing or invalid", { status: 400 });
    }
  
    const rawBody = Buffer.from(await req.text(), 'utf-8');
  
    const signature = headerPayload.get("signature");
  
    if (!signature) {
      return new NextResponse("Signature header is missing", { status: 403 });
    }
  
    try {
      if (!verifySignature(rawBody, signature, CHARGILY_SK)) {
        return new NextResponse("Signature is invalid", { status: 403 });
      }
  
      const event: { type: string, data: Checkout } = payload;
  
      switch (event.type) {
        case "checkout.paid":
          const checkout = event.data;
          const customer = checkout.metadata.userId;
  
          await updateCredits(customer, checkout.metadata.credits);
  
          return new NextResponse("Credits updated successfully", { status: 200 });
  
        default:
          return new NextResponse(`Unhandled event type: ${event.type}`, { status: 200 });
      }
  
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new NextResponse("Something went wrong while processing the webhook", { status: 500 });
    }
  }