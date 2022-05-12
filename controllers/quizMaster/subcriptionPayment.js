STRIPE_SECRET = process.env.STRIPE_SECRET;
const stripe = require("stripe")(STRIPE_SECRET);
const expressAsyncHandler = require("express-async-handler");
const subscriptionPayment = expressAsyncHandler(async (req, res) => {
  const { email, payment_method } = req.body;
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: "plan_G......" }],
    expand: ["latest_invoice.payment_intent"],
  });

  const status = subscription["latest_invoice"]["payment_intent"]["status"];
  const client_secret =
    subscription["latest_invoice"]["payment_intent"]["client_secret"];

  res.json({ client_secret: client_secret, status: status });
});
module.exports = { subscriptionPayment };
