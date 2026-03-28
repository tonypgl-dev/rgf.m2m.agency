import Stripe from "stripe";

/** Server-side only — never import in client components. */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia" as Stripe.LatestApiVersion,
    });
  }
  return _stripe;
}
