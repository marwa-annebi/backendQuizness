// STRIPE_SECRET = process.env.STRIPE_SECRET;
// const stripe = require("stripe")(STRIPE_SECRET);
// const expressAsyncHandler = require("express-async-handler");
// const CandidateSkill = require("../../models/CanidateSkill");
// const YOUR_DOMAIN = "http://localhost:3000";
// const uuid = require("uuid").v4;
// const candidatePayment = expressAsyncHandler(async (req, res) => {
//   const { token, skill } = req.body;

//   const customer = await stripe.customers.create({
//     email: token.email,
//     source: token.id,
//   });
//   if ((!token, !skill)) {
//     return res
//       .status(400)
//       .json({ error: "missing required session parameters" });
//   }

//   const idempotency_key = uuid();
//   try {
//     const session = await stripe.checkout.charges.create(
//       {
//         amount: skill.budget,
//         currency: "tnd",
//         customer: customer.id,
//         receipt_email: token.email,
//         description: `Purchased the ${skill.skill_name}`,
//       },
//       {
//         idempotency_key,
//       }
//     );
//     console.log("Charge:", { session });
//     if (session) {
//       await new CandidateSkill({
//         _id_candidate: token._id,
//         _id_skill: skill._id,
//         payed: true,
//       })
//         .save()
//         .then(() => res.status(200).send("Success payment "));
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: "an error ocured ,unable to create session" });
//   }
// });
// module.exports = { candidatePayment };
