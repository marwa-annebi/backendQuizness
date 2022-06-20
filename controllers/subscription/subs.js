const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Stripe = require("stripe");
const Quizmaster = require("../../models/users/quizmasterModel");

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2020-08-27",
});

const getPrices = expressAsyncHandler(async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      apiKey: process.env.STRIPE_SECRET,
    });
    return res.json(prices);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const PostSession = expressAsyncHandler(async (req, res) => {
  const { priceId, subDomain } = req.body;
  const user = Quizmaster.findById(req.user._id);
  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `http://${subDomain}.localhost:3000/dashboard/quizMaster/statistics`,
      cancel_url: `http://${subDomain}.localhost:3000/subscription`,
      customer: user.stripeCustomerId,
    },
    {
      apiKey: process.env.STRIPE_SECRET,
    }
  );
  return res.json(session);
});

module.exports = { getPrices, PostSession };
