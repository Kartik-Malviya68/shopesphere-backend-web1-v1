import Stripe from "stripe";

// Initialize lazily so a missing STRIPE_SECRET_KEY doesn't crash at import time.
let stripe;
const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

export const StripeControll = async (req, res) => {
  try {
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
      quantity: item.quantity,
    };
  });

    const session = await getStripe().checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: "https://shopsphere-web-v1.vercel.app/checkout-success",
      cancel_url: "https://shopsphere-web-v1.vercel.app/cart",
    });

    res.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
