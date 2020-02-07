<template>
  <div>

    <div class="sr-root">
    <div class="sr-main">
      <div class="sr-payment-summary payment-view">
        <h2>Subscribe to Premium Plan</h2>
      </div>
      <form>
        <div class="sr-payment-form payment-view">
          <div class="sr-form-row">
            <label for="card-element">
              Payment details
            </label>
            <div class="sr-combo-inputs">
              <div class="sr-combo-inputs-row">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  autocomplete="cardholder"
                  class="sr-input"
                />
              </div>
              <div class="sr-combo-inputs-row">
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  autocomplete="cardholder"
                  class="sr-input"
                />
              </div>
              <div class="sr-combo-inputs-row">
                <div class="sr-input sr-card-element" id="card-element"></div>
              </div>
            </div>
            <div class="sr-field-error" id="card-errors" role="alert"></div>
          </div>
          <button id="submit">
            <div id="spinner" class="hidden"></div>
            <span id="button-text">Subscribe</span>
          </button>
          <div class="sr-legal-text">
            Your card will be charged all the five requests
            <span class="order-total">$5.00</span>.
          </div>
        </div>
      </form>
      <div class="sr-payment-summary hidden completed-view">
        <h1>Your subscription is <span class="order-status"></span></h1>
        <h4>
          <a>View subscription response:</a>
        </h4>
      </div>
      <div class="sr-section hidden completed-view">
        <div class="sr-callout">
          <pre><code></code></pre>
        </div>
        <button onclick="window.location.href='/'">Restart demo</button>
      </div>
    </div>
  </div>

  </div>
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'


var stripe;
var stripeElements = function(publicKey) {

  stripe = Stripe(publicKey);
  var elements = stripe.elements();

  // Element styles
  var style = {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: 'rgba(0,0,0,0.4)'
      }
    }
  };

  var card = elements.create('card', { style: style });

  card.mount('#card-element');

  // Element focus ring
  card.on('focus', function() {
    var el = document.getElementById('card-element');
    el.classList.add('focused');
  });

  card.on('blur', function() {
    var el = document.getElementById('card-element');
    el.classList.remove('focused');
  });

  document.querySelector('#submit').addEventListener('click', function(evt) {
    evt.preventDefault();
    changeLoadingState(true);
    // Initiate payment
    createPaymentMethodAndCustomer(stripe, card);
  });
};

function showCardError(error) {
  changeLoadingState(false);
  // The card was declined (i.e. insufficient funds, card has expired, etc)
  var errorMsg = document.querySelector('.sr-field-error');
  errorMsg.textContent = error.message;
  setTimeout(function() {
    errorMsg.textContent = '';
  }, 8000);
}

var createPaymentMethodAndCustomer = function(stripe, card) {
  var cardholderEmail = document.querySelector('#email').value;
  stripe
    .createPaymentMethod('card', card, {
      billing_details: {
        email: cardholderEmail
      }
    })
    .then(function(result) {
      if (result.error) {
        showCardError(result.error);
      } else {
        createCustomer(result.paymentMethod.id, cardholderEmail);
      }
    });
};

async function createCustomer(paymentMethod, cardholderEmail) {
  return fetch('/create-customer', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: cardholderEmail,
      payment_method: paymentMethod
    })
  })
    .then(response => {
      return response.json();
    })
    .then(subscription => {
      handleSubscription(subscription);
    });
}

function handleSubscription(subscription) {
  const { latest_invoice } = subscription;
  const { payment_intent } = latest_invoice;

  if (payment_intent) {
    const { client_secret, status } = payment_intent;

    if (status === 'requires_action' || status === 'requires_payment_method') {
      stripe.confirmCardPayment(client_secret).then(function(result) {
        if (result.error) {
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc)
          changeLoadingState(false);
          showCardError(result.error);
        } else {
          // Show a success message to your customer
          confirmSubscription(subscription.id);
        }
      });
    } else {
      // No additional information was needed
      // Show a success message to your customer
      orderComplete(subscription);
    }
  } else {
    orderComplete(subscription);
  }
}

function confirmSubscription(subscriptionId) {
  return fetch('/subscription', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      subscriptionId: subscriptionId
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(subscription) {
      orderComplete(subscription);
    });
}

function getPublicKey() {
  return fetch('/public-key', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      stripeElements(response.publicKey);
    });
}

getPublicKey();

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(subscription) {
  changeLoadingState(false);
  var subscriptionJson = JSON.stringify(subscription, null, 2);
  document.querySelectorAll('.payment-view').forEach(function(view) {
    view.classList.add('hidden');
  });
  document.querySelectorAll('.completed-view').forEach(function(view) {
    view.classList.remove('hidden');
  });
  document.querySelector('.order-status').textContent = subscription.status;
  document.querySelector('code').textContent = subscriptionJson;
};

// Show a spinner on subscription submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector('#spinner').classList.add('loading');
    document.querySelector('button').disabled = true;

    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.querySelector('button').disabled = false;
    document.querySelector('#spinner').classList.remove('loading');
    document.querySelector('#button-text').classList.remove('hidden');
  }
};

export default{
  locales,
  name: 'createSubscription',
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  created (){
  },
  mounted () {

    stripeElements('pk_test_wguuuEtFtQMMVHpdl8gk2Lhu00e3mmkN5c')



  },
  methods:{
    closeDialog () {
      this.emit('close')
    }
  }


}
</script>
<style>
/* Variables */
:root {
  --gray-offset: rgba(0, 0, 0, 0.03);
  --gray-border: rgba(0, 0, 0, 0.15);
  --gray-light: rgba(0, 0, 0, 0.4);
  --gray-mid: rgba(0, 0, 0, 0.7);
  --gray-dark: rgba(0, 0, 0, 0.9);
  --body-color: var(--gray-mid);
  --headline-color: var(--gray-dark);
  --accent-color: #0066f0;
  --body-font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  --radius: 6px;
  --logo-image: url('https://storage.googleapis.com/stripe-sample-images/KAVHOLM.svg');
  --form-width: 343px;
}


/* Layout */
.sr-root {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 980px;
  align-content: center;
  justify-content: center;
  height: auto;
  margin: 0 auto;
}
.sr-header {
  margin-bottom: 32px;
}
.sr-payment-summary {
  margin-top: 20px;
  margin-bottom: 20px;
}
.sr-main,
.sr-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-self: center;
}
.sr-main {
  width: var(--form-width);
}
.sr-content {
  padding-left: 48px;
}
.sr-legal-text {
  color: var(--gray-light);
  text-align: center;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}
.sr-field-error {
  color: var(--accent-color);
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}

/* Form */
.sr-form-row {
  margin: 16px 0;
}
label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  display: inline-block;
}

/* Inputs */
.sr-input,
.sr-select,
input[type='text'] {
  border: 1px solid var(--gray-border);
  border-radius: var(--radius);
  padding: 5px 12px;
  height: 44px;
  width: 100%;
  transition: box-shadow 0.2s ease;
  background: white;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.sr-input:focus,
input[type='text']:focus,
button:focus,
.focused {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
  z-index: 9;
}
.sr-input::placeholder,
input[type='text']::placeholder {
  color: var(--gray-light);
}

/* Checkbox */
.sr-checkbox-label {
  position: relative;
  cursor: pointer;
}

.sr-checkbox-label input {
  opacity: 0;
  margin-right: 6px;
}

.sr-checkbox-label .sr-checkbox-check {
  position: absolute;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: white;
  border: 1px solid var(--gray-border);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.sr-checkbox-label input:focus ~ .sr-checkbox-check {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
}

.sr-checkbox-label input:checked ~ .sr-checkbox-check {
  background-color: var(--accent-color);
  background-image: url('https://storage.googleapis.com/stripe-sample-images/icon-checkmark.svg');
  background-repeat: no-repeat;
  background-size: 16px;
  background-position: -1px -1px;
}

/* Select */
.sr-select {
  display: block;
  height: 44px;
  margin: 0;
  background-image: url('https://storage.googleapis.com/stripe-sample-images/icon-chevron-down.svg');
  background-repeat: no-repeat, repeat;
  background-position: right 12px top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}
.sr-select:after {
}
.sr-select::-ms-expand {
  display: none;
}
.sr-select:hover {
  cursor: pointer;
}
.sr-select:focus {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
}
.sr-select option {
  font-weight: 400;
}
.sr-select:invalid {
  color: var(--gray-light);
  background-opacity: 0.4;
}

/* Combo inputs */
.sr-combo-inputs {
  display: flex;
  flex-direction: column;
}
.sr-combo-inputs input,
.sr-combo-inputs .sr-select {
  border-radius: 0;
  border-bottom: 0;
}
.sr-combo-inputs > input:first-child,
.sr-combo-inputs > .sr-select:first-child {
  border-radius: var(--radius) var(--radius) 0 0;
}
.sr-combo-inputs > input:last-child,
.sr-combo-inputs > .sr-select:last-child {
  border-radius: 0 0 var(--radius) var(--radius);
  border-bottom: 1px solid var(--gray-border);
}
.sr-combo-inputs > .sr-combo-inputs-row:first-child input:first-child {
  border-radius: var(--radius) 0 0 0;
}
.sr-combo-inputs > .sr-combo-inputs-row:first-child input:last-child {
  border-radius: 0 var(--radius) 0 0;
}
.sr-combo-inputs-row {
  width: 100%;
  display: flex;
}

.sr-combo-inputs-row > input {
  width: 100%;
  border-radius: 0;
}

.sr-combo-inputs > .sr-combo-inputs-row:first-child input:last-child {
  border-radius: var(--radius) var(--radius) 0 0;
}

.sr-combo-inputs-row:not(:first-of-type) .sr-input {
  border-radius: 0 0 var(--radius) var(--radius);
}

/* Buttons and links */
button {
  background: var(--accent-color);
  border-radius: var(--radius);
  color: white;
  border: 0;
  padding: 12px 16px;
  margin-top: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
}
button:hover {
  filter: contrast(115%);
}
button:active {
  transform: translateY(0px) scale(0.98);
  filter: brightness(0.9);
}
button:disabled {
  opacity: 0.5;
  cursor: none;
}

.sr-payment-form button,
.fullwidth {
  width: 100%;
}

a {
  /*color: var(--accent-color);*/
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  filter: brightness(0.8);
}

a:active {
  filter: brightness(0.5);
}

/* Code block */
.sr-callout {
  background: var(--gray-offset);
  padding: 12px;
  border-radius: var(--radius);
  max-height: 400px;
  max-width: 600px;
  overflow: auto;
}
code,
pre {
  font-family: 'SF Mono', 'IBM Plex Mono', 'Menlo', monospace;
  font-size: 14px;
  overflow-x: auto;
  white-space: pre-wrap;
}

/* Stripe Element placeholder */
.sr-card-element {
  padding-top: 12px;
}

/* Responsiveness */
@media (max-width: 720px) {
  .sr-root {
    flex-direction: column;
    justify-content: flex-start;
    padding: 48px 20px;
    min-width: 320px;
  }

  .sr-header__logo {
    background-position: center;
  }

  .sr-payment-summary {
    text-align: center;
  }

  .sr-content {
    display: none;
  }

  .sr-main {
    width: 100%;
  }
}

.sr-root {
  animation: 0.4s form-in;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.sr-payment-form .sr-form-row {
  animation: 0.4s field-in;
  animation-fill-mode: both;
  animation-timing-function: ease;
  transform-origin: 50% 0%;
}

/* need saas for loop :D  */
.sr-payment-form .sr-form-row:nth-child(1) {
  animation-delay: 0;
}
.sr-payment-form .sr-form-row:nth-child(2) {
  animation-delay: 60ms;
}
.sr-payment-form .sr-form-row:nth-child(3) {
  animation-delay: 120ms;
}
.sr-payment-form .sr-form-row:nth-child(4) {
  animation-delay: 180ms;
}
.sr-payment-form .sr-form-row:nth-child(5) {
  animation-delay: 240ms;
}
.sr-payment-form .sr-form-row:nth-child(6) {
  animation-delay: 300ms;
}

.hidden {
  display: none;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

.sr-plans {
  display: flex;
  width: 600px;
}

.sr-plan {
  border: 1px solid rgb(232, 232, 232);
  border-radius: 6px;
  margin-right: 25px;
  height: 226px;
  width: 257px;
}

.sr-plan-inner {
  margin: 28px;
}

.sr-plan-name {
  color: rgb(166, 166, 166);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0px;
}

.sr-plan-text {
  color: rgb(153, 153, 153);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 14px;
}

.sr-plan-button {
  border: 2px solid rgb(237, 95, 116);
  border-radius: 7px;
}

@keyframes field-in {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}

@keyframes form-in {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}


</style>
