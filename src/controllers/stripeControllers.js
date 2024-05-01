import express from "express";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const StripeControll = async (req, res) => {
  // app.post("/stripe/create-checkout-session", async (req, res) => {
  const line_items = req.body.data.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.img],
          description: item.name,
          metadata: {
            id: item._id,
            size: item.size,
            color: item.color,
          },
        },
        // address: {
        //   country: "IN",
        // },
        unit_amount: item.price * 100,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 10,
      },
      mode: "payment",
      quantity: item.quantity,
    };
  });

  console.log(req.body);
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: "https://shopsphere-web-v1.vercel.app/checkout-success",
    cancel_url: "https://shopsphere-web-v1.vercel.app/cart",
  });

  res.json({
    url: session.url,
  });
  // });
};
