
STRIPE_SECRET = process.env.STRIPE_SECRET
const stripe = require("stripe")(STRIPE_SECRET);
const expressAsyncHandler = require("express-async-handler");
const YOUR_DOMAIN = "http://localhost:3000";

// const addNewCustomer = async (req,res) => {
//    try{ const customer = await stripe.customers.create({
//       email:req.body.email,
//       description: 'New Customer'
//     })
//     res.status(200).send(customer)
// }
//   catch(error){
//       throw new error(error)
//   }}
const candidatePayment = expressAsyncHandler( async (req, res) => {
    const {line_items,email} = req.body;

     const customer = await stripe.customers.create({
           email:req.body.email,
           description: 'New Customer'
         })
   if (!line_items,!email){
       return res.status(400).json({error:'missing required session parameters'})
   }
   try
   {
    const session = await stripe.checkout.sessions.create({
     payment_method_types:['card'],
      line_items,
      customer:customer.id,
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.status(200).json({ sessionId: session.id });}
    catch(error){
 res.status(400).json({error:'an error ocured ,unable to create session'})
    }
});
module.exports={ candidatePayment }