const cors = require("cors");
const express = require("express");
const Stripe = require("stripe");
const { v4: uuidv4 } = require('uuid');

const stripe = new Stripe("sk_test_51Q40cHLwzTWKc7gc9zPkSMZwOjtTLpU3R4aUwc27YVOyvq6g4D7T9Er0tu8p7BTpiHG3zSmIRr0ECjdcu3RtnzkX00UfjHdIWM");

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors());

// Route
app.get("/", (req, res) => {
  res.send("IT WORKS COMPLETELY FINE");
});

app.post("/payment", (req, res) => {
  console.log("REQUEST BODY", req.body); // Log the entire request body
  const { product, token } = req.body;

  if (!product || !token) {
    return res.status(400).send({ error: "Missing product or token information." });
  }

  console.log("PRODUCT", product);
  console.log("PRICE", product.price);

  const idempotencyKey = uuidv4();

  return stripe.customers.create({
    email: token.email,
    source: token.id,
  }).then(customer => {
    return stripe.charges.create({
      amount: product.price * 100,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: `Purchase of ${product.name}`,
      shipping: {
        name: token.card.name,
        address: {
          country: token.card.address_country,
        },
      },
    }, { idempotencyKey });
  }).then(result => res.status(200).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Payment processing error." });
    });
});

// Listen
app.listen(8282, () => console.log("LISTENING AT PORT 8282")); // Port number
