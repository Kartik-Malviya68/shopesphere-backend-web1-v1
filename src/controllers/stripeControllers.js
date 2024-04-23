import express from "express";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

export const StripeControll = async (req, res) => {
  //   app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/checkout-success",
    cancel_url: "http://localhost:3000/cart",
  });

  if (!session) return res.status(500).json({ error: "Internal server error" });
  res.send({
    url: session.url,
  });
};
