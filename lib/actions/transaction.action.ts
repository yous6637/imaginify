"use server";

import { redirect } from "next/navigation";
import { handleError } from "@/lib/utils";
import { updateCredits } from "./user.actions";
import { transactions } from "@/database/schema";
import { chargily } from "@/database";
import { CheckoutTransactionParams, CreateTransactionParams } from "@/types";
import { CHARGILI_FAIL_URL, CHARGILY_SUCCESS_URL, CHARGILY_WEBHOOK_URL } from "@/constants/variables";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {

  const amount = Number(transaction.amount) * 100;

  const checkout = await chargily.createCheckout({
    amount,
    currency: "dzd",
    description: transaction.plan,
    metadata: transaction,
    webhook_endpoint: CHARGILY_WEBHOOK_URL,
    success_url: CHARGILY_SUCCESS_URL!,
    failure_url: CHARGILI_FAIL_URL,
   
  });
  redirect(checkout.checkout_url);

}

export async function chargilyCheckout(transaction: CheckoutTransactionParams) {
  const checkout = await chargily.createCheckout({
    amount: transaction.amount,
    currency: "dzd",
    description: transaction.plan,
    metadata: transaction,
    webhook_endpoint: CHARGILY_WEBHOOK_URL,
    success_url: CHARGILY_SUCCESS_URL!,
    failure_url: CHARGILI_FAIL_URL,
   
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
