
STRIPE_SECRET = process.env.STRIPE_SECRET
const stripe = require("stripe")(STRIPE_SECRET);
const expressAsyncHandler = require("express-async-handler");
const YOUR_DOMAIN = "http://localhost:3000";

const candidatePayment = expressAsyncHandler(  async (req, res) => {
    const { category} = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: category.name,
                    },
                    unit_amount: category.amount * 100,
                },
                quantity: category.quantity,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.json({ id: session.id });
});
module.exports={ candidatePayment}