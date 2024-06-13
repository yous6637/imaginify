"use client";
import React from "react";
import { useEffect } from 'react';
import { chargily } from '@/database';
import { toast } from "./ui/use-toast";

type Props = { checkout_id?: string };

const PaymentToast = ({ checkout_id }: Props) => {

    useEffect(() => {
      const referrer = document.referrer;
      const paymentPageBaseURL = "https://pay.chargily.dz/test/checkouts/";
      
      // Check if the referrer starts with the base payment page URL
      if (!referrer.startsWith(paymentPageBaseURL)) {
        return;
      }
  
      // Extract checkout_id from the referrer URL
      const referrerURL = new URL(referrer);
      const referrerPath = referrerURL.pathname;
      const referrerCheckoutId = referrerPath.split('/')[3]; // Assuming checkout_id is the 4th segment in the path
  
      // Check if the extracted checkout_id matches the passed checkout_id
      if (!checkout_id || checkout_id !== referrerCheckoutId) {
        return;
      }
  
      // Fetch the checkout details and display the toast notification
      chargily.getCheckout(checkout_id).then((checkout) => {
        if (checkout.status === "paid") {
          toast({
            title: "Payment Successful",
            description: `${checkout?.metadata?.credits} credits added to your account`,
            duration: 9000,
            color: "green",
          });
        } else {
          toast({
            title: "Payment Failed",
            description: "Please try again",
            duration: 9000,
            color: "red",
          });
        }
      });
    }, [checkout_id]);
  
    return <></>;
  };
  
  export default PaymentToast;