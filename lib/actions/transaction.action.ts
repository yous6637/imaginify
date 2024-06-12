"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "@/lib/utils";
import { updateCredits } from "./user.actions";
import { transactions } from "@/database/schema";
import { chargily } from "@/database";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  });

  redirect(session.url!);
}

export async function chargilyCheckout(transaction: CheckoutTransactionParams) {
  const checkout = await chargily.createCheckout({
    amount: transaction.amount,
    currency: "dzd",
    description: transaction.plan,
    "metadata": transaction,
    webhook_endpoint: process.env.CHARGILY_WEBHOOK_URL!,
    success_url: process.env.CHARGILY_SUCCESS_URL!,
    failure_url: process.env.CHARGILI_FAIL_URL,
  });
  redirect(checkout.checkout_url);
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    // Create a new transaction with a buyerId
    const newTransaction = await db.insert(transactions).values({
      ...transaction,
      buyerId: transaction.buyerId,
    });

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
