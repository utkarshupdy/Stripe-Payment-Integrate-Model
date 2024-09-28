import logo from './logo.svg';
import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import './App.css';

// npm install react-stripe-checkout   package for stripe checkout

function App() {
  const [product, setProduct] = useState({
    name: "React from FB",
    price: 10, // Price in dollars
    productBy: "facebook"
  });

  const makePayment = (token) => {
    const body = {
      token,
      product
    };
    const header = {
      "Content-Type": "application/json" // Ready to accept JSON
    };

    // Fire a request to the backend
    return fetch(`http://localhost:8282/payment`, {
      method: "POST",
      headers: header, // Add headers here
      body: JSON.stringify(body)
    })
    .then(response => {
      console.log("RESPONSE", response); // Log the response
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      console.log("DATA", data); // Log the received data
    })
    .catch(error => console.log(error));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a className="App-link" href="#" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_KEY}
          token={makePayment} // Inject makePayment method here
          name="Buy React"
          amount={product.price * 100} // Amount in cents
        >
          <button className="btn-large blue">Buy react in just {product.price} $</button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
