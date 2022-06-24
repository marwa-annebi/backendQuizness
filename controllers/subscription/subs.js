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
let endpointSecret;
const PostSession = expressAsyncHandler(async (req, res) => {
  const { priceId, subDomain } = req.body;
  const user = await Quizmaster.findById(req.user._id);

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/quizmaster/${req.user._id}`,
      cancel_url: `http://${subDomain}.localhost:3000/subscription`,
      metadata: { userId: req.user._id.toString() },
    },
    {
      apiKey: process.env.STRIPE_SECRET,
    }
  );
  console.log("session", session);
  return res.json(session);
});

const updateUser = async (data) => {
  try {
    // console.log("subsc", subsc);
    console.log("data", data);
    const filter = { stripeCustomerId: data.customer };
    const update = {
      endPack: new Date(data.current_period_end * 1000),
      startPack: new Date(data.current_period_start * 1000),
    };
    const user = await Quizmaster.updateOne(filter, update);
    console.log("user", user);
  } catch (error) {
    console.log(error.message);
  }
};

const webhook = expressAsyncHandler(async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let data;
  let eventType;
  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    event = event.type;
  } else {
    data = request.body.data.object;
    eventType = request.body.type;
  }
  //handle event
  // console.log("*******", data)
  if (eventType === "customer.subscription.updated") {
    stripe.customers
      .retrieve(data.customer)
      .then((subsc) => {
        updateUser(data);
      })
      .catch((err) => console.log(err.message));
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});

const testPlan = expressAsyncHandler(async (req, res) => {
  const { endPack } = req.body;
  if (endPack > new Date()) {
    res.status(200).send("Ok");
  } else {
    res.status(400).send("date expired");
  }
});

module.exports = { getPrices, PostSession, webhook, testPlan };
