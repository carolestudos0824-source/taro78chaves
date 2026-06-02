import Stripe from "npm:stripe";

const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
const PRICE_MONTHLY = Deno.env.get("STRIPE_PRICE_MONTHLY");

if (!STRIPE_SECRET) {
  console.error("STRIPE_SECRET_KEY not set");
  Deno.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET);

async function check() {
  console.log("--- Checking Stripe Account ---");
  try {
    const account = await stripe.accounts.retrieve();
    console.log("Account ID:", account.id);
    console.log("Country:", account.country);
    console.log("Capabilities:", JSON.stringify(account.capabilities, null, 2));
    
    // Check if Pix is enabled for the account if possible
    // Note: account.capabilities might not show 'pix_payments' explicitly in all API versions
    // better to check payment method configurations if possible, but retrieve() is a good start.
  } catch (e) {
    console.error("Error retrieving account:", e.message);
  }

  if (PRICE_MONTHLY) {
    console.log("\n--- Checking Price ---");
    try {
      const price = await stripe.prices.retrieve(PRICE_MONTHLY);
      console.log("Price ID:", price.id);
      console.log("Amount:", price.unit_amount / 100);
      console.log("Currency:", price.currency);
      console.log("Type:", price.type);
      if (price.recurring) {
        console.log("Interval:", price.recurring.interval);
      }
    } catch (e) {
      console.error("Error retrieving price:", e.message);
    }
  } else {
    console.log("\nSTRIPE_PRICE_MONTHLY not set");
  }

  console.log("\n--- Creating Test Checkout Session for BRL ---");
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"],
      line_items: [{
        price_data: {
          currency: "brl",
          product_data: { name: "Test Pix" },
          unit_amount: 2700,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      mode: "subscription",
      success_url: "https://example.com/success",
    });
    console.log("Test Session Created with 'pix' type!");
    console.log("Session URL:", session.url);
  } catch (e) {
    console.warn("Could NOT create session with 'pix' explicitly. Account might not have Pix enabled or support it for subscriptions.");
    console.error("Error:", e.message);
    
    // Try without explicit pix to see what defaults are
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: {
            currency: "brl",
            product_data: { name: "Test Default" },
            unit_amount: 2700,
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        success_url: "https://example.com/success",
      });
      console.log("Default Session Created. Check available_payment_methods in Stripe Dashboard for session:", session.id);
    } catch (e2) {
      console.error("Error creating default session:", e2.message);
    }
  }
}

check();
