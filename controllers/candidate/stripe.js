const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const CandidateSkill = require("../../models/CanidateSkill");
const Candidate = require("../../models/users/candidateModel");
const Quizmaster = require("../../models/users/quizmasterModel");
const stripe = require("stripe")(STRIPE_SECRET);
require("dotenv").config();
const YOUR_DOMAIN = "http://formalab.localhost:3000";
const candidatePayment = expressAsyncHandler(async (req, res) => {
  const line_items = req.body.key;
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: req.body.key._id,
      quizmaster: req.body.key.quizmaster,
    },
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    phone_number_collection: {
      enabled: true,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: line_items.skill_name,
            // images: [item.image],
            description: line_items.requirements,
            metadata: {
              id: line_items._id,
            },
          },
          unit_amount: line_items.budget,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer: customer.id,
    success_url: YOUR_DOMAIN + "/success",
    cancel_url: YOUR_DOMAIN + "/cancel",
  });

  res.send({ url: session.url });
});

// create order

const createOrder = expressAsyncHandler(async (customer, data) => {
  const newOrder = new CandidateSkill({
    _id_skill: customer.metadata.cart,
    userId: customer.metadata.userId,
    customerId: data.customer,
    payment_status: data.payment_status,
    _id_quizmaster: customer.metadata.quizmaster,
  });
  try {
    const saveOrder = await newOrder.save();
    if (saveOrder.payment_status === "paid") {
      Quizmaster.findById({ _id: saveOrder._id_quizmaster }).then((result) => {
        Candidate.findById({ _id: saveOrder.userId }).then((candidate) => {
          result.notifications.push(
            candidate.firstName + " " + candidate.lastName + " buy a voucher"
          );
          console.log(result);
          result.save();
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Stripe webHook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret =
//   "whsec_c3fc2387b1a650aa166a71fa872da1d01fdb6667d010b72fa73a2d739b258217";

const webhook = expressAsyncHandler(async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let data;
  let eventType;
  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("WebHook verified");
    } catch (err) {
      console.log("webhook error", err.message);
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
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        console.log(customer);
        createOrder(customer, data);
        console.log("data:", data);
      })
      .catch((err) => console.log(err.message));
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});

module.exports = { candidatePayment, webhook };
