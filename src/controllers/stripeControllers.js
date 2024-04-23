import express from "express";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const StripeControll = async (req, res) => {
  // app.post("/stripe/create-checkout-session", async (req, res) => {
  const line_items = req.body.data.map((item) => {
    return {
      price_data: {
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
        currency: "inr",
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  console.log(req.body);
  const customerName = "John Doe";
  const session = await stripe.checkout.sessions.create({
    // line_items: [
    //   {
    //     price_data: {
    //       currency: "inr",
    //       product_data: {
    //         name: "T-shirt",
    //       },
    //       unit_amount: 100,
    //     },
    //     quantity: 1,
    //   },
    // ],
    line_items,
    customer: "cus_Pyeg4s7294IQRc",
    mode: "payment",
    success_url: "https://shopsphere-web-v1.vercel.app/checkout-success",
    cancel_url: "https://shopsphere-web-v1.vercel.app/cart",
  });

  if (!session) return res.status(500).json({ error: "Internal server error" });
  res.json({
    url: session.url,
  });
  // });
};
